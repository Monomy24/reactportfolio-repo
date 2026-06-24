import { usePortfolioStore } from '../../store/portfolioStore';

export function Gallery() {
  const gallery = usePortfolioStore((state) => state.data?.gallery || []);

  return (
    <section className="space-y-8" id="sandbox">
      {/* Updated Semantic Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Memories & Milestones</h2>
          <div className="h-[1px] bg-zinc-800 flex-1" />
        </div>
        <p className="text-sm font-light text-zinc-400 max-w-xl leading-relaxed">
          A visual archive of the moments that shaped my college experience.
        </p>
      </div>

      {/* Masonry Presentation Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 pt-4">
        {gallery.map((item) => (
          // Skip placeholder categories that don't have images loaded yet
          item.imageUrl && (
            <div key={item.id} className="break-inside-avoid relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900 group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-400 uppercase">{item.category}</span>
                <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
}
