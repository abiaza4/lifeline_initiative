const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
}

export const auth = {
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => fetchAPI('/auth/me'),
};

export const campaigns = {
  getAll: (params?: { featured?: boolean; category?: string; active?: boolean }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/campaigns${query}`);
  },
  getById: (id: number) => fetchAPI(`/campaigns/${id}`),
  create: (data: any) => fetchAPI('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/campaigns/${id}`, { method: 'DELETE' }),
  toggle: (id: number) => fetchAPI(`/campaigns/${id}/toggle`, { method: 'PATCH' }),
  feature: (id: number) => fetchAPI(`/campaigns/${id}/feature`, { method: 'PATCH' }),
};

export const donations = {
  getAll: (params?: { campaignId?: number; userId?: number; status?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/donations${query}`);
  },
  getMyDonations: () => fetchAPI('/donations/my-donations'),
  create: (data: any) => fetchAPI('/donations', { method: 'POST', body: JSON.stringify(data) }),
  confirm: (id: number) => fetchAPI(`/donations/confirm/${id}`, { method: 'POST' }),
  getStats: () => fetchAPI('/donations/stats'),
};

export const volunteers = {
  getAll: (params?: { status?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/volunteers${query}`);
  },
  apply: (data: any) => fetchAPI('/volunteers', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: number, status: string) =>
    fetchAPI(`/volunteers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: number) => fetchAPI(`/volunteers/${id}`, { method: 'DELETE' }),
};

export const blogs = {
  getAll: (params?: { published?: boolean; featured?: boolean }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/blogs${query}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/blogs/${slug}`),
  create: (data: any) => fetchAPI('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/blogs/${id}`, { method: 'DELETE' }),
};

export const team = {
  getAll: (params?: { active?: boolean }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/team${query}`);
  },
  getById: (id: number) => fetchAPI(`/team/${id}`),
  create: (data: any) => fetchAPI('/team', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/team/${id}`, { method: 'DELETE' }),
};

export const users = {
  getAll: () => fetchAPI('/users'),
  getById: (id: number) => fetchAPI(`/users/${id}`),
  update: (id: number, data: any) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
  createAdmin: (data: any) => fetchAPI('/users/create-admin', { method: 'POST', body: JSON.stringify(data) }),
};

export const newsletter = {
  subscribe: (email: string) => fetchAPI('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  unsubscribe: (email: string) => fetchAPI('/newsletter/unsubscribe', { method: 'DELETE', body: JSON.stringify({ email }) }),
  getAll: () => fetchAPI('/newsletter'),
};

export const dashboard = {
  getStats: () => fetchAPI('/dashboard'),
};

export const projects = {
  getAll: (params?: { active?: boolean; featured?: boolean }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/projects${query}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/projects/${slug}`),
  create: (data: any) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
  toggle: (id: number) => fetchAPI(`/projects/${id}/toggle`, { method: 'PATCH' }),
};

export const albums = {
  getAll: (params?: { category?: string; featured?: boolean; active?: boolean }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/albums${query}`);
  },
  getById: (id: number) => fetchAPI(`/albums/${id}`),
  create: (data: any) => fetchAPI('/albums', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/albums/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/albums/${id}`, { method: 'DELETE' }),
  feature: (id: number) => fetchAPI(`/albums/${id}/feature`, { method: 'PATCH' }),
};

export const photos = {
  getByAlbum: (albumId: number) => fetchAPI(`/photos/album/${albumId}`),
  getById: (id: number) => fetchAPI(`/photos/${id}`),
  create: (data: any) => fetchAPI('/photos', { method: 'POST', body: JSON.stringify(data) }),
  createBulk: (photos: any[]) => fetchAPI('/photos/bulk', { method: 'POST', body: JSON.stringify({ photos }) }),
  update: (id: number, data: any) => fetchAPI(`/photos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/photos/${id}`, { method: 'DELETE' }),
};
