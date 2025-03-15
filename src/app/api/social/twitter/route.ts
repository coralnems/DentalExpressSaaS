import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { socialAccounts } from '@/models/Schema';

const TWITTER_API_VERSION = '2';
const TWITTER_BASE_URL = `https://api.twitter.com/${TWITTER_API_VERSION}`;

export async function POST(request: Request) {
  try {
    const { action, accessToken, userId } = await request.json();

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    switch (action) {
      case 'post':
        const { text, mediaIds } = await request.json();
        const response = await fetch(`${TWITTER_BASE_URL}/tweets`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            text,
            ...(mediaIds?.length && {
              media: { media_ids: mediaIds },
            }),
          }),
        });

        const data = await response.json();
        return NextResponse.json(data);

      case 'stats':
        const userResponse = await fetch(
          `${TWITTER_BASE_URL}/users/${userId}?user.fields=public_metrics`,
          { headers }
        );
        const userData = await userResponse.json();
        return NextResponse.json(userData);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Twitter API error:', error);
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
    const organizationId = searchParams.get('state');

    if (!code || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TWITTER_REDIRECT_URI!,
        code_verifier: 'challenge', // Should be stored in session
      }),
    });

    const { access_token, expires_in } = await tokenResponse.json();

    // Get user information
    const userResponse = await fetch(`${TWITTER_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    const { data: user } = await userResponse.json();

    // Store account information
    await db.insert(socialAccounts).values({
      organizationId: parseInt(organizationId),
      platform: 'twitter',
      accountName: user.username,
      accountId: user.id,
      accessToken: access_token,
      tokenExpiry: new Date(Date.now() + expires_in * 1000),
      metadata: { name: user.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 