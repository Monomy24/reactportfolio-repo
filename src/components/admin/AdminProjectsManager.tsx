import { usePortfolioStore } from '../../store/portfolioStore';

export function AdminProjectsManager() {
  const { draft, updateDraft } = usePortfolioStore();

  if (!draft) return null;

  return (
    <div className="space-y-6 pt-8 border-t border-zinc-800/60">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Project Portfolio Repositories</h3>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Manage live portfolio timeline entries and technical stacks.</p>
        </div>
        <button 
          type="button"
          onClick={() => updateDraft(d => {
            d.projects.push({
              id: crypto.randomUUID(),
              title: "New Project Item",
              description: "",
              stack: [],
              liveUrl: "",
              githubUrl: "",
              featured: false
            });
          })}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-lg border border-zinc-700 transition-colors"
        >
          + Add Project Entry
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {draft.projects.map((project, index) => (
          <div key={project.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl relative space-y-4 group">
            <button
              type="button"
              onClick={() => updateDraft(d => { d.projects.splice(index, 1); })}
              className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 text-xs font-mono transition-colors"
            >
              Remove
            </button>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-500">Project Title</label>
                <input 
                  type="text" 
                  value={project.title} 
                  onChange={(e) => updateDraft(d => { d.projects[index].title = e.target.value; })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-sm outline-none focus:border-emerald-500/30 text-zinc-200" 
                />
              </div>
              <div className="space-y-1 flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-mono text-zinc-400">
                  <input 
                    type="checkbox" 
                    checked={project.featured} 
                    onChange={(e) => updateDraft(d => { d.projects[index].featured = e.target.checked; })}
                    className="accent-emerald-500 rounded" 
                  />
                  Feature on Main Layout Hero Ring
                </label>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-mono text-zinc-500">Repository Summary</label>
                <textarea 
                  rows={2}
                  value={project.description} 
                  onChange={(e) => updateDraft(d => { d.projects[index].description = e.target.value; })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-sm outline-none resize-none focus:border-emerald-500/30 text-zinc-300 leading-relaxed" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-500">Live Domain Deployment Anchor</label>
                <input 
                  type="text" 
                  value={project.liveUrl} 
                  onChange={(e) => updateDraft(d => { d.projects[index].liveUrl = e.target.value; })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono outline-none focus:border-emerald-500/30 text-zinc-400" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-500">Source Control Git Link</label>
                <input 
                  type="text" 
                  value={project.githubUrl} 
                  onChange={(e) => updateDraft(d => { d.projects[index].githubUrl = e.target.value; })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono outline-none focus:border-emerald-500/30 text-zinc-400" 
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-mono text-zinc-500">Framework Infrastructure Array</label>
                <input 
                  type="text" 
                  value={project.stack.join(', ')} 
                  onChange={(e) => updateDraft(d => { 
                    d.projects[index].stack = e.target.value.split(',').map(s => s.trim()).filter(Boolean); 
                  })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono outline-none focus:border-emerald-500/30 text-emerald-400" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
