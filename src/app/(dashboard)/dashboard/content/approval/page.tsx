'use client';

import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  CheckIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type ContentStatus = 'pending' | 'approved' | 'rejected';

type ContentItem = {
  id: string;
  title: string;
  description: string;
  type: 'post' | 'article' | 'video';
  platform: string;
  author: {
    name: string;
    avatar: string;
  };
  status: ContentStatus;
  scheduledFor?: string;
  comments: {
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
};

export default function ContentApprovalPage() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const { data: contentItems, isLoading } = useQuery<ContentItem[]>({
    queryKey: ['content-approvals'],
    queryFn: async () => {
      const response = await fetch('/api/content/approvals');
      if (!response.ok) {
        throw new Error('Failed to fetch content items');
      }
      return response.json();
    },
  });

  const updateContentStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ContentStatus;
    }) => {
      const response = await fetch(`/api/content/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update content status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-approvals'] });
    },
  });

  const addComment = useMutation({
    mutationFn: async ({
      contentId,
      text,
    }: {
      contentId: string;
      text: string;
    }) => {
      const response = await fetch(`/api/content/${contentId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-approvals'] });
      setComment('');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Content Approval Queue
              </h2>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Content List */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Pending Content
                </h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {contentItems?.map(item => (
                      <li
                        key={item.id}
                        className="py-5 cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedContent(item)}
                      >
                        <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                          <h3 className="text-sm font-semibold text-gray-800">
                            <span className="absolute inset-0" aria-hidden="true" />
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-2 flex items-center gap-x-2">
                            <p className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                              {item.platform}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Content Details */}
            {selectedContent && (
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedContent.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedContent.description}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {selectedContent.author.name}
                          </span>
                        </div>
                        {selectedContent.scheduledFor && (
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Scheduled for
                              {' '}
                              {new Date(
                                selectedContent.scheduledFor,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Comments
                      </h4>
                      <div className="mt-3 space-y-4">
                        {selectedContent.comments.map(comment => (
                          <div key={comment.id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <UserCircleIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {comment.author}
                              </p>
                              <p className="text-sm text-gray-500">
                                {comment.text}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Comment */}
                      <div className="mt-4">
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <UserCircleIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <textarea
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                              />
                            </div>
                            <div className="mt-3 flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  addComment.mutate({
                                    contentId: selectedContent.id,
                                    text: comment,
                                  })}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                                Comment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Approval Actions */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateContentStatus.mutate({
                              id: selectedContent.id,
                              status: 'rejected',
                            })}
                          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          <XMarkIcon className="h-5 w-5 mr-2" />
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateContentStatus.mutate({
                              id: selectedContent.id,
                              status: 'approved',
                            })}
                          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >
                          <CheckIcon className="h-5 w-5 mr-2" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
