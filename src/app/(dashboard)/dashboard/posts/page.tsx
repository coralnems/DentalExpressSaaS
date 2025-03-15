'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import MediaUpload from '@/components/MediaUpload';
import { 
  ShareIcon, 
  PhotoIcon, 
  CalendarIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Post {
  id: string;
  content: string;
  platforms: string[];
  mediaUrls: string[];
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { addNotification } = useNotification();
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [] as string[],
    mediaUrls: [] as string[],
    scheduledFor: '',
  });

  useEffect(() => {
    // Simulated post status updates
    const interval = setInterval(() => {
      setPosts((currentPosts) => {
        return currentPosts.map((post) => {
          if (post.status === 'scheduled' && new Date(post.scheduledFor) <= new Date()) {
            // Simulate random success/failure
            const success = Math.random() > 0.1;
            const newStatus = success ? 'published' : 'failed';
            
            addNotification(
              success ? 'success' : 'error',
              success
                ? `Post "${post.content.substring(0, 30)}..." has been published`
                : `Failed to publish post "${post.content.substring(0, 30)}..."`
            );

            return { ...post, status: newStatus };
          }
          return post;
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [addNotification]);

  const handleCreatePost = async () => {
    if (!newPost.content) {
      addNotification('error', 'Please enter post content');
      return;
    }

    if (newPost.platforms.length === 0) {
      addNotification('error', 'Please select at least one platform');
      return;
    }

    const post: Post = {
      id: Math.random().toString(36).substring(2),
      ...newPost,
      status: newPost.scheduledFor ? 'scheduled' : 'published',
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost({
      content: '',
      platforms: [],
      mediaUrls: [],
      scheduledFor: '',
    });
    setShowNewPostForm(false);

    addNotification(
      'success',
      post.status === 'scheduled'
        ? `Post scheduled for ${new Date(post.scheduledFor).toLocaleString()}`
        : 'Post created successfully'
    );
  };

  const handleMediaUpload = (files: File[]) => {
    // Simulate media upload
    const urls = files.map((file) => URL.createObjectURL(file));
    setNewPost((prev) => ({
      ...prev,
      mediaUrls: [...prev.mediaUrls, ...urls],
    }));
    addNotification('success', 'Media uploaded successfully');
  };

  const handleDeletePost = (postId: string) => {
    // TODO: Implement post deletion
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Posts
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowNewPostForm(true)}
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Create Post
          </button>
        </div>
      </div>

      {showNewPostForm && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={newPost.content}
                    onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Media</label>
                <MediaUpload onUpload={handleMediaUpload} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Platforms</label>
                <div className="mt-2 space-x-4">
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
                    <label key={platform} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={newPost.platforms.includes(platform)}
                        onChange={(e) => {
                          setNewPost((prev) => ({
                            ...prev,
                            platforms: e.target.checked
                              ? [...prev.platforms, platform]
                              : prev.platforms.filter((p) => p !== platform),
                          }));
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-600">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700">
                  Schedule For
                </label>
                <div className="mt-1">
                  <input
                    type="datetime-local"
                    id="scheduledFor"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={newPost.scheduledFor}
                    onChange={(e) =>
                      setNewPost((prev) => ({ ...prev, scheduledFor: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePost}
                  className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.content}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'scheduled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : post.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Platforms: {post.platforms.join(', ')}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {post.scheduledFor
                        ? `Scheduled for ${new Date(post.scheduledFor).toLocaleString()}`
                        : `Created at ${new Date(post.createdAt).toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 