export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('landit-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T | { error: string }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { ...authHeaders(), ...options?.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail ?? `Error ${res.status}` };
    return data as T;
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number; name: string; email: string; is_active: boolean;
  plan: string; subscription_status: string; trial_ends_at: string | null;
}
export interface AuthToken { access_token: string; token_type: string; user: AuthUser; }

export const apiRegister = (name: string, email: string, password: string) =>
  fetchApi<AuthToken>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const apiLogin = (email: string, password: string) =>
  fetchApi<AuthToken>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const apiUpdateProfile = (data: { name?: string; email?: string }) =>
  fetchApi<AuthUser>('/auth/me', { method: 'PUT', body: JSON.stringify(data) });

export const apiChangePassword = (current_password: string, new_password: string) =>
  fetchApi<{ message: string }>('/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) });

// ── Token storage ─────────────────────────────────────────────────────────

export const saveToken = (t: string) => localStorage.setItem('landit-token', t);
export const getToken = (): string | null => localStorage.getItem('landit-token');
export const clearToken = () => localStorage.removeItem('landit-token');

// ── Analytics ─────────────────────────────────────────────────────────────

export interface DailyStats {
  date: string; visits: number; conversions: number;
  bounce_rate: number; avg_time_seconds: number;
}
export interface DashboardStats {
  total_visits: number; visits_trend: number;
  conversion_rate: number; conversion_trend: number;
  avg_time_seconds: number; time_trend: number;
  bounce_rate: number; bounce_trend: number;
  weekly_visits: DailyStats[]; weekly_conversions: DailyStats[];
}
export const apiGetStats = () => fetchApi<DashboardStats>('/analytics/stats');

// ── Notifications ─────────────────────────────────────────────────────────

export interface NotificationItem {
  id: number; icon: string; icon_bg: string; icon_color: string;
  title: string; is_read: boolean; created_at: string;
}
export const apiGetNotifications = () => fetchApi<NotificationItem[]>('/notifications');
export const apiMarkRead = (id: number) => fetchApi<{ message: string }>(`/notifications/${id}/read`, { method: 'PATCH' });
export const apiMarkAllRead = () => fetchApi<{ message: string }>('/notifications/read-all', { method: 'PATCH' });

// ── Support ───────────────────────────────────────────────────────────────

export interface Ticket {
  id: number; title: string; category: string; description: string;
  status: string; reply: string | null; created_at: string;
}
export const apiGetTickets = () => fetchApi<Ticket[]>('/support/tickets');
export const apiCreateTicket = (data: { title: string; category: string; description: string }) =>
  fetchApi<Ticket>('/support/tickets', { method: 'POST', body: JSON.stringify(data) });

// ── API Keys ──────────────────────────────────────────────────────────────

export interface ApiKeyItem {
  id: number; name: string; key_value: string; created_at: string; is_active: boolean;
}
export const apiGetApiKeys = () => fetchApi<ApiKeyItem[]>('/settings/api-keys');
export const apiCreateApiKey = (name: string) =>
  fetchApi<ApiKeyItem>('/settings/api-keys', { method: 'POST', body: JSON.stringify({ name }) });
export const apiRevokeApiKey = (id: number) =>
  fetchApi<{ message: string }>(`/settings/api-keys/${id}`, { method: 'DELETE' });
