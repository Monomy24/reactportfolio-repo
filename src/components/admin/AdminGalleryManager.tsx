// src/components/admin/AdminGalleryManager.tsx

import { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useImageUpload } from '../../hooks/useImageUpload'; // 🚀 LIGHTWEIGHT CLOUD PIPELINE INTEGRATION

export function AdminGalleryManager() {
  /* ==========================================================================
     1. GLOBAL RUNTIME & STATE CONTROLLER INITIALIZATIONS
     ========================================================================== */
  const { draft, updateDraft } = usePortfolioStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Connect our professional image sync adapter engine
  const { uploadImage, isUploading } = useImageUpload();
  // Tracks exactly which array card index is processing an active media cloud write stream
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);

  if (!draft) return null;

  // Extract all unique active category tokens dynamically from your sandbox array configurations
  const activeCategories = Array.from(
    new Set(draft.gallery.map(item => item.category).filter(Boolean))
  );

  /* ==========================================================================
     2. DYNAMIC WORKSPACE CATEGORY INJECTION HANDLERS
     ========================================================================== */
  return (
    <div className="space-y-6 pt-4 animate-fadeIn">
      
      {/* PANEL 2.1: CATEGORY MANAGEMENT CONTROLS WORKBENCH CONTAINER */}
      <div className="bg-zinc-950/40 p-5 border border-zinc-800/80 rounded-2xl space-y-4">
        <div>
          <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Category Management Workbench</h3>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Inject fresh classifications or purge existing categories entirely.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input 
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. 3D Renders, Branding, UI"
            className="flex-1 bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono text-zinc-100 outline-none focus:border-emerald-500/30"
          />
          <button
            type="button"
            onClick={() => {
              const cleaned = newCategoryName.trim();
              if (!cleaned) return;
              
              // Push an abstract baseline template structure to seed the new tracking classification token
              updateDraft(d => {
                d.gallery.push({
                  id: crypto.randomUUID(),
                  title: `New ${cleaned} Asset`,
                  category: cleaned,
                  imageUrl: ""
                });
              });
              setNewCategoryName('');
              alert(`Category grouping grid "${cleaned}" initialized.`);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition-all cursor-pointer"
          >
            + Create Category
          </button>
        </div>

        {/* PANEL 2.2: LIVE CATEGORY PURGE REGISTRY STRIP */}
        {activeCategories.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Active Registries (Click to Purge Category Assets)</span>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`Category Purge: Are you sure you want to delete ALL gallery assets assigned to "${cat}"?`)) return;
                    updateDraft(d => {
                      d.gallery = d.gallery.filter(item => item.category !== cat);
                    });
                    alert(`Purge complete. Grouping "${cat}" cleared from data arrays.`);
                  }}
                  className="px-2.5 py-1 bg-red-950/20 hover:bg-red-950/60 border border-red-900/30 hover:border-red-500/40 text-red-400 text-[10px] font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1.5 group"
                  title={`Purge all items under ${cat}`}
                >
                  <span>{cat}</span>
                  <span className="text-red-500/60 group-hover:text-red-400 text-xs font-sans">✕</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* PANEL 2.3: VISUAL SANDBOX ASSET GRID STAGING INDEX CARDS LAYOUT */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-zinc-950/20 p-4 border border-zinc-800/60 rounded-xl">
          <div>
            <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Visual Assets Staging Index</h4>
            <p className="text-[11px] text-zinc-500 font-light">Map layout cards to active database category layers.</p>
          </div>
          <button 
            type="button"
            onClick={() => updateDraft(d => {
              // Appends clean sandbox node structure using cryptographic UUID signatures natively
              d.gallery.push({
                id: crypto.randomUUID(),
                title: "Untitled Layout Asset",
                category: activeCategories[0] || "General Sandbox",
                imageUrl: ""
              });
            })}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-lg border border-zinc-700 transition-colors cursor-pointer"
          >
            + Add Asset Card
          </button>
        </div>

        {/* DATA SCROLL CONTAINER CARD LISTING GRID */}
        <div className="grid sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {draft.gallery.map((item, index) => {
            // Evaluates local loading indicators for this distinct array card position
            const isThisCardUploading = isUploading && activeUploadIndex === index;

            return (
              <div key={item.id} className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex gap-4 items-start relative group">
                <button
                  type="button"
                  onClick={() => updateDraft(d => { d.gallery.splice(index, 1); })}
                  className="absolute top-3 right-3 text-zinc-600 hover:text-red-400 text-[10px] font-mono transition-colors cursor-pointer"
                >
                  Remove
                </button>

                {/* VISUAL IMAGE AVATAR CONTAINER MEDIA PREVIEW WINDOW MODULE */}
                <div className="w-20 h-20 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center relative">
                  {isThisCardUploading ? (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-1 text-center">
                      <span className="text-[8px] text-emerald-400 font-mono animate-pulse uppercase font-semibold">Uploading...</span>
                    </div>
                  ) : item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-mono text-center px-1">No Media Loaded</span>
                  )}
                </div>

                {/* INTERACTIVE TEXT AND CLOUD INGESTION FORM MATRIX */}
                <div className="flex-1 space-y-2.5">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-mono text-zinc-500">Asset Title / Caption Data</label>
                    <input 
                      type="text" 
                      value={item.title} 
                      onChange={(e) => updateDraft(d => { d.gallery[index].title = e.target.value; })}
                      className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-xs outline-none text-zinc-200 focus:border-emerald-500/20" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-mono text-zinc-500">Align Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => updateDraft(d => { d.gallery[index].category = e.target.value; })}
                        className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-xs outline-none text-zinc-300 focus:border-emerald-500/20"
                      >
                        {activeCategories.length === 0 && <option value="General Sandbox">General Sandbox</option>}
                        {activeCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* MODIFIED: INTERACTIVE FILE INPUT PIPELINE CONNECTED TO VERCEL BLOB */}
                    <div className="space-y-0.5 flex flex-col justify-end">
                      <label className={`cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono py-1.5 rounded-lg text-center transition-colors ${isThisCardUploading ? 'opacity-40 pointer-events-none' : ''}`}>
                        {isThisCardUploading ? 'Processing...' : 'Upload Frame'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={isThisCardUploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            try {
                              // Isolate active index pointer to prevent global loader blinking animations
                              setActiveUploadIndex(index);

                              // Execute higher resolution transformations for professional visual showcase components (1200px width, 80% WebP quality bounds)
                              const responseUrl = await uploadImage(file, 1200, 0.8);
                              
                              if (responseUrl) {
                                // Assign returned public storage CDN url path directly into target layout reference array parameters
                                updateDraft(d => {
                                  d.gallery[index].imageUrl = responseUrl;
                                });
                              }
                            } catch (err) {
                              console.error("Gallery media stream exception context:", err);
                            } finally {
                              // Reset active positioning threads safely
                              setActiveUploadIndex(null);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
