import React, { useState } from 'react';
import { X, Plus, ArrowRight, Circle, Menu } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import RockiiBuilder from './RockiiBuilder.jsx';
import { IMAGES, PRODUCTS, WORKSHOPS, NAV_LINKS } from './config/defaults.js';

// --- UI COMPONENTS ---

const NoiseOverlay = () => (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[9999] opacity-[0.06] mix-blend-overlay">
        <svg width="100%" height="100%">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    </div>
);

const GridLines = () => (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex justify-between px-4 md:px-12">
        <div className="h-full w-px bg-[#2B2B2B] opacity-[0.03]"></div>
        <div className="hidden md:block h-full w-px bg-[#2B2B2B] opacity-[0.03]"></div>
        <div className="hidden md:block h-full w-px bg-[#2B2B2B] opacity-[0.03]"></div>
        <div className="h-full w-px bg-[#2B2B2B] opacity-[0.03]"></div>
    </div>
);

const SectionHeader = ({ title, subtitle, count }) => (
    <div className="flex items-end justify-between border-b border-[#2B2B2B] pb-4 mb-8 md:mb-16 pt-8">
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2B2B2B]/60">{subtitle}</span>
            <h2 className="font-serif text-4xl md:text-6xl text-[#2B2B2B] leading-[0.9]">{title}</h2>
        </div>
        {count && <span className="font-mono text-xs border border-[#2B2B2B] px-2 py-1 rounded-full">{count}</span>}
    </div>
);

// --- MAIN PAGE ---

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeSection = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
    if (activeSection === 'builder') changeSection('home');
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] text-[#2B2B2B] selection:bg-[#2B2B2B] selection:text-[#F2F0E9] font-sans relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sono:wght@200..800&family=Xanh+Mono:ital@0;1&display=swap');
        
        .font-serif { font-family: 'Xanh Mono', monospace; }
        .font-mono { font-family: 'Sono', monospace; }
        .font-sans { font-family: 'Sono', sans-serif; }
        
        /* Safari/Mac font smoothing */
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2B2B2B; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <NoiseOverlay />
      
      {activeSection !== 'builder' && <GridLines />}

      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full z-40 border-b border-[#2B2B2B] bg-[#F2F0E9]/90 backdrop-blur-md relative">
        <div className="relative h-14 md:h-16 w-full">
            {/* Left Container: Nav Links */}
            <div className="absolute top-0 left-0 h-full flex items-center pl-4 md:pl-0">
                {/* Use a container with border-r to simulate "holding" the left side */}
                <div className="h-full border-r border-[#2B2B2B] flex items-center px-4 md:px-8">
                    <div className="hidden md:flex gap-8">
                        {NAV_LINKS.map((item) => (
                            <button 
                                key={item.key}
                                onClick={() => changeSection(item.target)}
                                className={`font-mono text-[11px] uppercase tracking-widest hover:underline decoration-1 underline-offset-4 ${activeSection === item.target ? 'underline' : ''}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        className="md:hidden flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest hover:underline decoration-1 underline-offset-4"
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <Menu size={16} />
                        Menu
                    </button>
                </div>
            </div>

            {/* Center Container: Absolute Centered Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button 
                    className="pointer-events-auto hover:opacity-50 transition-opacity duration-300"
                    onClick={() => changeSection('home')}
                >
                    <img 
                        src={IMAGES.logo} 
                        alt="Rockii Studios" 
                        className="h-12 md:h-12 w-auto object-contain brightness-0" 
                    />
                </button>
            </div>

            {/* Right Container: Cart */}
            <div className="absolute top-0 right-0 h-full flex items-center pr-6 md:pr-0">
                {/* Use a container with border-l to simulate "holding" the right side */}
                <div className="h-full border-l border-[#2B2B2B] flex items-center px-8">
                    <button 
                        onClick={() => {
                            setIsCartOpen(true);
                            setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 hover:bg-[#2B2B2B] hover:text-[#F2F0E9] transition-colors h-full px-4 -mx-4"
                    >
                        <span className="font-mono text-[11px] uppercase tracking-widest hidden md:inline">Cart</span>
                        <span className="font-mono text-[11px] border border-current rounded-full w-6 h-6 flex items-center justify-center">
                            {cart.length}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-b border-[#2B2B2B]"
            >
              <div className="bg-[#F2F0E9] divide-y divide-[#2B2B2B]">
                {NAV_LINKS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => changeSection(item.target)}
                    className={`w-full text-left px-6 py-4 font-mono text-[11px] uppercase tracking-widest flex items-center justify-between hover:bg-[#EBEAE4] transition-colors ${activeSection === item.target ? 'bg-[#EBEAE4]' : ''}`}
                  >
                    {item.label}
                    {activeSection === item.target && <Circle size={10} fill="#2B2B2B" strokeWidth={0} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="pt-24 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto min-h-screen relative z-10">
        
        {/* --- CATALOGUE (HOME) --- */}
        {activeSection === 'home' && (
            <div className="animate-in fade-in duration-700">
                <SectionHeader title="Object Archive" subtitle="Collection 03" count={PRODUCTS.length} />

                {/* Layout Toggle (Desktop only) */}
                <div className="hidden md:flex justify-end mb-4 gap-2">
                    <button onClick={() => setViewMode('grid')} className={`p-2 border border-[#2B2B2B] ${viewMode === 'grid' ? 'bg-[#2B2B2B] text-[#F2F0E9]' : ''}`}><div className="w-3 h-3 grid grid-cols-2 gap-0.5"><div className="bg-current"></div><div className="bg-current"></div><div className="bg-current"></div><div className="bg-current"></div></div></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 border border-[#2B2B2B] ${viewMode === 'list' ? 'bg-[#2B2B2B] text-[#F2F0E9]' : ''}`}><div className="w-3 h-3 flex flex-col gap-0.5"><div className="bg-current h-px w-full"></div><div className="bg-current h-px w-full"></div><div className="bg-current h-px w-full"></div></div></button>
                </div>

                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#2B2B2B] bg-[#F2F0E9]" : "flex flex-col border-t border-[#2B2B2B]"}>
                    {PRODUCTS.map((product) => (
                        <div 
                            key={product.id} 
                            onClick={() => product.isCustomizable ? changeSection('builder') : addToCart(product)}
                            className={`
                                bg-[#F2F0E9] group relative overflow-hidden cursor-pointer
                                ${viewMode === 'grid' ? 'aspect-[4/5] flex flex-col justify-between p-6 border-b border-r border-[#2B2B2B] transition-all duration-200 hover:bg-white' : 'flex md:grid md:grid-cols-12 items-center p-6 border-b border-[#2B2B2B] gap-6 hover:bg-white transition-colors'}
                            `}
                        >
                             {/* List View Columns */}
                             {viewMode === 'list' && (
                                 <>
                                    <div className="hidden md:block col-span-1 font-mono text-[10px] text-[#2B2B2B]/50">{product.ref}</div>
                                    <div className="col-span-3 md:col-span-1 w-16 h-16 bg-[#EBEAE4] mix-blend-multiply"><img src={product.image} alt="" className="w-full h-full object-contain p-2"/></div>
                                    <div className="col-span-6 md:col-span-4">
                                        <h3 className="font-serif text-xl italic text-[#567fff] title-glow">{product.name}</h3>
                                        <p className="font-mono text-[10px] uppercase mt-1 text-[#2B2B2B]/60">{product.type}</p>
                                    </div>
                                    <div className="col-span-3 text-right font-mono text-sm">${product.price}</div>
                                    <div className="col-span-3 flex justify-end">
                                        <button 
                                            // Action is handled by container click, but we keep button for semantics/visuals
                                            className="px-6 py-3 border border-[#2B2B2B] font-mono text-[10px] uppercase hover:bg-[#2B2B2B] hover:text-[#F2F0E9]"
                                        >
                                            {product.isCustomizable ? 'Configure' : 'Add'}
                                        </button>
                                    </div>
                                 </>
                             )}

                             {/* Grid View Content */}
                             {viewMode === 'grid' && (
                                 <>
                                    <div className="flex justify-between items-start relative z-10 h-6">
                                        <span className="font-mono text-sm">${product.price}</span>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center p-12">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: product.color }}></div>
                                        )}
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="font-serif text-3xl italic mb-1 text-[#567fff] title-glow">{product.name}</h3>
                                        <div className="flex justify-between items-end">
                                            <p className="font-mono text-[10px] uppercase text-[#2B2B2B]/60 max-w-[150px]">{product.type}</p>
                                            <button 
                                                className="w-8 h-8 flex items-center justify-center border border-[#2B2B2B] rounded-full hover:bg-[#2B2B2B] hover:text-[#F2F0E9] transition-colors bg-[#F2F0E9]"
                                            >
                                                {product.isCustomizable ? <ArrowRight size={14} /> : <Plus size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                 </>
                             )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* ... rest of sections ... */}
        {/* --- BUILDER --- */}
        {activeSection === 'builder' && (
            <div className="fixed inset-0 z-50 bg-[#F2F0E9]">
                <RockiiBuilder
                    onClose={() => changeSection('home')}
                    onAddToCart={(payload) => {
                        // Convert builder payload to cart product format
                        const customProduct = {
                            ...PRODUCTS[1],
                            name: "Custom Composition",
                            desc: payload.description,
                            price: payload.price
                        };
                        addToCart(customProduct);
                    }}
                />
            </div>
        )}

        {/* --- JOURNAL / ABOUT --- */}
        {activeSection === 'journal' && (
            <div className="max-w-7xl mx-auto pt-12 animate-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                    <div className="order-2 lg:order-1">
                        <h1 className="font-serif text-6xl md:text-8xl italic leading-[0.8] mb-12">
                            Imperfect <br/><span className="ml-24 font-sans not-italic text-lg tracking-normal text-[#2B2B2B]/60 block mt-4 max-w-xs font-light">We study the forms found in nature, rejecting the machine-polished standard.</span>
                        </h1>
                        <div className="space-y-8 font-mono text-xs leading-loose max-w-md text-[#2B2B2B]/80">
                            <p className="uppercase tracking-widest border-l-2 border-[#2B2B2B] pl-4">
                                Rockii Studios is a project by Raquel Navarro, working from her greenhouse studio in Los Angeles, CA.
                            </p>
                            <p>
                                Each piece begins with a quiet attention to form, a study of the curves, textures, and irregularities found in nature. Raquel's work centers on handcrafted, one-of-a-kind jewelry that refuses to conform to mass-produced perfection.
                            </p>
                            <p>
                                Using 925 silver clay, she captures fingerprints, dust, and the natural wobble of the hand. Each piece is fired in a kiln at 1600°F, transforming soft clay into solid silver. This process preserves every mark, every imperfection—a record of making.
                            </p>
                            <p>
                                Her pieces feature an eclectic array of materials: naturally occurring stones, fossils, and minerals alongside carefully selected human-made beads and pendants. Each combination is intentional, creating jewelry that carries both ancient memory and contemporary craft.
                            </p>
                            <div className="mt-8 aspect-video bg-[#EBEAE4] overflow-hidden border border-[#2B2B2B]/20 grayscale hover:grayscale-0 transition-all duration-700">
                                <img src={IMAGES.people_working} className="w-full h-full object-cover" alt="Workshop Process" />
                            </div>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2">
                        <div className="aspect-[3/4] bg-[#E5E7E6] relative overflow-hidden border border-[#2B2B2B] group">
                            <img src={IMAGES.workshop_interior} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio Interior" />
                            <div className="absolute bottom-4 right-4 font-mono text-[10px] bg-[#F2F0E9] px-2 py-1 border border-[#2B2B2B]">
                                FIG. 01 — STUDIO
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- WORKSHOPS --- */}
        {activeSection === 'workshops' && (
            <div className="max-w-4xl mx-auto pt-12 animate-in fade-in duration-700">
                <div className="mb-12 aspect-[2/1] w-full border border-[#2B2B2B] overflow-hidden relative group">
                    <img src={IMAGES.workshop_exterior} alt="Workshop Exterior" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/50 to-transparent flex items-end p-8">
                        <h2 className="text-[#F2F0E9] font-serif text-5xl italic">The Greenhouse</h2>
                    </div>
                </div>

                <SectionHeader title="Session Calendar" subtitle="Silver Lake, CA" />
                
                <div className="border-t border-[#2B2B2B]">
                    {WORKSHOPS.map((ws, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-12 py-8 border-b border-[#2B2B2B] items-baseline gap-4 group hover:bg-[#EBEAE4] transition-colors px-4 -mx-4">
                            <div className="col-span-3 font-mono text-sm">{ws.date}</div>
                            <div className="col-span-3 font-serif text-xl italic">{ws.day}</div>
                            <div className="col-span-3 font-mono text-xs text-[#2B2B2B]/60">{ws.time}</div>
                            <div className="col-span-3 text-right">
                                {ws.seats > 0 ? (
                                    <button onClick={() => addToCart(PRODUCTS[4])} className="font-mono text-[10px] uppercase border border-[#2B2B2B] px-4 py-2 hover:bg-[#2B2B2B] hover:text-[#F2F0E9]">
                                        Book Seat — $100
                                    </button>
                                ) : (
                                    <span className="font-mono text-[10px] uppercase line-through opacity-50">Sold Out</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>

      {/* --- CART DRAWER --- */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#F2F0E9] z-[100] transform transition-transform duration-500 border-l border-[#2B2B2B] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
          <div className="h-14 md:h-16 border-b border-[#2B2B2B] flex justify-between items-center px-8">
              <span className="font-mono text-xs uppercase tracking-widest">Cart ({cart.length})</span>
              <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                  <X size={20} strokeWidth={1} />
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
             {cart.length === 0 && (
                 <div className="h-full flex items-center justify-center text-[#2B2B2B]/30 font-serif italic text-xl">
                     Your bag is empty.
                 </div>
             )}
             {cart.map((item, i) => (
                 <div key={i} className="flex gap-6 pb-6 border-b border-[#2B2B2B]/10">
                     <div className="w-20 h-20 bg-[#EBEAE4] border border-[#2B2B2B]/10 flex items-center justify-center shrink-0">
                         {item.image ? (
                            <img src={item.image} className="w-12 h-12 object-contain mix-blend-multiply" alt="" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-[10px] uppercase">IMG</div>
                         )}
                     </div>
                     <div className="flex-1">
                         <div className="flex justify-between items-start mb-2">
                             <h4 className="font-serif text-lg italic">{item.name}</h4>
                             <span className="font-mono text-xs">${item.price}</span>
                         </div>
                         <p className="font-mono text-[10px] uppercase text-[#2B2B2B]/50 mb-4 max-w-[200px] leading-relaxed">{item.desc}</p>
                         <button onClick={() => removeFromCart(i)} className="text-[10px] font-mono uppercase underline hover:text-red-600">Remove</button>
                     </div>
                 </div>
             ))}
          </div>

          <div className="p-8 border-t border-[#2B2B2B] bg-[#EBEAE4]">
              <div className="flex justify-between items-end mb-6">
                  <span className="font-mono text-xs uppercase">Subtotal</span>
                  <span className="font-serif text-3xl italic">${cart.reduce((a,c) => a + c.price, 0).toFixed(2)}</span>
              </div>
              <button className="w-full bg-[#2B2B2B] text-[#F2F0E9] py-4 font-mono text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#2B2B2B] hover:border border-[#2B2B2B] transition-all">
                  Checkout
              </button>
          </div>
      </div>
      
      {/* Overlay for Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-[#2B2B2B]/20 backdrop-blur-sm z-[90]" onClick={() => setIsCartOpen(false)} />
      )}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-transparent z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}
