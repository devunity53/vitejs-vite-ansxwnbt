import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://pkkbbgwseaogntclnsrt.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBra2JiZ3dzZWFvZ250Y2xuc3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODM2MDAsImV4cCI6MjA5NDI1OTYwMH0.en2kRneOe7-ZAQO5-StdEa4-WCbH9aRfKPKS2_P6qok';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COIN_NAME = 'Étoile';
const COIN_SYMBOL = '⭐';

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --primary: #6C63FF;
    --primary-light: #EEF0FF;
    --primary-dark: #4B44C9;
    --accent: #FF6B9D;
    --accent-light: #FFF0F6;
    --gold: #FFB800;
    --gold-light: #FFF8E1;
    --success: #22C55E;
    --success-light: #F0FFF4;
    --danger: #EF4444;
    --danger-light: #FFF5F5;
    --warning: #F59E0B;
    --bg: #F7F7FF;
    --card: #FFFFFF;
    --text: #1A1A2E;
    --muted: #6B7280;
    --border: #E5E7EB;
    --radius: 16px;
    --radius-sm: 10px;
  }
  body { font-family: 'Nunito', sans-serif; background: var(--bg); color: var(--text); }
  .app { max-width: 420px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }

  /* ── AUTH ── */
  .auth-bg {
    min-height: 100vh;
    background: linear-gradient(135deg, #6C63FF 0%, #A78BFA 50%, #FF6B9D 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 24px;
  }
  .auth-logo { font-size: 56px; margin-bottom: 8px; }
  .auth-title { font-size: 28px; font-weight: 900; color: white; margin-bottom: 4px; }
  .auth-subtitle { font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 32px; }
  .auth-card {
    background: white; border-radius: 24px; padding: 28px 24px;
    width: 100%; max-width: 380px; box-shadow: 0 24px 60px rgba(108,99,255,0.25);
  }
  .auth-tabs { display: flex; gap: 8px; margin-bottom: 24px; background: var(--bg); border-radius: 12px; padding: 4px; }
  .auth-tab {
    flex: 1; padding: 8px; border: none; border-radius: 10px; font-family: inherit;
    font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    background: transparent; color: var(--muted);
  }
  .auth-tab.active { background: white; color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .role-selector { display: flex; gap: 8px; margin-bottom: 20px; }
  .role-btn {
    flex: 1; padding: 14px; border: 2px solid var(--border); border-radius: var(--radius);
    background: white; cursor: pointer; font-family: inherit; font-weight: 700;
    font-size: 13px; transition: all 0.2s; text-align: center;
  }
  .role-btn.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }
  .role-icon { font-size: 28px; display: block; margin-bottom: 4px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 13px; font-weight: 700; color: var(--muted); margin-bottom: 6px; }
  .field input, .field select, .field textarea {
    width: 100%; padding: 12px 14px; border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); font-family: inherit; font-size: 15px;
    outline: none; transition: border 0.2s; background: var(--bg);
  }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--primary); background: white; }
  .field textarea { min-height: 80px; resize: none; }

  /* ── BUTTONS ── */
  .btn {
    width: 100%; padding: 14px; border: none; border-radius: var(--radius);
    font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.3px;
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-accent { background: var(--accent); color: white; }
  .btn-success { background: var(--success); color: white; }
  .btn-danger { background: var(--danger); color: white; }
  .btn-outline {
    background: transparent; border: 1.5px solid var(--border);
    color: var(--muted); font-weight: 700;
  }
  .btn-sm { padding: 8px 14px; font-size: 13px; width: auto; border-radius: 10px; }
  .btn-gold { background: var(--gold); color: #7C5800; }
  .btn-pwa {
    background: linear-gradient(135deg, #6C63FF, #FF6B9D);
    color: white; border: none; font-weight: 800;
  }

  /* ── HEADER ── */
  .header {
    background: white; padding: 16px 20px; display: flex; align-items: center;
    justify-content: space-between; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
  }
  .header-left { display: flex; flex-direction: column; }
  .header-greeting { font-size: 12px; color: var(--muted); font-weight: 600; }
  .header-name { font-size: 18px; font-weight: 900; color: var(--text); }
  .coin-badge {
    display: flex; align-items: center; gap: 6px;
    background: var(--gold-light); border-radius: 50px; padding: 8px 14px;
  }
  .coin-badge span { font-size: 13px; font-weight: 800; color: #7C5800; }
  .notif-dot {
    position: relative; display: inline-block;
  }
  .notif-dot::after {
    content: ''; position: absolute; top: -2px; right: -2px;
    width: 8px; height: 8px; background: var(--danger); border-radius: 50%;
    border: 2px solid white;
  }

  /* ── NAV ── */
  .nav {
    background: white; border-top: 1px solid var(--border);
    display: flex; padding: 8px 4px; position: sticky; bottom: 0;
  }
  .nav-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 4px; padding: 8px 4px; border: none; background: transparent;
    cursor: pointer; font-family: inherit; border-radius: var(--radius-sm);
    transition: all 0.2s; position: relative;
  }
  .nav-btn .icon { font-size: 22px; }
  .nav-btn .label { font-size: 10px; font-weight: 700; color: var(--muted); }
  .nav-btn.active .label { color: var(--primary); }
  .nav-btn.active .icon { transform: scale(1.1); }
  .nav-badge {
    position: absolute; top: 4px; right: 14px;
    background: var(--danger); color: white;
    font-size: 10px; font-weight: 800; border-radius: 50%;
    width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;
    border: 2px solid white;
  }

  /* ── CONTENT ── */
  .content { flex: 1; overflow-y: auto; padding: 20px; padding-bottom: 8px; }
  .section-title {
    font-size: 18px; font-weight: 900; margin-bottom: 16px; display: flex;
    align-items: center; justify-content: space-between;
  }

  /* ── CARDS ── */
  .card {
    background: var(--card); border-radius: var(--radius); padding: 16px;
    border: 1px solid var(--border); margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .task-card { border-left: 4px solid var(--primary); }
  .task-card.pending { border-left-color: var(--warning); }
  .task-card.completed { border-left-color: var(--success); border-left-style: dashed; opacity: 0.75; }
  .task-title { font-size: 16px; font-weight: 800; margin-bottom: 4px; }
  .task-desc { font-size: 13px; color: var(--muted); margin-bottom: 10px; line-height: 1.4; }
  .task-footer { display: flex; align-items: center; justify-content: space-between; }
  .coin-reward {
    display: flex; align-items: center; gap: 4px;
    background: var(--gold-light); border-radius: 20px; padding: 4px 10px;
    font-size: 13px; font-weight: 800; color: #7C5800;
  }
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;
  }
  .badge-warning { background: #FEF3C7; color: #92400E; }
  .badge-success { background: #D1FAE5; color: #065F46; }
  .badge-primary { background: var(--primary-light); color: var(--primary-dark); }
  .badge-accent { background: var(--accent-light); color: #9D174D; }

  /* ── SHOP ── */
  .shop-card {
    background: white; border-radius: var(--radius); padding: 16px;
    border: 1px solid var(--border); margin-bottom: 12px; display: flex;
    align-items: center; gap: 14px;
  }
  .shop-icon { font-size: 36px; min-width: 48px; text-align: center; }
  .shop-info { flex: 1; }
  .shop-name { font-size: 15px; font-weight: 800; }
  .shop-desc { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* ── MODAL ── */
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 200; display: flex; align-items: flex-end; justify-content: center;
  }
  .modal {
    background: white; border-radius: 24px 24px 0 0; padding: 28px 24px;
    width: 100%; max-width: 420px; max-height: 85vh; overflow-y: auto;
  }
  .modal-title { font-size: 20px; font-weight: 900; margin-bottom: 20px; }
  .modal-close {
    position: absolute; right: 24px; top: 24px; background: var(--bg);
    border: none; border-radius: 50%; width: 32px; height: 32px;
    cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;
  }

  /* ── MISC ── */
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .empty { text-align: center; padding: 40px 20px; color: var(--muted); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty p { font-size: 14px; font-weight: 600; }
  .user-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .avatar {
    width: 42px; height: 42px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 18px; font-weight: 800;
  }
  .avatar-parent { background: var(--primary-light); color: var(--primary-dark); }
  .avatar-child { background: var(--accent-light); color: #9D174D; }
  .alert { padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 14px; font-weight: 600; }
  .alert-danger { background: var(--danger-light); color: var(--danger); }
  .alert-success { background: var(--success-light); color: #065F46; }
  .spinner { text-align: center; padding: 40px; color: var(--muted); font-size: 14px; font-weight: 600; }
  .profile-section { background: linear-gradient(135deg, var(--primary) 0%, #A78BFA 100%); border-radius: var(--radius); padding: 24px 20px; color: white; margin-bottom: 20px; text-align: center; }
  .profile-avatar { font-size: 48px; margin-bottom: 8px; }
  .profile-name { font-size: 22px; font-weight: 900; }
  .profile-role { font-size: 13px; opacity: 0.8; margin-top: 4px; }
  .stats-row { display: flex; gap: 10px; margin-top: 16px; }
  .stat-box { flex: 1; background: rgba(255,255,255,0.2); border-radius: 12px; padding: 12px; text-align: center; }
  .stat-num { font-size: 22px; font-weight: 900; }
  .stat-label { font-size: 11px; opacity: 0.8; margin-top: 2px; }

  /* ── CHAT ── */
  .chat-wrapper { display: flex; flex-direction: column; height: 100%; flex: 1; overflow: hidden; }
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 16px 20px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .msg-row { display: flex; align-items: flex-end; gap: 8px; }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-avatar {
    width: 30px; height: 30px; border-radius: 50%; font-size: 13px; font-weight: 800;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .msg-bubble {
    max-width: 75%; padding: 10px 14px; border-radius: 18px;
    font-size: 14px; line-height: 1.4; font-weight: 600;
  }
  .msg-bubble.theirs {
    background: white; border: 1px solid var(--border);
    border-bottom-left-radius: 4px; color: var(--text);
  }
  .msg-bubble.mine {
    background: var(--primary); color: white;
    border-bottom-right-radius: 4px;
  }
  .msg-meta { font-size: 10px; color: var(--muted); margin-top: 3px; text-align: right; }
  .msg-sender { font-size: 11px; font-weight: 700; color: var(--muted); margin-bottom: 3px; }
  .chat-input-bar {
    padding: 12px 16px; background: white; border-top: 1px solid var(--border);
    display: flex; gap: 10px; align-items: flex-end;
  }
  .chat-input {
    flex: 1; padding: 10px 14px; border: 1.5px solid var(--border);
    border-radius: 22px; font-family: inherit; font-size: 14px;
    outline: none; resize: none; max-height: 100px; line-height: 1.4;
  }
  .chat-input:focus { border-color: var(--primary); }
  .chat-send {
    width: 42px; height: 42px; border-radius: 50%; background: var(--primary);
    border: none; cursor: pointer; font-size: 18px; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
    transition: all 0.2s;
  }
  .chat-send:hover { background: var(--primary-dark); transform: scale(1.05); }

  /* ── NOTIFICATIONS ── */
  .notif-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .notif-icon { font-size: 24px; flex-shrink: 0; }
  .notif-body { flex: 1; }
  .notif-title { font-size: 14px; font-weight: 800; }
  .notif-text { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.4; }
  .notif-time { font-size: 11px; color: var(--muted); margin-top: 4px; }
  .notif-unread { background: var(--primary-light); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 2px; }

  /* ── PWA BANNER ── */
  .pwa-banner {
    background: linear-gradient(135deg, #6C63FF, #A78BFA);
    border-radius: var(--radius); padding: 16px 18px; margin-bottom: 16px;
    color: white; display: flex; align-items: center; gap: 14px;
  }
  .pwa-banner-icon { font-size: 32px; }
  .pwa-banner-text { flex: 1; }
  .pwa-banner-title { font-size: 15px; font-weight: 800; }
  .pwa-banner-sub { font-size: 12px; opacity: 0.85; margin-top: 2px; }
  .pwa-banner-btn {
    background: white; color: var(--primary); border: none;
    border-radius: 10px; padding: 8px 14px; font-family: inherit;
    font-size: 13px; font-weight: 800; cursor: pointer; white-space: nowrap;
  }
`;

// ─── PWA HELPERS ─────────────────────────────────────────────────────────────
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (e) {
      console.warn('SW registration failed:', e);
    }
  }
}

async function subscribePush(userId) {
  try {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      await savePushSub(userId, existing);
      return;
    }
    const VAPID_PUBLIC = 'BBtry6BgC6rvd-vlGvYaitctL9CNfpdIAo2xUjjz7mXhKD6r4aJ__QfWsC3ZOWbcvtyJJjctMMUDwV077-MeFQM'; // remplacer
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
    });
    await savePushSub(userId, sub);
  } catch (e) {
    console.warn('Push subscription failed:', e);
  }
}

async function savePushSub(userId, sub) {
  await supabase.from('push_subscriptions').upsert({
    user_id: userId,
    subscription: JSON.stringify(sub),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useSupabase() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registerSW();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(uid) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
    setProfile(data);
    setLoading(false);
    if (data) subscribePush(uid);
  }

  return { user, profile, loading, refetchProfile: () => user && fetchProfile(user.id) };
}

// ─── NOTIFICATION HELPER ─────────────────────────────────────────────────────
async function sendNotification(familyId, fromId, title, body, type = 'info', targetRole = null) {
  const q = supabase.from('profiles').select('id').eq('family_id', familyId).neq('id', fromId);
  if (targetRole) q.eq('role', targetRole);
  const { data: targets } = await q;
  if (!targets?.length) return;
  const rows = targets.map(t => ({
    user_id: t.id,
    family_id: familyId,
    title,
    body,
    type,
    read: false,
  }));
  await supabase.from('notifications').insert(rows);
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function TaskCard({ task, profile, onAction, onApprove, onReject }) {
  const canAccept = profile?.role === 'child' && task.status === 'open' && !task.accepted_by;
  const isMyTask = task.accepted_by === profile?.id;
  const canFinish = isMyTask && task.status === 'in_progress';
  const canValidate = profile?.role === 'parent' && task.status === 'pending_validation';

  const statusBadge = {
    open: <span className="badge badge-primary">Disponible</span>,
    in_progress: <span className="badge badge-warning">En cours</span>,
    pending_validation: <span className="badge badge-accent">⏳ À valider</span>,
    completed: <span className="badge badge-success">✅ Terminé</span>,
  }[task.status];

  return (
    <div className={`card task-card ${task.status === 'pending_validation' ? 'pending' : ''} ${task.status === 'completed' ? 'completed' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div className="task-title">{task.title}</div>
        {statusBadge}
      </div>
      {task.description && <div className="task-desc">{task.description}</div>}
      <div className="task-footer">
        <div className="coin-reward">{COIN_SYMBOL} {task.reward} {COIN_NAME}s</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {canAccept && <button className="btn btn-primary btn-sm" onClick={() => onAction(task.id, 'accept')}>Accepter</button>}
          {canFinish && <button className="btn btn-success btn-sm" onClick={() => onAction(task.id, 'finish')}>Terminer ✓</button>}
          {canValidate && (
            <>
              <button className="btn btn-success btn-sm" onClick={() => onApprove(task)}>✓ Valider</button>
              <button className="btn btn-danger btn-sm" onClick={() => onReject(task)}>✗</button>
            </>
          )}
        </div>
      </div>
      {task.accepted_by_name && task.status !== 'open' && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>👤 {task.accepted_by_name}</div>
      )}
    </div>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

// Auth
function AuthScreen() {
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('child');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setError(''); setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      } else {
        let familyId = null;
        if (role === 'child' || (role === 'parent' && familyCode)) {
          const { data: fam } = await supabase.from('families').select('id').eq('code', familyCode.toUpperCase()).single();
          if (!fam) { setError('Code famille invalide.'); setLoading(false); return; }
          familyId = fam.id;
        } else {
          const code = Math.random().toString(36).substring(2, 8).toUpperCase();
          const { data: fam } = await supabase.from('families').insert({ name: name + "'s Family", code }).select().single();
          familyId = fam.id;
        }
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) { setError(authError.message); setLoading(false); return; }
        await supabase.from('profiles').insert({ id: authData.user.id, name, role, family_id: familyId, coins: 0 });
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  return (
    <div className="auth-bg">
      <div className="auth-logo">🌟</div>
      <div className="auth-title">FamilyStars</div>
      <div className="auth-subtitle">Les tâches, c'est récompensé !</div>
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Connexion</button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Inscription</button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {tab === 'register' && (
          <>
            <div className="role-selector">
              <button className={`role-btn ${role === 'parent' ? 'active' : ''}`} onClick={() => setRole('parent')}><span className="role-icon">👨‍👩‍👧</span>Parent</button>
              <button className={`role-btn ${role === 'child' ? 'active' : ''}`} onClick={() => setRole('child')}><span className="role-icon">🧒</span>Enfant</button>
            </div>
            <div className="field"><label>Prénom</label><input placeholder="Ton prénom" value={name} onChange={e => setName(e.target.value)} /></div>
          </>
        )}
        <div className="field"><label>Email</label><input type="email" placeholder="email@exemple.fr" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="field"><label>Mot de passe</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
        {tab === 'register' && (
          <div className="field">
            <label>{role === 'parent' ? 'Code famille (vide = nouvelle famille)' : 'Code famille *'}</label>
            <input placeholder="Ex: AB12CD" value={familyCode} onChange={e => setFamilyCode(e.target.value)} />
          </div>
        )}
        <button className="btn btn-primary" onClick={handleAuth} disabled={loading}>
          {loading ? '...' : tab === 'login' ? 'Se connecter 🚀' : 'Créer mon compte ✨'}
        </button>
      </div>
    </div>
  );
}

// Tasks
function TasksScreen({ profile, refetch }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [reward, setReward] = useState(10);
  const [msg, setMsg] = useState('');

  const fetchTasks = useCallback(async () => {
    const q = supabase.from('tasks').select('*, profiles:accepted_by(name)').eq('family_id', profile.family_id).order('created_at', { ascending: false });
    const { data } = profile.role === 'parent' ? await q : await q.in('status', ['open', 'in_progress', 'pending_validation']);
    setTasks((data || []).map(t => ({ ...t, accepted_by_name: t.profiles?.name })));
    setLoading(false);
  }, [profile]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function handleAction(taskId, action) {
    if (action === 'accept') {
      await supabase.from('tasks').update({ status: 'in_progress', accepted_by: profile.id }).eq('id', taskId);
      const task = tasks.find(t => t.id === taskId);
      await sendNotification(profile.family_id, profile.id, '📋 Tâche acceptée', `${profile.name} a accepté "${task?.title}"`, 'task', 'parent');
    } else if (action === 'finish') {
      await supabase.from('tasks').update({ status: 'pending_validation' }).eq('id', taskId);
      const task = tasks.find(t => t.id === taskId);
      await sendNotification(profile.family_id, profile.id, '✅ Tâche terminée !', `${profile.name} a terminé "${task?.title}" — validez !`, 'task_done', 'parent');
    }
    fetchTasks();
  }

  async function handleApprove(task) {
    await supabase.from('tasks').update({ status: 'completed' }).eq('id', task.id);
    await supabase.rpc('add_coins', { user_id: task.accepted_by, amount: task.reward });
    await sendNotification(profile.family_id, profile.id, `${COIN_SYMBOL} Récompense reçue !`, `${task.reward} ${COIN_NAME}s pour "${task.title}" !`, 'reward', 'child');
    setMsg(`✅ Tâche validée ! ${task.reward} ${COIN_NAME}s accordés.`);
    fetchTasks(); refetch();
    setTimeout(() => setMsg(''), 3000);
  }

  async function handleReject(task) {
    await supabase.from('tasks').update({ status: 'open', accepted_by: null }).eq('id', task.id);
    await sendNotification(profile.family_id, profile.id, '❌ Tâche refusée', `"${task.title}" a été refusée, réessaie !`, 'task_rejected', 'child');
    fetchTasks();
  }

  async function createTask() {
    if (!title || !reward) return;
    await supabase.from('tasks').insert({ title, description: desc, reward: Number(reward), family_id: profile.family_id, created_by: profile.id, status: 'open' });
    await sendNotification(profile.family_id, profile.id, '🌟 Nouvelle tâche !', `"${title}" — ${reward} ${COIN_NAME}s à gagner !`, 'new_task', 'child');
    setTitle(''); setDesc(''); setReward(10); setShowCreate(false); fetchTasks();
  }

  const open = tasks.filter(t => t.status === 'open');
  const inProgress = tasks.filter(t => t.status === 'in_progress');
  const pending = tasks.filter(t => t.status === 'pending_validation');
  const done = tasks.filter(t => t.status === 'completed');

  return (
    <>
      <div className="content">
        {msg && <div className="alert alert-success">{msg}</div>}
        <div className="section-title">
          Tâches
          {profile.role === 'parent' && <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ Créer</button>}
        </div>
        {loading ? <div className="spinner">Chargement...</div> : (
          <>
            {pending.length > 0 && (<><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>⏳ En attente de validation</div>{pending.map(t => <TaskCard key={t.id} task={t} profile={profile} onAction={handleAction} onApprove={handleApprove} onReject={handleReject} />)}<div className="divider" /></>)}
            {inProgress.length > 0 && (<><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>🔄 En cours</div>{inProgress.map(t => <TaskCard key={t.id} task={t} profile={profile} onAction={handleAction} onApprove={handleApprove} onReject={handleReject} />)}<div className="divider" /></>)}
            {open.length > 0 && (<><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>🌟 Disponibles</div>{open.map(t => <TaskCard key={t.id} task={t} profile={profile} onAction={handleAction} onApprove={handleApprove} onReject={handleReject} />)}</>)}
            {profile.role === 'parent' && done.length > 0 && (<><div className="divider" /><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', marginBottom: 8 }}>✅ Terminées</div>{done.map(t => <TaskCard key={t.id} task={t} profile={profile} onAction={handleAction} onApprove={handleApprove} onReject={handleReject} />)}</>)}
            {tasks.length === 0 && <div className="empty"><div className="empty-icon">📋</div><p>{profile.role === 'parent' ? 'Aucune tâche créée. Commencez !' : "Aucune tâche disponible."}</p></div>}
          </>
        )}
      </div>
      {showCreate && (
        <div className="overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <div className="modal-title">✨ Nouvelle tâche</div>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <div className="field"><label>Titre *</label><input placeholder="Ranger sa chambre..." value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="field"><label>Description</label><textarea placeholder="Détails de la tâche..." value={desc} onChange={e => setDesc(e.target.value)} /></div>
            <div className="field">
              <label>Récompense : {reward} {COIN_SYMBOL} {COIN_NAME}s</label>
              <input type="range" min="1" max="100" value={reward} onChange={e => setReward(e.target.value)} style={{ marginBottom: 4 }} />
            </div>
            <button className="btn btn-primary" onClick={createTask}>Créer la tâche 🚀</button>
          </div>
        </div>
      )}
    </>
  );
}

// Shop
function ShopScreen({ profile, refetch }) {
  const [items, setItems] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', icon: '🎁', cost: 10, type: 'other' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('shop_items').select('*').eq('family_id', profile.family_id).eq('active', true).order('cost')
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, [profile]);

  async function redeem(item) {
    if (profile.coins < item.cost) { setMsg("❌ Pas assez d'étoiles !"); setTimeout(() => setMsg(''), 3000); return; }
    await supabase.from('redemptions').insert({ profile_id: profile.id, item_id: item.id, family_id: profile.family_id, status: 'pending', coins_spent: item.cost });
    await supabase.rpc('add_coins', { user_id: profile.id, amount: -item.cost });
    await sendNotification(profile.family_id, profile.id, '🎁 Demande d\'échange', `${profile.name} veut "${item.name}" (${item.cost} ${COIN_NAME}s)`, 'redemption', 'parent');
    setMsg(`🎉 Échange demandé ! Un parent va valider.`);
    setTimeout(() => setMsg(''), 4000);
    refetch();
  }

  async function createItem() {
    await supabase.from('shop_items').insert({ ...form, cost: Number(form.cost), family_id: profile.family_id, active: true });
    setShowCreate(false);
    supabase.from('shop_items').select('*').eq('family_id', profile.family_id).eq('active', true).order('cost').then(({ data }) => setItems(data || []));
  }

  const ICONS = ['🎁', '🍕', '🎮', '🎬', '💰', '🧸', '🍦', '⭐', '🏆', '🎪', '📱', '🚗'];

  return (
    <>
      <div className="content">
        {msg && <div className={`alert ${msg.startsWith('❌') ? 'alert-danger' : 'alert-success'}`}>{msg}</div>}
        <div className="section-title">
          Boutique
          {profile.role === 'parent' && <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ Ajouter</button>}
        </div>
        <div style={{ marginBottom: 16, fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}>
          Ton solde : <span style={{ color: '#7C5800', fontWeight: 900 }}>{profile.coins} {COIN_SYMBOL}</span>
        </div>
        {loading ? <div className="spinner">Chargement...</div> : items.length === 0 ? (
          <div className="empty"><div className="empty-icon">🏪</div><p>La boutique est vide.</p></div>
        ) : (
          items.map(item => (
            <div key={item.id} className="shop-card">
              <div className="shop-icon">{item.icon}</div>
              <div className="shop-info">
                <div className="shop-name">{item.name}</div>
                {item.description && <div className="shop-desc">{item.description}</div>}
                <div className="coin-reward" style={{ marginTop: 6, display: 'inline-flex' }}>{COIN_SYMBOL} {item.cost}</div>
              </div>
              {profile.role === 'child' && (
                <button className="btn btn-gold btn-sm" onClick={() => redeem(item)} disabled={profile.coins < item.cost}>Échanger</button>
              )}
            </div>
          ))
        )}
      </div>
      {showCreate && (
        <div className="overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <div className="modal-title">🏪 Nouvel article</div>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <div className="field"><label>Nom *</label><input placeholder="Ex: 1h de jeu vidéo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="field"><label>Description</label><input placeholder="Détails..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="field">
              <label>Icône</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                    style={{ background: form.icon === ic ? 'var(--primary-light)' : 'var(--bg)', border: form.icon === ic ? '2px solid var(--primary)' : '1.5px solid var(--border)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', fontSize: 20 }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Coût : {form.cost} {COIN_SYMBOL}</label>
              <input type="range" min="1" max="500" step="5" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={createItem}>Ajouter à la boutique ✨</button>
          </div>
        </div>
      )}
    </>
  );
}

// Redemptions
function RedemptionsScreen({ profile, refetch }) {
  const [items, setItems] = useState([]);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('redemptions')
      .select('*, profiles:profile_id(name), shop_items:item_id(name,icon)')
      .eq('family_id', profile.family_id)
      .order('created_at', { ascending: false });
    setItems(data || []);
  }, [profile]);

  useEffect(() => { fetch(); }, [fetch]);

  async function approve(r) {
    await supabase.from('redemptions').update({ status: 'approved' }).eq('id', r.id);
    await sendNotification(profile.family_id, profile.id, '🎉 Échange accordé !', `Tu peux profiter de "${r.shop_items?.name}" !`, 'redemption_ok', 'child');
    fetch();
  }
  async function deny(r) {
    await supabase.rpc('add_coins', { user_id: r.profile_id, amount: r.coins_spent });
    await supabase.from('redemptions').update({ status: 'denied' }).eq('id', r.id);
    await sendNotification(profile.family_id, profile.id, '❌ Échange refusé', `L'échange "${r.shop_items?.name}" a été refusé.`, 'redemption_ko', 'child');
    fetch(); refetch();
  }

  const pending = items.filter(i => i.status === 'pending');
  const done = items.filter(i => i.status !== 'pending');

  return (
    <div className="content">
      <div className="section-title">Échanges</div>
      {pending.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>⏳ En attente</div>
          {pending.map(r => (
            <div key={r.id} className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div><span style={{ fontSize: 22, marginRight: 8 }}>{r.shop_items?.icon}</span><span style={{ fontWeight: 800 }}>{r.shop_items?.name}</span></div>
                <span className="coin-reward">{COIN_SYMBOL} {r.coins_spent}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>par <strong>{r.profiles?.name}</strong></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm" onClick={() => approve(r)}>✓ Accorder</button>
                <button className="btn btn-danger btn-sm" onClick={() => deny(r)}>✗ Refuser</button>
              </div>
            </div>
          ))}
          <div className="divider" />
        </>
      )}
      {done.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>Historique</div>
          {done.map(r => (
            <div key={r.id} className="card" style={{ opacity: 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><span style={{ fontSize: 18, marginRight: 8 }}>{r.shop_items?.icon}</span><span style={{ fontWeight: 700, fontSize: 14 }}>{r.shop_items?.name}</span><span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6 }}>— {r.profiles?.name}</span></div>
                <span className={`badge ${r.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{r.status === 'approved' ? '✓' : '✗'}</span>
              </div>
            </div>
          ))}
        </>
      )}
      {items.length === 0 && <div className="empty"><div className="empty-icon">🎁</div><p>Aucun échange pour l'instant.</p></div>}
    </div>
  );
}

// ── CHAT ─────────────────────────────────────────────────────────────────────
function ChatScreen({ profile }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [members, setMembers] = useState({});
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase.from('messages')
      .select('*')
      .eq('family_id', profile.family_id)
      .order('created_at', { ascending: true })
      .limit(100);
    setMessages(data || []);
  }, [profile]);

  useEffect(() => {
    fetchMessages();
    // load member map for avatars
    supabase.from('profiles').select('id,name,role').eq('family_id', profile.family_id)
      .then(({ data }) => {
        const map = {};
        (data || []).forEach(m => { map[m.id] = m; });
        setMembers(map);
      });

    // realtime subscription
    const channel = supabase.channel('chat:' + profile.family_id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `family_id=eq.${profile.family_id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchMessages, profile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const content = text.trim();
    if (!content) return;
    setText('');
    await supabase.from('messages').insert({
      family_id: profile.family_id,
      sender_id: profile.id,
      sender_name: profile.name,
      content,
    });
    // notify others
    await sendNotification(profile.family_id, profile.id, `💬 ${profile.name}`, content.length > 40 ? content.substring(0, 40) + '…' : content, 'chat');
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function avatarColor(id) {
    const m = members[id];
    if (!m) return { bg: 'var(--bg)', color: 'var(--muted)' };
    return m.role === 'parent'
      ? { bg: 'var(--primary-light)', color: 'var(--primary-dark)' }
      : { bg: 'var(--accent-light)', color: '#9D174D' };
  }

  return (
    <div className="chat-wrapper">
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'white' }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>💬 Chat Famille</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{Object.keys(members).length} membres</div>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty" style={{ padding: '60px 20px' }}>
            <div className="empty-icon">💬</div>
            <p>Commencez à discuter en famille !</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.sender_id === profile.id;
          const m = members[msg.sender_id];
          const initials = (msg.sender_name || '?').charAt(0).toUpperCase();
          const ac = avatarColor(msg.sender_id);
          const showName = !isMine && (i === 0 || messages[i - 1].sender_id !== msg.sender_id);
          return (
            <div key={msg.id} className={`msg-row ${isMine ? 'mine' : ''}`}>
              {!isMine && (
                <div className="msg-avatar" style={{ background: ac.bg, color: ac.color }}>{initials}</div>
              )}
              <div>
                {showName && <div className="msg-sender">{msg.sender_name}</div>}
                <div className={`msg-bubble ${isMine ? 'mine' : 'theirs'}`}>{msg.content}</div>
                <div className="msg-meta">{timeAgo(msg.created_at)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Écris un message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className="chat-send" onClick={send}>➤</button>
      </div>
    </div>
  );
}

// ── NOTIFICATIONS SCREEN ─────────────────────────────────────────────────────
function NotificationsScreen({ profile, onRead }) {
  const [notifs, setNotifs] = useState([]);

  const TYPE_ICON = {
    task: '📋', task_done: '✅', reward: '⭐', task_rejected: '❌',
    new_task: '🌟', redemption: '🎁', redemption_ok: '🎉', redemption_ko: '❌',
    chat: '💬', info: 'ℹ️',
  };

  useEffect(() => {
    supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => setNotifs(data || []));

    // mark all as read
    supabase.from('notifications').update({ read: true }).eq('user_id', profile.id).eq('read', false).then(() => onRead());

    const channel = supabase.channel('notifs:' + profile.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        (payload) => {
          setNotifs(prev => [payload.new, ...prev]);
          supabase.from('notifications').update({ read: true }).eq('id', payload.new.id);
          onRead();
        })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile, onRead]);

  return (
    <div className="content">
      <div className="section-title">Notifications</div>
      {notifs.length === 0 && <div className="empty"><div className="empty-icon">🔔</div><p>Aucune notification.</p></div>}
      {notifs.map(n => (
        <div key={n.id} className={`notif-item ${!n.read ? 'notif-unread' : ''}`}>
          <div className="notif-icon">{TYPE_ICON[n.type] || 'ℹ️'}</div>
          <div className="notif-body">
            <div className="notif-title">{n.title}</div>
            <div className="notif-text">{n.body}</div>
            <div className="notif-time">{timeAgo(n.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileScreen({ profile, refetch }) {
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [notifPerm, setNotifPerm] = useState(Notification?.permission || 'default');

  useEffect(() => {
    supabase.from('families').select('*').eq('id', profile.family_id).single().then(({ data }) => setFamily(data));
    supabase.from('profiles').select('*').eq('family_id', profile.family_id).order('role').then(({ data }) => setMembers(data || []));

    // check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setPwaInstalled(true);
    }
  }, [profile]);

  async function installPWA() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') { setPwaInstalled(true); deferredInstallPrompt = null; }
    } else {
      alert("Pour installer l'app :\n• Sur iPhone : bouton Partager → \"Sur l'écran d'accueil\"\n• Sur Android : menu ⋮ → \"Ajouter à l'écran d'accueil\"");
    }
  }

  async function enableNotifications() {
    if (!('Notification' in window)) { alert("Les notifications ne sont pas supportées."); return; }
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    if (perm === 'granted') { await subscribePush(profile.id); }
  }

  async function logout() { await supabase.auth.signOut(); }

  return (
    <div className="content">
      <div className="profile-section">
        <div className="profile-avatar">{profile.role === 'parent' ? '👨‍👩‍👧' : '🧒'}</div>
        <div className="profile-name">{profile.name}</div>
        <div className="profile-role">{profile.role === 'parent' ? 'Parent' : 'Enfant'}</div>
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-num">{profile.coins} {COIN_SYMBOL}</div>
            <div className="stat-label">{COIN_NAME}s</div>
          </div>
          {family && (
            <div className="stat-box">
              <div className="stat-num" style={{ fontSize: 15 }}>{family.code}</div>
              <div className="stat-label">Code famille</div>
            </div>
          )}
        </div>
      </div>

      {/* PWA + Notifs */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 10 }}>APPLICATION</div>

        {!pwaInstalled && (
          <div className="pwa-banner">
            <div className="pwa-banner-icon">📲</div>
            <div className="pwa-banner-text">
              <div className="pwa-banner-title">Installer l'app</div>
              <div className="pwa-banner-sub">Accès rapide depuis l'écran d'accueil</div>
            </div>
            <button className="pwa-banner-btn" onClick={installPWA}>Installer</button>
          </div>
        )}

        {pwaInstalled && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: 24 }}>✅</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>App installée</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>FamilyStars est sur votre écran d'accueil</div>
            </div>
          </div>
        )}

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <div style={{ fontSize: 24 }}>🔔</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Notifications</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              {notifPerm === 'granted' ? '✅ Activées' : notifPerm === 'denied' ? '❌ Bloquées dans les réglages' : 'Recevez les alertes en temps réel'}
            </div>
          </div>
          {notifPerm !== 'granted' && notifPerm !== 'denied' && (
            <button className="btn btn-primary btn-sm" onClick={enableNotifications}>Activer</button>
          )}
        </div>
      </div>

      <div className="section-title" style={{ fontSize: 16 }}>Membres de la famille</div>
      {members.map(m => (
        <div key={m.id} className="user-row">
          <div className={`avatar ${m.role === 'parent' ? 'avatar-parent' : 'avatar-child'}`}>
            {m.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{m.name} {m.id === profile.id && <span style={{ fontSize: 11, color: 'var(--muted)' }}>(moi)</span>}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.role === 'parent' ? 'Parent' : 'Enfant'}</div>
          </div>
          <div className="coin-reward">{COIN_SYMBOL} {m.coins}</div>
        </div>
      ))}
      <div className="divider" />
      <button className="btn btn-outline" onClick={logout} style={{ marginTop: 8 }}>Se déconnecter</button>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, profile, loading, refetchProfile } = useSupabase();
  const [tab, setTab] = useState('tasks');
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadChat, setUnreadChat] = useState(0);

  // count unread notifications
  useEffect(() => {
    if (!profile) return;
    supabase.from('notifications').select('id', { count: 'exact' }).eq('user_id', profile.id).eq('read', false)
      .then(({ count }) => setUnreadNotifs(count || 0));

    const channel = supabase.channel('notif-count:' + profile.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        () => setUnreadNotifs(n => n + 1))
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile]);

  // count unread chat (messages received while not on chat tab)
  useEffect(() => {
    if (!profile || tab === 'chat') return;
    const channel = supabase.channel('chat-unread:' + profile.family_id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `family_id=eq.${profile.family_id}` },
        (payload) => {
          if (payload.new.sender_id !== profile.id) setUnreadChat(n => n + 1);
        })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [profile, tab]);

  useEffect(() => {
    if (tab === 'chat') setUnreadChat(0);
  }, [tab]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌟</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--muted)' }}>Chargement...</div>
      </div>
    </div>
  );

  if (!user || !profile) return <AuthScreen />;

  const navItems = profile.role === 'parent'
    ? [
        { id: 'tasks', icon: '📋', label: 'Tâches' },
        { id: 'shop', icon: '🏪', label: 'Boutique' },
        { id: 'redemptions', icon: '🎁', label: 'Échanges' },
        { id: 'chat', icon: '💬', label: 'Chat', badge: unreadChat },
        { id: 'notifications', icon: '🔔', label: 'Alertes', badge: unreadNotifs },
        { id: 'profile', icon: '👤', label: 'Profil' },
      ]
    : [
        { id: 'tasks', icon: '📋', label: 'Tâches' },
        { id: 'shop', icon: '🏪', label: 'Boutique' },
        { id: 'chat', icon: '💬', label: 'Chat', badge: unreadChat },
        { id: 'notifications', icon: '🔔', label: 'Alertes', badge: unreadNotifs },
        { id: 'profile', icon: '👤', label: 'Profil' },
      ];

  return (
    <div className="app">
      <style>{css}</style>
      <div className="header">
        <div className="header-left">
          <span className="header-greeting">Bonjour 👋</span>
          <span className="header-name">{profile.name}</span>
        </div>
        <div className="coin-badge">
          <span>⭐</span>
          <span>{profile.coins} {COIN_NAME}s</span>
        </div>
      </div>
      {tab === 'tasks' && <TasksScreen profile={profile} refetch={refetchProfile} />}
      {tab === 'shop' && <ShopScreen profile={profile} refetch={refetchProfile} />}
      {tab === 'redemptions' && profile.role === 'parent' && <RedemptionsScreen profile={profile} refetch={refetchProfile} />}
      {tab === 'chat' && <ChatScreen profile={profile} />}
      {tab === 'notifications' && <NotificationsScreen profile={profile} onRead={() => setUnreadNotifs(0)} />}
      {tab === 'profile' && <ProfileScreen profile={profile} refetch={refetchProfile} />}
      <nav className="nav">
        {navItems.map(n => (
          <button key={n.id} className={`nav-btn ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
            <span className="icon">{n.icon}</span>
            <span className="label">{n.label}</span>
            {n.badge > 0 && <span className="nav-badge">{n.badge > 9 ? '9+' : n.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
