'use client';

import { useUser } from '@clerk/nextjs';
import {
  CalendarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useState } from 'react';

const platforms = [
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-100 text-blue-800' },
  { id: 'twitter', name: 'Twitter', color: 'bg-sky-100 text-sky-800' },
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-100 text-pink-800' },
];

const scheduledPosts = [
  {
    id: 1,
    title: 'New Treatment Announcement',
    content: 'Excited to announce our new dental treatment options...',
    platform: 'facebook',
    date: '2024-03-20T10:00',
    status: 'scheduled',
  },
  {
    id: 2,
    title: 'Patient Success Story',
    content: 'Check out this amazing transformation...',
    platform: 'instagram',
    date: '2024-03-21T14:30',
    status: 'draft',
  },
  {
    id: 3,
    title: 'Healthcare Tips',
    content: 'Follow these simple steps for better oral health...',
    platform: 'twitter',
    date: '2024-03-22T09:00',
    status: 'scheduled',
  },
];

export default function SchedulePage() {
  const { user } = useUser();
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Schedule</h2>
          <p className="mt-1 text-sm text-gray-500">
            Plan and schedule your social media content
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowNewPostModal(true)}
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Posts</h3>
          <div className="flex space-x-3">
            {platforms.map(platform => (
              <span
                key={platform.id}
                className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${platform.color}`}
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-hidden">
            <ul role="list" className="divide-y divide-gray-200">
              {scheduledPosts.map((post) => {
                const platform = platforms.find(p => p.id === post.platform);
                return (
                  <li key={post.id} className="p-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {post.title}
                          </p>
                          <span
                            className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              platform?.color
                            }`}
                          >
                            {platform?.name}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 truncate">
                            {post.content}
                          </p>
                        </div>
                      </div>
                      <div className="ml-6 flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-5 w-5 mr-1.5 text-gray-400" />
                            {format(new Date(post.date), 'MMM d, yyyy h:mm a')}
                          </div>
                          <span
                            className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              post.status === 'scheduled'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {post.status.charAt(0).toUpperCase()
                              + post.status.slice(1)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Create New Post
                  </h3>
                  <div className="mt-2">
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter post title"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="content"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Content
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Write your post content..."
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="platform"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Platform
                        </label>
                        <select
                          id="platform"
                          name="platform"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {platforms.map(platform => (
                            <option key={platform.id} value={platform.id}>
                              {platform.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Schedule Date
                        </label>
                        <input
                          type="datetime-local"
                          name="date"
                          id="date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  onClick={() => setShowNewPostModal(false)}
                >
                  Schedule Post
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => setShowNewPostModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
