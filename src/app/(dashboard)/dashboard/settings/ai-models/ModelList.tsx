import type { AIModelConfig, UserAIConfig } from '@/services/ai/MarketingAI';
import { Switch } from '@headlessui/react';

type ModelListProps = {
  config: UserAIConfig;
  onToggleModel: (model: AIModelConfig, provider: string) => void;
};

export default function ModelList({ config, onToggleModel }: ModelListProps) {
  return (
    <div className="mt-8 space-y-8">
      {Object.entries(config).map(([provider, { models }]) => (
        <div key={provider} className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 capitalize">
              {provider}
              {' '}
              Models
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {models.map(model => (
                <div
                  key={model.id}
                  className="relative flex flex-col p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{model.name}</h4>
                    <Switch
                      checked={model.isEnabled}
                      onChange={() => onToggleModel(model, provider)}
                      className={`${
                        model.isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span className="sr-only">
                        {model.isEnabled ? 'Disable' : 'Enable'}
                        {' '}
                        {model.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`${
                          model.isEnabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 flex-grow">{model.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {model.type}
                    </span>
                    {Object.entries(model.parameters).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                        title={`${key}: ${JSON.stringify(value)}`}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
