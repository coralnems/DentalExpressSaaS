'use client';

import { useUser } from '@clerk/nextjs';
import {
  CalendarIcon,
  ChartBarIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const posts = [
  {
    id: 1,
    title: 'New Product Launch',
    excerpt: 'Introducing our latest innovation...',
    status: 'draft',
    platform: 'Facebook',
    scheduledFor: '2024-03-20T10:00:00Z',
    engagement: {
      likes: 0,
      shares: 0,
      comments: 0,
    },
  },
  {
    id: 2,
    title: 'Customer Success Story',
    excerpt: 'How our product helped...',
    status: 'published',
    platform: 'Twitter',
    publishedAt: '2024-03-15T14:30:00Z',
    engagement: {
      likes: 245,
      shares: 56,
      comments: 23,
    },
  },
  {
    id: 3,
    title: 'Behind the Scenes',
    excerpt: 'Take a look at our team...',
    status: 'scheduled',
    platform: 'Instagram',
    scheduledFor: '2024-03-25T15:00:00Z',
    engagement: {
      likes: 0,
      shares: 0,
      comments: 0,
    },
  },
];

const mediaItems = [
  {
    id: 1,
    name: 'product-launch.jpg',
    type: 'image',
    size: '2.4 MB',
    url: 'https://example.com/images/product-launch.jpg',
    uploadedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'team-video.mp4',
    type: 'video',
    size: '15.8 MB',
    url: 'https://example.com/videos/team-video.mp4',
    uploadedAt: '2024-03-14T16:30:00Z',
  },
];

export default function ContentPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('posts');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [_selectedItem, setSelectedItem] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your posts and media assets
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Create New
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('posts')}
            className={`${
              activeTab === 'posts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`${
              activeTab === 'media'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Media Library
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'posts'
        ? (
            <div className="bg-white shadow rounded-lg">
              <ul className="divide-y divide-gray-200">
                {posts.map(post => (
                  <li key={post.id} className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{post.excerpt}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                              post.status,
                            )}`}
                          >
                            {post.status}
                          </span>
                          <span className="text-sm text-gray-500">{post.platform}</span>
                          {post.status === 'scheduled' && post.scheduledFor && (
                            <span className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="mr-1.5 h-4 w-4" />
                              {new Date(post.scheduledFor).toLocaleDateString()}
                            </span>
                          )}
                          {post.status === 'published' && (
                            <span className="flex items-center text-sm text-gray-500">
                              <ChartBarIcon className="mr-1.5 h-4 w-4" />
                              {`${post.engagement.likes} likes • ${post.engagement.shares} shares • ${post.engagement.comments} comments`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-4">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          aria-label="Edit post"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Delete post"
                          onClick={() => {
                            setSelectedItem(post);
                            setShowDeleteModal(true);
                          }}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        : (
            <div className="bg-white shadow rounded-lg">
              <ul className="divide-y divide-gray-200">
                {mediaItems.map(item => (
                  <li key={item.id} className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>{item.type}</span>
                            <span>{item.size}</span>
                            <span>
                              {new Date(item.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-4">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Delete media item"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDeleteModal(true);
                          }}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Delete
                    {' '}
                    {activeTab === 'posts' ? 'Post' : 'Media'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this
                      {' '}
                      {activeTab === 'posts' ? 'post' : 'media item'}
                      ? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setShowDeleteModal(false)}
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
