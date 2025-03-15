'use client';

import { useUser } from '@clerk/nextjs';
import { ClockIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

type SocialStats = {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
};

type RecentActivity = {
  id: number;
  type: string;
  platform: string;
  content: string;
  status: string;
  timestamp: string;
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<SocialStats[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    // TODO: Fetch real data from API for the specific user
    setStats([
      { platform: 'Facebook', followers: 5200, engagement: 3.2, posts: 142 },
      { platform: 'Twitter', followers: 2800, engagement: 2.8, posts: 89 },
      { platform: 'Instagram', followers: 8900, engagement: 4.5, posts: 234 },
      { platform: 'LinkedIn', followers: 1500, engagement: 2.1, posts: 56 },
    ]);

    setRecentActivities([
      {
        id: 1,
        type: 'post',
        platform: 'Facebook',
        content: 'New dental care tips for summer!',
        status: 'published',
        timestamp: '2 hours ago',
      },
      {
        id: 2,
        type: 'schedule',
        platform: 'Instagram',
        content: 'Before & After: Smile Makeover',
        status: 'scheduled',
        timestamp: 'Tomorrow at 10:00 AM',
      },
    ]);
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome,
            {' '}
            {user.firstName || user.username}
            !
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your social media presence
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.platform}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="truncate text-sm font-medium text-gray-500">
              {stat.platform}
            </div>
            <div className="mt-1 space-y-1">
              <p className="truncate text-xl font-semibold text-gray-900">
                {stat.followers.toLocaleString()}
                {' '}
                Followers
              </p>
              <p className="truncate text-sm text-gray-500">
                {stat.engagement}
                % Engagement Rate
              </p>
              <p className="truncate text-sm text-gray-500">
                {stat.posts}
                {' '}
                Total Posts
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {recentActivities.map(activity => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {activity.type === 'post'
                        ? (
                            <ShareIcon className="h-5 w-5 text-gray-400" />
                          )
                        : (
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                          )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.platform}
                        {' '}
                        •
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        activity.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
