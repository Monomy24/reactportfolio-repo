import { usePortfolioStore } from '../../store/portfolioStore';

export function Projects() {
  const projects = usePortfolioStore((state) => state.data?.projects || []);

  return (
    <section className="space-y-8" id="work">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Selected Work</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-lg">
            
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  {/* Displays structural metadata badges conditionally */}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mr-2">
                    [{project.githubUrl || 'Personal'}]
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    {project.liveUrl || 'Development'}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors mt-2">
                    {project.title}
                  </h3>
                </div>
                {project.featured && (
                  <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-zinc-950 bg-emerald-500 px-2 py-0.5 rounded-full shadow-sm shadow-emerald-500/10 shrink-0">
                    Done
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-sm sm:text-base line-clamp-3 font-light leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* CONDITION: Framework Infrastructure Array Render */}
              {project.frameworksArray && project.frameworksArray.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.frameworksArray.map((tech, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-900">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* CONDITION: Links Layer render (Deployment URLs & Git Links) */}
              {(project.deploymentUrl || project.sourceCodeUrl) && (
                <div className="flex gap-4 pt-3 border-t border-zinc-900/60 text-xs font-mono font-medium">
                  {project.deploymentUrl && (
                    <a href={project.deploymentUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                      Live Demo →
                    </a>
                  )}
                  {project.sourceCodeUrl && (
                    <a href={project.sourceCodeUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                      Source Git
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
