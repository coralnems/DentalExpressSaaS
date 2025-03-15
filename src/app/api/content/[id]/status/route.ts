import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const data = await request.json();

  // In a real application, you would update the status in your database
  // and potentially trigger notifications or workflow actions

  return NextResponse.json({
    success: true,
    data: {
      id,
      status: data.status,
      updatedAt: new Date().toISOString(),
    },
  });
}
