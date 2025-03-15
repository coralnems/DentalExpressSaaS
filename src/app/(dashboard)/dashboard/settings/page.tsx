'use client';

import { useUser } from '@clerk/nextjs';
import {
  BellIcon,
  KeyIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const sections = [
  {
    id: 'profile',
    name: 'Profile',
    icon: UserCircleIcon,
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', value: 'John Doe' },
      { id: 'email', label: 'Email', type: 'email', value: 'john@example.com' },
      { id: 'phone', label: 'Phone', type: 'tel', value: '+1 (555) 123-4567' },
    ],
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: BellIcon,
    settings: [
      {
        id: 'email_notifications',
        label: 'Email Notifications',
        description: 'Receive email notifications for important updates',
        enabled: true,
      },
      {
        id: 'post_notifications',
        label: 'Post Scheduling Notifications',
        description: 'Get notified when posts are published',
        enabled: true,
      },
      {
        id: 'team_notifications',
        label: 'Team Updates',
        description: 'Receive notifications about team changes',
        enabled: false,
      },
    ],
  },
  {
    id: 'integrations',
    name: 'Social Media Integrations',
    icon: WrenchScrewdriverIcon,
    connections: [
      {
        id: 'facebook',
        name: 'Facebook',
        status: 'connected',
        lastSync: '2024-03-15T10:00:00Z',
      },
      {
        id: 'twitter',
        name: 'Twitter',
        status: 'disconnected',
        lastSync: null,
      },
      {
        id: 'instagram',
        name: 'Instagram',
        status: 'connected',
        lastSync: '2024-03-14T15:30:00Z',
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: KeyIcon,
    settings: [
      {
        id: 'two_factor',
        label: '2-Factor Authentication',
        description: 'Add an extra layer of security to your account',
        enabled: false,
      },
      {
        id: 'session_timeout',
        label: 'Session Timeout',
        description: 'Automatically log out after period of inactivity',
        enabled: true,
      },
    ],
  },
];

export default function SettingsPage() {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('profile');

  const renderSectionContent = (section: any) => {
    switch (section.id) {
      case 'profile':
        return (
          <div className="space-y-4">
            {section.fields.map((field: any) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.id}
                  id={field.id}
                  defaultValue={field.value}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
            <div className="pt-5">
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
      case 'security':
        return (
          <div className="space-y-4">
            {section.settings.map((setting: any) => (
              <div
                key={setting.id}
                className="flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {setting.label}
                  </h4>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    setting.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={setting.enabled}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      setting.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-4">
            {section.connections.map((connection: any) => (
              <div
                key={connection.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {connection.name}
                  </h4>
                  {connection.lastSync && (
                    <p className="text-sm text-gray-500">
                      Last synced:
                      {' '}
                      {new Date(connection.lastSync).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
                    connection.status === 'connected'
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {connection.status === 'connected'
                    ? 'Disconnect'
                    : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex space-x-8">
        {/* Navigation Sidebar */}
        <nav className="w-48 flex-shrink-0">
          <ul className="space-y-1">
            {sections.map(section => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeSection === section.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <section.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      activeSection === section.id
                        ? 'text-gray-500'
                        : 'text-gray-400'
                    }`}
                  />
                  {section.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {renderSectionContent(
                sections.find(s => s.id === activeSection),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
