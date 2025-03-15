'use client';

import { Tab } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  ChartPieIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type AnalyticsData = {
  platformStats: {
    name: string;
    stat: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: any;
  }[];
  engagementData: {
    date: string;
    facebook: number;
    twitter: number;
    instagram: number;
  }[];
  postPerformance: {
    title: string;
    platform: string;
    engagement: number;
    reach: number;
    clicks: number;
  }[];
};

type ReportType = 'overview' | 'engagement' | 'content';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedReport, setSelectedReport] = useState<ReportType>('overview');

  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      return response.json();
    },
  });

  const exportData = () => {
    if (!analyticsData) {
      return;
    }

    let csvContent = '';
    switch (selectedReport) {
      case 'overview':
        csvContent = `Metric,Value,Change\n${
          analyticsData.platformStats
            .map(stat => `${stat.name},${stat.stat},${stat.change}`)
            .join('\n')}`;
        break;
      case 'engagement':
        csvContent = `Date,Facebook,Twitter,Instagram\n${
          analyticsData.engagementData
            .map(data => `${data.date},${data.facebook},${data.twitter},${data.instagram}`)
            .join('\n')}`;
        break;
      case 'content':
        csvContent = `Title,Platform,Engagement,Reach,Clicks\n${
          analyticsData.postPerformance
            .map(post => `${post.title},${post.platform},${post.engagement},${post.reach},${post.clicks}`)
            .join('\n')}`;
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_${selectedReport}_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const { platformStats = [], engagementData = [], postPerformance = [] } = analyticsData || {};

  const reports = [
    { id: 'overview', name: 'Overview', icon: ChartPieIcon },
    { id: 'engagement', name: 'Engagement Analysis', icon: ChartBarIcon },
    { id: 'content', name: 'Content Performance', icon: DocumentTextIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your social media performance and engagement metrics
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={exportData}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="border-b border-gray-200">
        <Tab.Group onChange={index => setSelectedReport(reports[index].id as ReportType)}>
          <Tab.List className="-mb-px flex space-x-8">
            {reports.map(report => (
              <Tab
                key={report.id}
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium',
                  )}
              >
                <report.icon
                  className={classNames(
                    'mr-2 h-5 w-5',
                    selectedReport === report.id
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                  )}
                />
                {report.name}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          {['7d', '30d', '90d'].map(range => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={classNames(
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
                'px-4 py-2 text-sm font-medium border',
                range === '7d' ? 'rounded-l-md' : undefined,
                range === '90d' ? 'rounded-r-md' : undefined,
              )}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <Tab.Group selectedIndex={reports.findIndex(r => r.id === selectedReport)}>
        <Tab.Panels>
          <Tab.Panel>
            {/* Platform Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {platformStats.map(item => (
                <div
                  key={item.name}
                  className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:pt-6"
                >
                  <dt>
                    <div className="absolute rounded-md bg-indigo-500 p-3">
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                    <p
                      className={classNames(
                        item.changeType === 'increase'
                          ? 'text-green-600'
                          : 'text-red-600',
                        'ml-2 flex items-baseline text-sm font-semibold',
                      )}
                    >
                      {item.change}
                    </p>
                  </dd>
                </div>
              ))}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            {/* Engagement Trends */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Engagement Trends
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="facebook"
                      stroke="#1877F2"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="twitter"
                      stroke="#1DA1F2"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="instagram"
                      stroke="#E4405F"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel>
            {/* Top Performing Posts */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Top Performing Posts
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engagement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reach
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {postPerformance.map(post => (
                      <tr key={post.title}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.engagement.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.reach.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.clicks.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
