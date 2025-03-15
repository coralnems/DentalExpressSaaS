'use client';

import { fetchScheduledPosts } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type ScheduledPost = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  platform: 'Facebook' | 'Twitter' | 'Instagram';
  content: string;
  status: 'draft' | 'scheduled' | 'published';
};

export default function SchedulePage() {
  const { user } = useUser();
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: scheduledPosts, isLoading } = useQuery<ScheduledPost[]>({
    queryKey: ['scheduledPosts'],
    queryFn: fetchScheduledPosts,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const eventStyleGetter = (event: ScheduledPost) => {
    let backgroundColor = '';
    switch (event.platform) {
      case 'Facebook':
        backgroundColor = '#1877F2';
        break;
      case 'Twitter':
        backgroundColor = '#1DA1F2';
        break;
      case 'Instagram':
        backgroundColor = '#E4405F';
        break;
      default:
        backgroundColor = '#6366F1';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
      },
    };
  };

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

      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={scheduledPosts || []}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectSlot={({ start }) => {
              setSelectedDate(start);
              setShowNewPostModal(true);
            }}
            selectable
            popup
            views={['month', 'week', 'day']}
          />
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Create New Post
                </h3>
                <div className="mt-2">
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="platform"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Platform
                      </label>
                      <select
                        id="platform"
                        name="platform"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Content
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="scheduledDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Schedule Date
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        id="scheduledDate"
                        defaultValue={
                          selectedDate
                            ? format(selectedDate, 'yyyy-MM-dd\'T\'HH:mm')
                            : undefined
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </form>
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
