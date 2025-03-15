import { ChartBarIcon, ShareIcon, UsersIcon } from '@heroicons/react/24/outline';
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, this data would come from your database
  const analyticsData = {
    platformStats: [
      {
        name: 'Total Followers',
        stat: '71,897',
        change: '+12%',
        changeType: 'increase',
        icon: UsersIcon,
      },
      {
        name: 'Engagement Rate',
        stat: '3.2%',
        change: '+0.8%',
        changeType: 'increase',
        icon: ChartBarIcon,
      },
      {
        name: 'Total Posts',
        stat: '521',
        change: '-4%',
        changeType: 'decrease',
        icon: ShareIcon,
      },
    ],
    engagementData: [
      { date: '2024-03-01', facebook: 120, twitter: 150, instagram: 200 },
      { date: '2024-03-02', facebook: 140, twitter: 160, instagram: 180 },
      { date: '2024-03-03', facebook: 170, twitter: 140, instagram: 220 },
      { date: '2024-03-04', facebook: 190, twitter: 180, instagram: 250 },
      { date: '2024-03-05', facebook: 150, twitter: 170, instagram: 230 },
      { date: '2024-03-06', facebook: 180, twitter: 190, instagram: 260 },
      { date: '2024-03-07', facebook: 200, twitter: 200, instagram: 280 },
    ],
    postPerformance: [
      {
        title: 'New Treatment Options Available',
        platform: 'Facebook',
        engagement: 1200,
        reach: 5000,
        clicks: 320,
      },
      {
        title: 'Patient Success Story',
        platform: 'Instagram',
        engagement: 2100,
        reach: 8000,
        clicks: 450,
      },
      {
        title: 'Healthcare Tips',
        platform: 'Twitter',
        engagement: 800,
        reach: 3000,
        clicks: 180,
      },
    ],
  };

  return NextResponse.json(analyticsData);
}
