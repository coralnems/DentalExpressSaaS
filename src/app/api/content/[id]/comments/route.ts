import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const data = await request.json();

  // In a real application, you would:
  // 1. Save the comment to your database
  // 2. Associate it with the content item
  // 3. Notify relevant team members
  // 4. Update activity logs

  const newComment = {
    id: Math.random().toString(36).substring(7),
    author: 'Current User', // In real app, get from auth session
    text: data.text,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: newComment,
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  // In a real application, you would fetch comments from your database
  const comments = [
    {
      id: '1',
      author: 'Team Member',
      text: 'Sample comment',
      createdAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(comments);
}
