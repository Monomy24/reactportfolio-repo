import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';

// Import our isolated sub-component data managers cleanly
import { AdminProjectsManager } from './AdminProjectsManager';
import { AdminGalleryManager } from './AdminGalleryManager';

export function AdminOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const { isAuthenticated, setAuthenticated, draft, updateDraft, data, isSaving, setSaving, setPortfolioData } = usePortfolioStore();

  useEffect(() => {
    const handleHashChange = () => setIsOpen(window.location.hash === '#admin');
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!isOpen) return null;

  const verifyPin = async () => {
    if (!data?.settings.pinHash) return;
    const encoder = new TextEncoder();
    const encodedPin = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedPin);
    const calculatedHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (calculatedHash === data.settings.pinHash) {
      setAuthenticated(true);
    } else {
      alert('Invalid PIN Access Code.');
      setPin('');
    }
  };

  const processImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    if (!draft) return;
    if (!window.confirm('Commit modifications and trigger production rebuild deployment?')) return;

    try {
      setSaving(true);
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      });
      if (!response.ok) throw new Error('Could not persist content changes.');
      setPortfolioData(draft);
      alert('Content synchronized successfully. Deployment triggered.');
    } catch (err: any) {
      alert(`Synchronization Failure: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Admin System Terminal</h3>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} className="w-full text-center text-2xl tracking-widest bg-zinc-950 border border-zinc-800 py-3 rounded-xl focus:border-emerald-500 font-mono text-emerald-400 outline-none" placeholder="••••" />
          <button onClick={verifyPin} className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-3 rounded-xl text-sm">Authenticate Session</button>
          <button onClick={() => { window.location.hash = ''; }} className="text-xs font-mono text-zinc-500 hover:text-zinc-400">Exit Workspace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-10 shadow-2xl">
        <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Portfolio Engine Console</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setAuthenticated(false); window.location.hash = ''; }} className="px-4 py-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium text-sm">Close</button>
            <button onClick={handleSaveChanges} disabled={isSaving} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-zinc-950 rounded-xl font-semibold text-sm">
              {isSaving ? 'Synchronizing...' : 'Commit Updates'}
            </button>
          </div>
        </div>

        {draft && (
          <div className="space-y-12">
            {/* Hero & About Base Inputs */}
            <div className="space-y-12 divide-y divide-zinc-800/60">
              <div className="space-y-4">
                <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Hero Component Profile Configuration</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Full Public Display Name</label>
                    <input type="text" value={draft.hero.name} onChange={(e) => updateDraft(d => { d.hero.name = e.target.value; })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Professional Engineering Title</label>
                    <input type="text" value={draft.hero.title} onChange={(e) => updateDraft(d => { d.hero.title = e.target.value; })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Tagline / Mission Pitch</label>
                    <input type="text" value={draft.hero.tagline} onChange={(e) => updateDraft(d => { d.hero.tagline = e.target.value; })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm outline-none" />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Profile Branding Image</label>
                    <input type="file" accept="image/*" onChange={(e) => processImageUpload(e, (b64) => updateDraft(d => { d.hero.profileImage = b64; }))} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-xl text-zinc-400 text-xs" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">About Content Settings</h3>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400">Biographical Narrative Copy</label>
                  <textarea rows={4} value={draft.about.bio} onChange={(e) => updateDraft(d => { d.about.bio = e.target.value; })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm outline-none resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400">Skills Ecosystem</label>
                  <input type="text" value={draft.about.skills.join(', ')} onChange={(e) => updateDraft(d => { d.about.skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean); })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm font-mono text-emerald-400 outline-none" />
                </div>
              </div>
            </div>

            {/* Render subcomponents to capture lists safely */}
            <AdminProjectsManager />
            <AdminGalleryManager />
          </div>
        )}
      </div>
    </div>
  );
}
