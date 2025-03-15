'use client';

import type { AIModelConfig, UserAIConfig } from '@/services/ai/MarketingAI';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import ModelList from './ModelList';

type Provider = 'huggingface' | 'openai' | 'replicate';
type ContentType = 'text' | 'image' | 'video' | 'audio';

type ApiKeys = {
  huggingface: string;
  openai: string;
  replicate: string;
};

type NewModel = {
  name: string;
  provider: Provider;
  modelId: string;
  type: ContentType;
  description: string;
  parameters: Record<string, unknown>;
};

export default function AIModelsSettingsPage() {
  const queryClient = useQueryClient();
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    huggingface: '',
    openai: '',
    replicate: '',
  });
  const [newModel, setNewModel] = useState<NewModel>({
    name: '',
    provider: 'huggingface',
    modelId: '',
    type: 'text',
    description: '',
    parameters: {},
  });

  const { data: config, isLoading } = useQuery<UserAIConfig>({
    queryKey: ['aiConfig'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user/ai-config');
        if (!response.ok) {
          throw new Error('Failed to fetch AI configuration');
        }
        return response.json();
      } catch (err) {
        toast.error('Failed to fetch AI configuration');
        throw err;
      }
    },
  });

  const updateConfig = useMutation({
    mutationFn: async (newConfig: UserAIConfig) => {
      try {
        const response = await fetch('/api/user/ai-config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newConfig),
        });
        if (!response.ok) {
          throw new Error('Failed to update AI configuration');
        }
        return response.json();
      } catch (err) {
        toast.error('Failed to update AI configuration');
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
    },
  });

  const validateModel = useMutation({
    mutationFn: async (modelData: { model: AIModelConfig; apiKey: string }) => {
      const response = await fetch('/api/user/ai-config/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to validate model');
      }
      return response.json();
    },
  });

  const addModel = useMutation({
    mutationFn: async (model: AIModelConfig) => {
      const response = await fetch('/api/user/ai-config/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(model),
      });
      if (!response.ok) {
        throw new Error('Failed to add model');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
      setIsAddingModel(false);
      setNewModel({
        name: '',
        provider: 'huggingface',
        modelId: '',
        type: 'text',
        description: '',
        parameters: {},
      });
    },
  });

  const handleApiKeyChange = (provider: Provider, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
    if (config) {
      const newConfig = {
        ...config,
        [provider]: {
          ...config[provider],
          apiKey: value,
        },
      };
      updateConfig.mutate(newConfig);
    }
  };

  const handleProviderChange = (value: string) => {
    if (value === 'huggingface' || value === 'openai' || value === 'replicate') {
      setNewModel(prev => ({ ...prev, provider: value }));
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === 'text' || value === 'image' || value === 'video' || value === 'audio') {
      setNewModel(prev => ({ ...prev, type: value }));
    }
  };

  const handleAddModel = async () => {
    if (!config || !newModel.provider || !newModel.name || !newModel.modelId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const apiKey = apiKeys[newModel.provider];
      if (!apiKey) {
        toast.error(`Please add your ${newModel.provider} API key first`);
        return;
      }

      const validation = await validateModel.mutateAsync({
        model: {
          id: newModel.modelId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          ...newModel,
          isEnabled: true,
        },
        apiKey,
      });

      const modelConfig: AIModelConfig = {
        id: newModel.modelId.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        ...newModel,
        parameters: validation.defaultParams,
        isEnabled: true,
      };

      const newConfig = {
        ...config,
        [newModel.provider]: {
          ...config[newModel.provider],
          models: [...config[newModel.provider].models, modelConfig],
        },
      };

      await updateConfig.mutateAsync(newConfig);
      toast.success('Model added successfully');

      setNewModel({
        name: '',
        provider: 'huggingface',
        modelId: '',
        type: 'text',
        description: '',
        parameters: {},
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to add model');
      }
    }
  };

  const handleToggleModel = async (model: AIModelConfig, provider: string) => {
    if (!config) {
      return;
    }

    const updatedModel = {
      ...model,
      isEnabled: !model.isEnabled,
    };

    const newConfig = {
      ...config,
      [provider]: {
        ...config[provider],
        models: config[provider].models.map(m =>
          m.id === model.id ? updatedModel : m,
        ),
      },
    };

    try {
      await updateConfig.mutateAsync(newConfig);
      toast.success(`${model.name} ${updatedModel.isEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error('Failed to update model status');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">API Keys</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your API keys to use AI models from different providers.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="huggingface-key" className="block text-sm font-medium text-gray-700">
                  Hugging Face API Key
                </label>
                <input
                  id="huggingface-key"
                  type="password"
                  value={apiKeys.huggingface}
                  onChange={e => handleApiKeyChange('huggingface', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Enter your Hugging Face API key"
                />
              </div>
              <div>
                <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700">
                  OpenAI API Key
                </label>
                <input
                  id="openai-key"
                  type="password"
                  value={apiKeys.openai}
                  onChange={e => handleApiKeyChange('openai', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Enter your OpenAI API key"
                />
              </div>
              <div>
                <label htmlFor="replicate-key" className="block text-sm font-medium text-gray-700">
                  Replicate API Key
                </label>
                <input
                  id="replicate-key"
                  type="password"
                  value={apiKeys.replicate}
                  onChange={e => handleApiKeyChange('replicate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Enter your Replicate API key"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">AI Models</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure AI models for different content types.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                  Provider
                </label>
                <select
                  id="provider"
                  name="provider"
                  value={newModel.provider}
                  onChange={e => handleProviderChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Select AI model provider"
                >
                  <option value="huggingface">Hugging Face</option>
                  <option value="openai">OpenAI</option>
                  <option value="replicate">Replicate</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Content Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newModel.type}
                  onChange={e => handleTypeChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Select content type"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>

              <div className="col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Model Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newModel.name}
                  onChange={e => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Enter model name"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="modelId" className="block text-sm font-medium text-gray-700">
                  Model ID
                </label>
                <input
                  type="text"
                  name="modelId"
                  id="modelId"
                  value={newModel.modelId}
                  onChange={e => setNewModel(prev => ({ ...prev, modelId: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Enter model ID"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newModel.description}
                  onChange={e => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Enter model description"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleAddModel}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                title="Add a new AI model"
                aria-label="Add a new AI model to your configuration"
              >
                <PlusIcon className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                <span>Add New Model</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {config && <ModelList config={config} onToggleModel={handleToggleModel} />}
    </div>
  );
}
