import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { socialAccounts } from '@/models/Schema';

const FACEBOOK_API_VERSION = 'v18.0';
const FACEBOOK_BASE_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

export async function POST(request: Request) {
  try {
    const { action, accessToken, pageId } = await request.json();

    switch (action) {
      case 'post':
        const { message, mediaUrls } = await request.json();
        const response = await fetch(`${FACEBOOK_BASE_URL}/${pageId}/feed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            access_token: accessToken,
            ...(mediaUrls?.length && {
              attached_media: mediaUrls.map((url: string) => ({ media_fbid: url })),
            }),
          }),
        });

        const data = await response.json();
        return NextResponse.json(data);

      case 'stats':
        const statsResponse = await fetch(
          `${FACEBOOK_BASE_URL}/${pageId}?fields=followers_count,fan_count,engagement&access_token=${accessToken}`
        );
        const statsData = await statsResponse.json();
        return NextResponse.json(statsData);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Facebook API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const organizationId = searchParams.get('state'); // Pass organization ID in state parameter

    if (!code || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/oauth/access_token?` +
      `client_id=${process.env.FACEBOOK_APP_ID}` +
      `&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}` +
      `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
      `&code=${code}`
    );

    const { access_token, expires_in } = await tokenResponse.json();

    // Get user pages
    const pagesResponse = await fetch(
      `${FACEBOOK_BASE_URL}/me/accounts?access_token=${access_token}`
    );
    const { data: pages } = await pagesResponse.json();

    // Store account information
    for (const page of pages) {
      await db.insert(socialAccounts).values({
        organizationId: parseInt(organizationId),
        platform: 'facebook',
        accountName: page.name,
        accountId: page.id,
        accessToken: page.access_token,
        tokenExpiry: new Date(Date.now() + expires_in * 1000),
        metadata: { category: page.category },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 