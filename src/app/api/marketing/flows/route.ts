import type { MarketingChannel, MarketingFlow } from '@/services/ai/MarketingAI';
import { MarketingAI } from '@/services/ai/MarketingAI';
import { NextResponse } from 'next/server';

// In a real application, these would be environment variables
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || 'your-hf-api-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY || 'your-replicate-api-key';

const marketingAI = new MarketingAI(HF_API_KEY, OPENAI_API_KEY, REPLICATE_API_KEY);

// In a real application, this would be stored in a database
const mockFlows: MarketingFlow[] = [];

export async function GET(request: Request) {
  // Get query parameters for filtering
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const channel = searchParams.get('channel');

  let filteredFlows = [...mockFlows];

  if (status) {
    filteredFlows = filteredFlows.filter(flow => flow.status === status);
  }

  if (channel) {
    filteredFlows = filteredFlows.filter(flow =>
      flow.steps.some(step => step.channel === channel),
    );
  }

  // Sort by updatedAt in descending order
  filteredFlows.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return NextResponse.json(filteredFlows);
}

export async function POST(request: Request) {
  try {
    const { objective, channels, constraints } = await request.json();

    if (!objective || !channels || channels.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: objective and channels' },
        { status: 400 },
      );
    }

    // Validate channels
    const validChannels = [
      'blog',
      'twitter',
      'linkedin',
      'instagram',
      'facebook',
      'tiktok',
      'telegram',
      'whatsapp',
      'email',
    ];

    const invalidChannels = channels.filter(
      (channel: string) => !validChannels.includes(channel),
    );

    if (invalidChannels.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid channels: ${invalidChannels.join(', ')}`,
          validChannels,
        },
        { status: 400 },
      );
    }

    // Create a new marketing flow using AI
    const flow = await marketingAI.createMarketingFlow(
      objective,
      channels as MarketingChannel[],
      constraints,
    );

    // In a real application, save to database
    mockFlows.push(flow);

    return NextResponse.json(flow);
  } catch (error) {
    console.error('Error creating marketing flow:', error);
    return NextResponse.json(
      { error: 'Failed to create marketing flow' },
      { status: 500 },
    );
  }
}
