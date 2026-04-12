import { useState, useEffect, useCallback } from 'react';
import { API_URL, getToken } from '../lib/api';

export interface SubscriptionStatus {
  plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  days_left: number | null;
  is_trial: boolean;
  is_expired: boolean;
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(`${API_URL}/billing/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStatus(await res.json());
    } catch { /* silencioso */ }
    finally { setLoading(false); }
  }, []);

  const upgrade = async (plan: string): Promise<{ error?: string }> => {
    const token = getToken();
    if (!token) return { error: 'No autenticado' };
    const res = await fetch(`${API_URL}/billing/upgrade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.detail ?? 'Error al actualizar plan' };
    setStatus(data);
    return {};
  };

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  return { status, loading, upgrade, refetch: fetchStatus };
}
