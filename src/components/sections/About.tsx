import { usePortfolioStore } from '../../store/portfolioStore';

export function About() {
  const data = usePortfolioStore((state) => state.data?.about);
  if (!data) return null;

  const getPublicIconClass = (iconCode: string) => {
    const clean = (iconCode || '').toLowerCase().trim();
    if (!clean) return 'devicon-code-plain text-zinc-500';
    if (clean === 'js' || clean === 'javascript') return 'devicon-javascript-plain colored';
    if (clean === 'ts' || clean === 'typescript') return 'devicon-typescript-plain colored';
    if (clean === 'tailwind' || clean === 'css4') return 'devicon-tailwindcss-flat colored';
    return `devicon-${clean}-plain colored`;
  };

  return (
    <section className="space-y-8" id="about">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">About Me</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Rich Text Bio Container — Safely binds formatting parameters generated in console */}
        <div 
          dangerouslySetInnerHTML={{ __html: data.bio }}
          className="md:col-span-2 text-zinc-400 leading-relaxed text-base sm:text-lg font-light space-y-4 rich-text-output"
        />
        
        {/* Public Skill Badge Grid */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest">Technical Toolkit</h3>
          <div className="flex flex-col gap-2.5">
            {data.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900 p-2.5 rounded-xl hover:border-zinc-700 transition-all duration-300">
                <div className="w-7 h-7 bg-zinc-900 border border-zinc-800/60 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
                  <i className={`${getPublicIconClass(skill.iconCode)} text-base`} />
                </div>
                <span className="text-zinc-300 text-sm font-mono font-medium tracking-tight">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
