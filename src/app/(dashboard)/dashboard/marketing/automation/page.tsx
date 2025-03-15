'use client';

import type { MarketingChannel, MarketingFlow } from '@/services/ai/MarketingAI';
import {
  ArrowPathIcon,
  ChartBarIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function MarketingAutomationPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [objective, setObjective] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<MarketingChannel[]>([]);
  const [constraints, setConstraints] = useState({
    postingFrequency: 'daily',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    contentStyle: 'professional',
    maxPostsPerDay: 3,
  });
  const queryClient = useQueryClient();

  const { data: flows, isLoading } = useQuery<MarketingFlow[]>({
    queryKey: ['marketing-flows'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/flows');
      if (!response.ok) {
        throw new Error('Failed to fetch marketing flows');
      }
      return response.json();
    },
  });

  const createFlow = useMutation({
    mutationFn: async (data: {
      objective: string;
      channels: MarketingChannel[];
      constraints: typeof constraints;
    }) => {
      const response = await fetch('/api/marketing/flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create marketing flow');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-flows'] });
      setIsCreating(false);
      setObjective('');
      setSelectedChannels([]);
      setConstraints({
        postingFrequency: 'daily',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        contentStyle: 'professional',
        maxPostsPerDay: 3,
      });
    },
  });

  const updateFlowStatus = useMutation({
    mutationFn: async ({
      flowId,
      status,
    }: {
      flowId: string;
      status: 'active' | 'paused';
    }) => {
      const response = await fetch(`/api/marketing/flows/${flowId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update flow status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-flows'] });
    },
  });

  const channels: { id: MarketingChannel; name: string; description: string }[] = [
    {
      id: 'blog',
      name: 'Blog',
      description: 'Create and publish blog articles',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Post tweets and engage with followers',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Share professional content and articles',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Share visual content and stories',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Post updates and engage with community',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Create short-form video content',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Automated messaging and support',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Business messaging and customer service',
    },
    {
      id: 'email',
      name: 'Email',
      description: 'Send newsletters and campaigns',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              AI Marketing Automation
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage AI-powered marketing flows across multiple channels
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Flow
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Create New Marketing Flow
              </h3>
              <div className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="objective"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Marketing Objective
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="objective"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={objective}
                      onChange={e => setObjective(e.target.value)}
                      placeholder="e.g., Increase brand awareness and drive engagement with healthcare professionals"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium leading-6 text-gray-900">
                    Marketing Channels
                  </label>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {channels.map(channel => (
                      <div
                        key={channel.id}
                        className="relative flex items-start p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="min-w-0 flex-1 text-sm">
                          <label
                            htmlFor={channel.id}
                            className="font-medium text-gray-700 select-none"
                          >
                            {channel.name}
                          </label>
                          <p
                            id={`${channel.id}-description`}
                            className="text-gray-500"
                          >
                            {channel.description}
                          </p>
                        </div>
                        <div className="ml-3 flex h-5 items-center">
                          <input
                            id={channel.id}
                            aria-describedby={`${channel.id}-description`}
                            type="checkbox"
                            checked={selectedChannels.includes(channel.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedChannels([...selectedChannels, channel.id]);
                              } else {
                                setSelectedChannels(
                                  selectedChannels.filter(c => c !== channel.id),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="posting-frequency"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Posting Frequency
                  </label>
                  <select
                    id="posting-frequency"
                    value={constraints.postingFrequency}
                    onChange={e =>
                      setConstraints({
                        ...constraints,
                        postingFrequency: e.target.value,
                      })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={constraints.timezone}
                    onChange={e =>
                      setConstraints({ ...constraints, timezone: e.target.value })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    {Intl.supportedValuesOf('timeZone').map(tz => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="content-style"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Content Style
                  </label>
                  <select
                    id="content-style"
                    value={constraints.contentStyle}
                    onChange={e =>
                      setConstraints({
                        ...constraints,
                        contentStyle: e.target.value,
                      })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="humorous">Humorous</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="max-posts"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Maximum Posts per Day
                  </label>
                  <input
                    type="number"
                    id="max-posts"
                    min="1"
                    max="10"
                    value={constraints.maxPostsPerDay}
                    onChange={e =>
                      setConstraints({
                        ...constraints,
                        maxPostsPerDay: parseInt(e.target.value, 10),
                      })}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      createFlow.mutate({
                        objective,
                        channels: selectedChannels,
                        constraints,
                      })}
                    disabled={!objective || selectedChannels.length === 0}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  >
                    Create Flow
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Active Marketing Flows
            </h3>
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {flows?.map(flow => (
                  <li key={flow.id} className="py-5">
                    <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {flow.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {flow.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateFlowStatus.mutate({
                                flowId: flow.id,
                                status: flow.status === 'active' ? 'paused' : 'active',
                              })}
                            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                              flow.status === 'active'
                                ? 'bg-yellow-600 text-white hover:bg-yellow-500 focus-visible:outline-yellow-600'
                                : 'bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-600'
                            }`}
                          >
                            {flow.status === 'active' ? (
                              <>
                                <PauseIcon className="h-5 w-5 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <PlayIcon className="h-5 w-5 mr-2" />
                                Activate
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            <ChartBarIcon className="h-5 w-5 mr-2" />
                            Analytics
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                            Regenerate
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-x-2">
                        <p className="text-xs text-gray-500">
                          Created {new Date(flow.createdAt).toLocaleDateString()}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          {flow.steps.length} steps
                        </span>
                        {flow.analytics && (
                          <>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                              {flow.analytics.impressions.toLocaleString()} impressions
                            </span>
                            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                              {flow.analytics.engagement.toLocaleString()} engagements
                            </span>
                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                              {flow.analytics.conversions} conversions
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
