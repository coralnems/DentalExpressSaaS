'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  PlusCircleIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SocialAccount {
  id: number;
  platform: string;
  accountName: string;
  accountType: string;
  status: 'connected' | 'expired' | 'disconnected';
  lastSync: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  useEffect(() => {
    // TODO: Fetch real data from API
    setAccounts([
      {
        id: 1,
        platform: 'Facebook',
        accountName: 'Smile Dental Clinic',
        accountType: 'Business Page',
        status: 'connected',
        lastSync: '5 minutes ago',
      },
      {
        id: 2,
        platform: 'Instagram',
        accountName: '@smiledentalcare',
        accountType: 'Business Account',
        status: 'connected',
        lastSync: '10 minutes ago',
      },
      {
        id: 3,
        platform: 'Twitter',
        accountName: '@smileclinic',
        accountType: 'Business',
        status: 'expired',
        lastSync: '2 days ago',
      },
    ]);
  }, []);

  const handleConnect = (platform: string) => {
    // TODO: Implement OAuth flow for each platform
    console.log(`Connecting to ${platform}...`);
  };

  const handleDisconnect = (accountId: number) => {
    // TODO: Implement account disconnection
    setAccounts(accounts.filter(account => account.id !== accountId));
  };

  const handleRefresh = (accountId: number) => {
    // TODO: Implement token refresh
    console.log(`Refreshing account ${accountId}...`);
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Social Media Accounts
          </h2>
        </div>
      </div>

      {/* Connect New Account */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((platform) => (
          <button
            key={platform}
            onClick={() => handleConnect(platform)}
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <UserGroupIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-gray-900">
              Connect {platform}
            </span>
          </button>
        ))}
      </div>

      {/* Connected Accounts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Connected Accounts
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="px-4 py-4 sm:px-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserGroupIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {account.accountName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {account.platform} • {account.accountType}
                      </p>
                      <p className="text-xs text-gray-400">
                        Last synced: {account.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        account.status === 'connected'
                          ? 'bg-green-100 text-green-800'
                          : account.status === 'expired'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {account.status}
                    </span>
                    <button
                      onClick={() => handleRefresh(account.id)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                      title="Refresh connection"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDisconnect(account.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Disconnect account"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
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