import { NextResponse } from 'next/server';

// In a real application, this would come from your database
const mockContentItems = [
  {
    id: '1',
    title: 'New Healthcare Technology Trends',
    description:
      'Exploring the latest technological advancements in healthcare and their impact on patient care.',
    type: 'article',
    platform: 'Blog',
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
    },
    status: 'pending',
    scheduledFor: '2024-03-15T10:00:00Z',
    comments: [
      {
        id: '1',
        author: 'Dr. Michael Chen',
        text: 'Great article! Could we add more details about AI applications?',
        createdAt: '2024-03-10T15:30:00Z',
      },
    ],
    createdAt: '2024-03-09T14:00:00Z',
  },
  {
    id: '2',
    title: 'Patient Success Story: Recovery Journey',
    description:
      'A heartwarming story of recovery and the role of our healthcare team.',
    type: 'video',
    platform: 'YouTube',
    author: {
      name: 'Marketing Team',
      avatar: '/avatars/marketing.jpg',
    },
    status: 'pending',
    comments: [],
    createdAt: '2024-03-10T09:00:00Z',
  },
  {
    id: '3',
    title: 'Wellness Tips for Spring',
    description:
      'Seasonal health advice and preventive care recommendations for patients.',
    type: 'post',
    platform: 'Instagram',
    author: {
      name: 'Wellness Team',
      avatar: '/avatars/wellness.jpg',
    },
    status: 'pending',
    scheduledFor: '2024-03-20T08:00:00Z',
    comments: [
      {
        id: '2',
        author: 'Content Manager',
        text: 'Please add more visuals to support the tips.',
        createdAt: '2024-03-11T11:20:00Z',
      },
    ],
    createdAt: '2024-03-11T10:00:00Z',
  },
];

export async function GET() {
  // In a real application, you would fetch this from your database
  return NextResponse.json(mockContentItems);
}

export async function POST(request: Request) {
  const data = await request.json();
  // In a real application, you would save this to your database
  return NextResponse.json({ success: true, data });
}
