import { usePortfolioStore } from '../../store/portfolioStore';

export function AdminAboutManager() {
  const { draft, updateDraft } = usePortfolioStore();

  if (!draft) return null;

  const execFormattingCommand = (command: string) => {
    document.execCommand(command, false, '');
  };

  // Modern frontend translate engine matches your iconCode keywords directly to crisp Devicon classes
  const getIconClass = (iconCode: string) => {
    const clean = (iconCode || '').toLowerCase().trim();
    if (!clean) return 'devicon-code-plain text-zinc-600 text-lg';
    
    // Direct token string map translations
    if (clean === 'js' || clean === 'javascript') return 'devicon-javascript-plain colored text-lg';
    if (clean === 'ts' || clean === 'typescript') return 'devicon-typescript-plain colored text-lg';
    if (clean === 'tailwind' || clean === 'css4') return 'devicon-tailwindcss-flat colored text-lg';
    
    // Strict semantic fallback passes your literal keyword strings straight into the font matrix engine
    return `devicon-${clean}-plain colored text-lg fallback-vector`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">About Content Settings</h3>
        <p className="text-xs text-zinc-500 font-light mt-0.5">Edit biographical text rich layouts and manage technical toolkits.</p>
      </div>

      <div className="space-y-4">
        {/* Rich Text Editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 block">Biographical Narrative Copy</label>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500/30">
            <div className="flex items-center gap-1 bg-zinc-900/50 p-2 border-b border-zinc-800 text-xs font-mono text-zinc-400 select-none">
              <button type="button" onClick={() => execFormattingCommand('bold')} className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-200 font-bold cursor-pointer">B</button>
              <button type="button" onClick={() => execFormattingCommand('italic')} className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-200 italic cursor-pointer">I</button>
              <button type="button" onClick={() => execFormattingCommand('underline')} className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-200 underline cursor-pointer">U</button>
            </div>
            <div 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                updateDraft(d => { d.about.bio = e.currentTarget.innerHTML; });
              }}
              dangerouslySetInnerHTML={{ __html: draft.about.bio }}
              className="w-full min-h-[140px] p-4 text-sm outline-none text-zinc-300 leading-relaxed max-h-[250px] overflow-y-auto custom-scrollbar whitespace-pre-wrap"
            />
          </div>
        </div>

        {/* Professional Toolkit Matrix Dashboard Section */}
        <div className="space-y-3 bg-zinc-950/40 p-4 border border-zinc-800 rounded-xl">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
            <span className="text-xs font-mono font-medium text-zinc-400">Technical Skill Vector Deck</span>
            <button
              type="button"
              onClick={() => updateDraft(d => { 
                d.about.skills.push({ name: "New Skill Title", iconCode: "react" }); 
              })}
              className="text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded border border-zinc-700/60 transition-colors cursor-pointer"
            >
              + Add Tech Badge
            </button>
          </div>

          <div className="grid gap-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            {draft.about.skills.map((skill, sIdx) => (
              <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-zinc-900/40 border border-zinc-800/80 p-3 rounded-xl group relative">
                
                {/* Real-time Dynamic Vector SVG Icon Preview Circle */}
                <div className="w-10 h-10 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
                  <i className={getIconClass(skill.iconCode)} onError={(e)=>{ (e.target as HTMLElement).className = 'devicon-code-plain text-zinc-500'; }} />
                </div>
                
                {/* Double Core Input Fields Split Matrix */}
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase">Public Display Name</label>
                    <input 
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateDraft(d => { d.about.skills[sIdx].name = e.target.value; })}
                      className="w-full bg-zinc-950 border border-zinc-800/50 p-2 rounded-lg text-xs font-mono text-zinc-200 outline-none focus:border-zinc-800"
                      placeholder="e.g. React Engine Core"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase">Icon Code / Keyword</label>
                    <input 
                      type="text"
                      value={skill.iconCode}
                      onChange={(e) => updateDraft(d => { d.about.skills[sIdx].iconCode = e.target.value; })}
                      className="w-full bg-zinc-950 border border-zinc-800/50 p-2 rounded-lg text-xs font-mono text-emerald-400 outline-none focus:border-zinc-800"
                      placeholder="e.g. react, nodejs, html5"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateDraft(d => { d.about.skills.splice(sIdx, 1); })}
                  className="sm:absolute sm:top-2 sm:right-2 text-zinc-600 hover:text-red-400 text-xs font-mono px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
