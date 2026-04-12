import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../../hooks/useTheme';
import { apiGetStats, DashboardStats } from '../../lib/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetStats().then(res => {
      if (!('error' in res)) setStats(res);
      setLoading(false);
    });
  }, []);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#aaa' : '#555';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const accentColor = '#0057ff';
  const accentGlow = isDark ? 'rgba(0,87,255,0.25)' : 'rgba(0,87,255,0.12)';
  const barColor = isDark ? 'rgba(0,87,255,0.7)' : 'rgba(0,87,255,0.65)';
  const barHover = isDark ? 'rgba(0,87,255,0.9)' : 'rgba(0,87,255,0.85)';

  const labels = stats?.weekly_visits.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('es', { weekday: 'short' });
  }) ?? ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  const trafficData = stats?.weekly_visits.map(d => d.visits) ?? [0,0,0,0,0,0,0];
  const convData = stats?.weekly_visits.map(d => d.conversions) ?? [0,0,0,0,0,0,0];

  const commonOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#161616' : '#fff',
        titleColor: isDark ? '#f0f0f0' : '#111',
        bodyColor: isDark ? '#aaa' : '#555',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor }, border: { display: false } },
      y: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor }, border: { display: false } },
    },
  };

  const lineData = {
    labels,
    datasets: [{ label: 'Visitas', data: trafficData, borderColor: accentColor, backgroundColor: accentGlow, borderWidth: 2, pointRadius: 4, pointBackgroundColor: accentColor, pointBorderColor: isDark ? '#161616' : '#fff', pointBorderWidth: 2, tension: 0.4, fill: true }],
  };

  const barData = {
    labels,
    datasets: [{ label: 'Conversiones', data: convData, backgroundColor: barColor, hoverBackgroundColor: barHover, borderRadius: 6, borderSkipped: false as const }],
  };

  return (
    <>
      <style>{`
        .analytics-grid { display:grid; grid-template-columns:1fr; gap:24px; }
        @media(min-width:900px){ .analytics-grid { grid-template-columns:1fr 1fr; } }
        .chart-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-sm); }
        .chart-card__header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .chart-card__title { font-size:1rem; font-weight:700; color:var(--text); font-family:var(--font-display); }
        .chart-card__badge { font-size:.7rem; font-family:var(--font-display); font-weight:700; padding:3px 10px; border-radius:var(--radius-full); background:var(--accent-subtle); color:var(--accent); }
        .chart-container { position:relative; width:100%; height:220px; }
        .skeleton { background:var(--border); border-radius:var(--radius); animation:pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="analytics-grid">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Tráfico semanal</h3>
            <span className="chart-card__badge">Últimos 7 días</span>
          </div>
          <div className="chart-container">
            {loading ? <div className="skeleton" style={{ height: '100%' }} /> : <Line data={lineData} options={commonOptions} />}
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Conversiones</h3>
            <span className="chart-card__badge">Últimos 7 días</span>
          </div>
          <div className="chart-container">
            {loading ? <div className="skeleton" style={{ height: '100%' }} /> : <Bar data={barData} options={commonOptions} />}
          </div>
        </div>
      </div>
    </>
  );
}

