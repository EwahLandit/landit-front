import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { apiGetTickets, apiCreateTicket, Ticket } from '../../lib/api';

const CATEGORIES = ['Soporte técnico', 'Facturación', 'Dominio y DNS', 'Cuenta y seguridad', 'Otro'];

type TicketStatus = 'Activo' | 'Pendiente' | 'Cerrado';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Activo: 'badge badge--active', Pendiente: 'badge badge--pending', Cerrado: 'badge badge--closed',
  };
  const hasDot = status === 'Activo' || status === 'Pendiente';
  return (
    <span className={map[status] ?? 'badge badge--closed'}>
      {hasDot && <span className="badge__dot" />}
      {status}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function SupportPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const res = await apiGetTickets();
    if (!('error' in res)) setTickets(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openModal = () => { setSubject(''); setCategory(CATEGORIES[0]); setDescription(''); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    setSubmitting(true);
    const res = await apiCreateTicket({ title: subject, category, description });
    setSubmitting(false);
    if ('error' in res) { showToast(res.error, 'error'); return; }
    setTickets(prev => [res, ...prev]);
    setModalOpen(false);
    showToast('Ticket enviado correctamente', 'success');
  };

  return (
    <>
      <style>{`
        .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; gap:16px; flex-wrap:wrap; }
        .topbar__title { font-size:clamp(1.5rem,3vw,2rem); letter-spacing:-.03em; }
        .topbar__actions { display:flex; align-items:center; gap:10px; }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; font-family:var(--font-display); font-size:.8125rem; font-weight:600; border-radius:var(--radius-full); transition:all .25s var(--ease-out); white-space:nowrap; cursor:pointer; border:none; background:none; }
        .btn--primary { background:var(--accent); color:#fff; box-shadow:var(--shadow-accent); }
        .btn--primary:hover { background:var(--accent-hover,#0044cc); transform:translateY(-2px); }
        .btn--primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .btn--outline { background:transparent; color:var(--text); border:1.5px solid var(--border-strong); }
        .btn--outline:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-subtle); }
        .btn--sm { padding:7px 14px; font-size:.75rem; }
        .card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:28px; box-shadow:var(--shadow-sm); }
        .card__header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; gap:12px; }
        .card__title { font-size:1rem; font-weight:700; color:var(--text); }
        .badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:var(--radius-full); font-size:.7rem; font-family:var(--font-display); font-weight:700; letter-spacing:.04em; text-transform:uppercase; }
        .badge--active { background:rgba(0,168,107,.12); color:var(--success); border:1px solid rgba(0,168,107,.2); }
        .badge--pending { background:rgba(255,153,0,.12); color:var(--warning); border:1px solid rgba(255,153,0,.2); }
        .badge--closed { background:var(--border); color:var(--text-muted); border:1px solid var(--border-strong); }
        .badge__dot { width:6px; height:6px; border-radius:50%; background:currentColor; animation:pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }
        .ticket { padding:20px; border:1px solid var(--border); border-radius:var(--radius); background:var(--bg-card); transition:all .2s var(--ease-out); margin-bottom:12px; }
        .ticket:last-child { margin-bottom:0; }
        .ticket:hover { border-color:var(--accent); box-shadow:var(--shadow-sm); }
        .ticket__header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; gap:8px; flex-wrap:wrap; }
        .ticket__title { font-size:.9rem; font-weight:600; color:var(--text); }
        .ticket__meta { font-size:.75rem; color:var(--text-muted); margin-bottom:8px; }
        .ticket__body { font-size:.85rem; color:var(--text-secondary); line-height:1.6; }
        .ticket__reply { margin-top:12px; padding-top:12px; border-top:1px solid var(--border); font-size:.8rem; color:var(--accent); display:flex; align-items:flex-start; gap:6px; }
        .form-group { display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
        .form-label { font-size:.75rem; font-family:var(--font-display); font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--text-secondary); }
        .form-input { padding:11px 16px; background:var(--bg-alt); color:var(--text); border:1.5px solid var(--border-strong); border-radius:var(--radius); font-size:.9rem; outline:none; transition:border-color .22s,box-shadow .22s; font-family:inherit; }
        .form-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow,rgba(0,87,255,0.18)); }
        textarea.form-input { resize:vertical; min-height:100px; }
        select.form-input { cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; }
        .form-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:24px; }
        .empty-state { text-align:center; padding:64px 24px; color:var(--text-muted); }
        .empty-state__icon { display:flex; align-items:center; justify-content:center; margin-bottom:16px; opacity:.4; }
        .empty-state__title { font-family:var(--font-display); font-size:1.1rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px; }
        .skeleton { background:var(--border); border-radius:var(--radius); animation:pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="topbar">
        <h1 className="topbar__title">Soporte</h1>
        <div className="topbar__actions">
          <button className="btn btn--primary" onClick={openModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nuevo ticket
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 className="card__title">Mis tickets</h3>
          <span style={{ fontSize:'.8rem', color:'var(--text-muted)' }}>{tickets.length} tickets</span>
        </div>

        {loading ? (
          [1,2].map(i => (
            <div key={i} className="ticket">
              <div className="skeleton" style={{ height:16, width:'60%', marginBottom:10 }} />
              <div className="skeleton" style={{ height:12, width:'30%', marginBottom:10 }} />
              <div className="skeleton" style={{ height:12, width:'90%' }} />
            </div>
          ))
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
            <div className="empty-state__title">Sin tickets</div>
            <p style={{ fontSize:'.875rem', marginBottom:16 }}>No tienes tickets de soporte abiertos.</p>
            <button className="btn btn--primary btn--sm" onClick={openModal}>Crear primer ticket</button>
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="ticket">
              <div className="ticket__header">
                <span className="ticket__title">{ticket.title}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <div className="ticket__meta">Ticket #{ticket.id} · {formatDate(ticket.created_at)} · {ticket.category}</div>
              <div className="ticket__body">{ticket.description}</div>
              {ticket.reply && (
                <div className="ticket__reply">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span><strong>Respuesta del equipo:</strong> {ticket.reply}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo ticket" description="Describe tu problema y nuestro equipo te responderá lo antes posible.">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-subject">Asunto</label>
            <input id="ticket-subject" className="form-input" type="text" placeholder="Describe brevemente el problema" value={subject} onChange={e => setSubject(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-category">Categoría</label>
            <select id="ticket-category" className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ticket-desc">Descripción</label>
            <textarea id="ticket-desc" className="form-input" placeholder="Explica el problema con detalle..." value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary btn--sm" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar ticket'}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
