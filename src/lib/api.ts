// API endpoints
const API_BASE_URL = '/api';

// Analytics
export async function fetchAnalytics() {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
}

// Posts
export async function fetchScheduledPosts() {
  const response = await fetch(`${API_BASE_URL}/posts/scheduled`);
  if (!response.ok) {
    throw new Error('Failed to fetch scheduled posts');
  }
  return response.json();
}

export async function createPost(data: any) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
}

// Team
export async function fetchTeamMembers() {
  const response = await fetch(`${API_BASE_URL}/team`);
  if (!response.ok) {
    throw new Error('Failed to fetch team members');
  }
  return response.json();
}

export async function inviteTeamMember(data: any) {
  const response = await fetch(`${API_BASE_URL}/team/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to invite team member');
  }
  return response.json();
}

// Settings
export async function updateProfile(data: any) {
  const response = await fetch(`${API_BASE_URL}/settings/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
}

export async function updateNotificationSettings(data: any) {
  const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update notification settings');
  }
  return response.json();
}

export async function connectSocialMedia(platform: string) {
  const response = await fetch(`${API_BASE_URL}/settings/integrations/${platform}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Failed to connect ${platform}`);
  }
  return response.json();
}

export async function disconnectSocialMedia(platform: string) {
  const response = await fetch(`${API_BASE_URL}/settings/integrations/${platform}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to disconnect ${platform}`);
  }
  return response.json();
}
