import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, Circle, MoveLeft, Menu } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

// --- ASSETS & DATA ---

const IMAGES = {
    logo: "https://www.dropbox.com/scl/fi/x07b12jdqjz5apg8n1r73/rs_logo.png?rlkey=hkw7g00okr293mbfo75r9fiqw&st=wr9q3x0b&raw=1",
    workshop_interior: "https://www.dropbox.com/scl/fi/nppbq38u217ph2qz1wogd/pretty-photo-workshop-interior.jpg?rlkey=0ybqcjrsj3iss5cpb34f55ivh&st=ajyzo1py&raw=1",
    workshop_exterior: "https://www.dropbox.com/scl/fi/b4ef45uf82ocbkcd8l6cr/pretty-photo-workshop-exterior.jpg?rlkey=sqbbh4e5kkaqcbogufu6g3gva&st=hnulpojq&raw=1",
    people_working: "https://www.dropbox.com/scl/fi/jr7wpjkuzrgq90bdmww9j/people-in-workshop.jpg?rlkey=rfxd0v2y0jlvmzuw0gsh7kt7u&st=qf1p509l&raw=1"
};

const BEAD_IMAGES = {
    gold_blue_star: "https://dl.dropboxusercontent.com/scl/fi/xveixnp31uat0lhgog1qf/rs_Gold-Beads-Blue-Gem-Star-Background-Removed.png?rlkey=wfsytz3qh1v5lqnw2dwxyfkjd&raw=1",
    gold_green_rock: "https://dl.dropboxusercontent.com/scl/fi/01xzaipnq4nc38l5che7r/rs_Gold-Beads-Green-Gem-Rock-Background-Removed.png?rlkey=br54jstjfkxka54hctncbwr5l&raw=1",
    gold_spiral: "https://dl.dropboxusercontent.com/scl/fi/h76yd6vns76uqrcc10dus/rs_Gold-Beads-Spiral-Background-Removed.png?rlkey=fmlwrzmo184d9u5vht8fxk39g&raw=1",
    gold_white_rock: "https://dl.dropboxusercontent.com/scl/fi/tvtlzdlv0tgcvu81hs4vk/rs_Gold-Beads-White-Gem-Rock-Background-Removed.png?rlkey=l35ypd6y7skorncxxd0lfbidu&raw=1",
    gold_white_star: "https://dl.dropboxusercontent.com/scl/fi/8vwd7bt4m2igf2wupx2jo/rs_Gold-Beads-White-Gem-Star-Background-Removed.png?rlkey=aktkr7q6xelailnfljlqtl9h1&raw=1",
    
    silver_blue_rock: "https://dl.dropboxusercontent.com/scl/fi/ih02h59i0int84fhc7z8v/rs_Silver-Beads-Blue-Gem-Rock-Background-Removed.png?rlkey=24kpe3254cznu7sr363ln4m6s&raw=1",
    silver_blue_star: "https://dl.dropboxusercontent.com/scl/fi/q1acb12b8stn9dfyqdysf/rs_Silver-Beads-Blue-Gem-Star-Background-Removed.png?rlkey=bb9mxb1pu3mxlhs1mdthyi2aw&raw=1",
    silver_citrine_rock: "https://dl.dropboxusercontent.com/scl/fi/7zksfja0jjqnctxpeusnw/rs_Silver-Beads-Citrine-Gem-Rock-Background-Removed.png?rlkey=qtne69rydpes4silfw2qx7qke&raw=1",
    silver_citrine_star: "https://dl.dropboxusercontent.com/scl/fi/0yzvqhiemajdth5egvffw/rs_Silver-Beads-Citrine-Gem-Star-Background-Removed.png?rlkey=4t9lysuw2mdqp7s6w4kp4dokr&raw=1",
    silver_green_star: "https://dl.dropboxusercontent.com/scl/fi/inqho7zeeny1ukl17oy7v/rs_Silver-Beads-Green-Gem-Star-Background-Removed.png?rlkey=1wv3ksfvzufzqmpg6o3gzt0kb&raw=1",
    silver_spiral: "https://dl.dropboxusercontent.com/scl/fi/jsj3t803f2xts1swwqwfm/rs_Silver-Beads-Spiral-Background-Removed.png?rlkey=vj8j6ll1btx4ifbsmau2v889s&raw=1"
};

const BEAD_LIBRARY = {
    silver: [
        { id: 'silver-blue-rock', name: 'Blue Gem Rock', code: 'S-BGR-01', img: BEAD_IMAGES.silver_blue_rock },
        { id: 'silver-blue-star', name: 'Blue Gem Star', code: 'S-BGS-02', img: BEAD_IMAGES.silver_blue_star },
        { id: 'silver-citrine-rock', name: 'Citrine Rock', code: 'S-CTR-03', img: BEAD_IMAGES.silver_citrine_rock },
        { id: 'silver-citrine-star', name: 'Citrine Star', code: 'S-CTS-04', img: BEAD_IMAGES.silver_citrine_star },
        { id: 'silver-green-star', name: 'Green Star', code: 'S-GRS-05', img: BEAD_IMAGES.silver_green_star },
        { id: 'silver-spiral', name: 'Spiral', code: 'S-SPR-06', img: BEAD_IMAGES.silver_spiral }, 
    ],
    gold: [
        { id: 'gold-blue-star', name: 'Blue Gem Star', code: 'G-BGS-01', img: BEAD_IMAGES.gold_blue_star },
        { id: 'gold-green-rock', name: 'Green Gem Rock', code: 'G-GGR-02', img: BEAD_IMAGES.gold_green_rock },
        { id: 'gold-spiral', name: 'Spiral', code: 'G-SPR-03', img: BEAD_IMAGES.gold_spiral },
        { id: 'gold-white-rock', name: 'White Gem Rock', code: 'G-WGR-04', img: BEAD_IMAGES.gold_white_rock },
        { id: 'gold-white-star', name: 'White Gem Star', code: 'G-WGS-05', img: BEAD_IMAGES.gold_white_star }
    ]
};

// Custom Pricing Logic
const CUSTOM_PRICING = {
    1: 65,
    2: 105,
    3: 145,
    4: 185,
    5: 225,
    6: 245,
    7: 285,
    8: 325
};

const PRODUCTS = [
  {
    id: '001',
    ref: 'PDT-SLC-X1',
    name: "Silver Clay Cross",
    type: "Pendant",
    material: "925 Sterling Silver Clay",
    price: 177.00,
    desc: "One-of-a-kind handmade piece featuring cubic zirconia stones. 18-inch chain with extender.",
    color: "#E0E0E0",
    image: "https://www.dropbox.com/scl/fi/if0noi798h252bl8z5ars/rs_Silver-Clay-Cross.png?rlkey=b2sk6kt0i6nmz081721z1s6sk&st=g0c4mg5l&raw=1"
  },
  {
    id: '002',
    ref: 'CST-RCK-B2',
    name: "Rockii Beads",
    type: "Custom System",
    material: "Mixed Metals & Glass",
    price: 105.00, // Base price display, actual calculation happens in builder
    desc: "Custom piece with 1-8 beads on 925 silver or gold-filled chain. 18-inch standard.",
    color: "#D4AF37",
    image: "https://www.dropbox.com/scl/fi/dz7uryqec1j5nxeh8pnrq/rs_Rockii-Beads.png?rlkey=y8i4suxukemmlal7ypxcrs61q&st=on9xryoo&raw=1",
    isCustomizable: true
  },
  {
    id: '003',
    ref: 'PDT-SLC-F3',
    name: "Silver Clay Flower",
    type: "Pendant",
    material: "925 Silver Clay",
    price: 150.00,
    desc: "Handmade in Los Angeles. Water resistant. 15-inch chain with 1-inch extender.",
    color: "#F5F5F5",
    image: "https://www.dropbox.com/scl/fi/n2g352no3ckth33ryosxo/rs_Silver-Clay-Flower.png?rlkey=vy8johemz5chqzwfrd22kjkv6&st=05nwxrnz&raw=1"
  },
  {
    id: '004',
    ref: 'DGT-GFT-C4',
    name: "Gift Card",
    type: "Digital",
    material: "Digital Asset",
    price: 100.00,
    desc: "Delivered by email with instructions to redeem. No additional processing fees.",
    color: "#2A2A2A",
    image: IMAGES.logo
  },
  {
    id: '005',
    ref: 'EXP-WKS-T5',
    name: "Workshop Ticket",
    type: "Experience",
    material: "Live Event",
    price: 100.00,
    desc: "Join us at The Greenhouse Studio in Silver Lake. Create your own unique piece.",
    color: "#8FBC8F"
  }
];

const WORKSHOPS = [
  { date: "NOV 22", day: "Saturday", time: "12:00 — 14:00", seats: 4 },
  { date: "NOV 29", day: "Saturday", time: "12:00 — 14:00", seats: 2 },
  { date: "NOV 30", day: "Sunday", time: "12:00 — 14:00", seats: 0 } // Sold out
];

const NAV_LINKS = [
  { key: 'catalogue', label: 'Catalogue', target: 'home' },
  { key: 'workshops', label: 'Workshops', target: 'workshops' },
  { key: 'journal', label: 'Journal', target: 'journal' },
];

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

// --- SPECIALIZED BEAD ANIMATION COMPONENT ---

const BeadNode = ({ targetT, curveWidth, startY, data, isActive, onClick, onClear }) => {
    const t = useMotionValue(0); 

    useEffect(() => {
        const controls = animate(t, targetT, { 
            type: "spring", 
            stiffness: 40,
            damping: 15,
            mass: 1.2
        });
        return controls.stop;
    }, [targetT]);

    const getPointOnCurve = (v) => {
        const P0 = { x: 0, y: startY };
        const P1 = { x: curveWidth / 2, y: 320 };
        const P2 = { x: curveWidth, y: startY };
        const x = Math.pow(1-v, 2) * P0.x + 2 * (1-v) * v * P1.x + Math.pow(v, 2) * P2.x;
        const y = Math.pow(1-v, 2) * P0.y + 2 * (1-v) * v * P1.y + Math.pow(v, 2) * P2.y;
        return { x, y };
    };

    const x = useTransform(t, v => getPointOnCurve(v).x);
    const y = useTransform(t, v => getPointOnCurve(v).y);

    return (
        <motion.g 
            style={{ x, y }} 
            className="cursor-pointer group"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
            <image
                href={data.img}
                x="-35"
                y="-35"
                width="70"
                height="70"
                style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.15))' }}
            />
            {isActive && (
                <g onClick={(e) => { e.stopPropagation(); onClear(e); }}>
                    <circle cx="20" cy="-20" r="10" fill="#2B2B2B" />
                    <Trash2 size={10} strokeWidth={2} className="text-white" x="15" y="-25" />
                </g>
            )}
        </motion.g>
    );
};

// --- BUILDER COMPONENT (FULL SCREEN RESTRUCTURE) ---

const CustomBuilder = ({ onClose, onAddToCart }) => {
    const [beadCount, setBeadCount] = useState(5);
    const [selectedMetal, setSelectedMetal] = useState('silver');
    const [slots, setSlots] = useState(Array(5).fill(null));
    const [activeSlotIndex, setActiveSlotIndex] = useState(null);
    
    // New state for chain customization
    const [chainMetal, setChainMetal] = useState('silver'); // 'silver' or 'gold'
    const [chainLengthType, setChainLengthType] = useState('standard'); // 'standard' or 'custom'
    const [customLength, setCustomLength] = useState('20');

    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Calculate dynamic price based on bead count
    const currentPrice = CUSTOM_PRICING[beadCount] || 105;

    useEffect(() => {
        setSlots(prev => {
            if (prev.length === beadCount) return prev;
            return beadCount > prev.length 
                ? [...prev, ...Array(beadCount - prev.length).fill(null)]
                : prev.slice(0, beadCount);
        });
    }, [beadCount]);

    const handleAddBead = (beadTemplate) => {
        const newBead = { ...beadTemplate, uniqueId: generateId() };
        let targetIndex = activeSlotIndex;

        if (targetIndex === null) {
            targetIndex = slots.findIndex(s => s === null);
            if (targetIndex === -1) targetIndex = slots.length - 1;
        }

        const newSlots = [...slots];
        newSlots[targetIndex] = newBead;
        setSlots(newSlots);

        const nextEmpty = newSlots.findIndex((s, i) => i > targetIndex && s === null);
        setActiveSlotIndex(nextEmpty !== -1 ? nextEmpty : null);
    };

    const handleClearSlot = (index) => {
        const newSlots = [...slots];
        newSlots[index] = null;
        setSlots(newSlots);
        setActiveSlotIndex(index);
    };

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 350;
    const CHAIN_START_Y = 60;
    
    const getPointOnCurveStatic = (t) => {
        const P0 = { x: 0, y: CHAIN_START_Y };
        const P1 = { x: CANVAS_WIDTH / 2, y: 320 };
        const P2 = { x: CANVAS_WIDTH, y: CHAIN_START_Y };
        const x = Math.pow(1-t, 2) * P0.x + 2 * (1-t) * t * P1.x + Math.pow(t, 2) * P2.x;
        const y = Math.pow(1-t, 2) * P0.y + 2 * (1-t) * t * P1.y + Math.pow(t, 2) * P2.y;
        return { x, y };
    };

    const slotTs = useMemo(() => {
        const ts = [];
        const range = 0.6;
        const startT = 0.5 - (range/2);
        if (beadCount === 1) {
             ts.push(0.5);
        } else {
            const step = range / (beadCount - 1);
            for (let i = 0; i < beadCount; i++) {
                ts.push(startT + (i * step));
            }
        }
        return ts;
    }, [beadCount]);

    return (
        <div className="fixed inset-0 bg-[#F2F0E9] z-50 flex flex-col md:flex-row h-[100dvh]">
            {/* LEFT COLUMN: CANVAS + TRAY */}
            <div className="flex-1 flex flex-col relative h-full overflow-hidden">
                
                {/* Minimal Header / Toolbar Overlay */}
                <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start pointer-events-none">
                    <button onClick={onClose} className="pointer-events-auto group flex items-center gap-2 font-mono text-xs uppercase bg-[#F2F0E9]/80 backdrop-blur px-3 py-2 border border-[#2B2B2B]/10 rounded-full hover:bg-[#2B2B2B] hover:text-[#F2F0E9] transition-colors">
                        <MoveLeft size={14} /> Back
                    </button>
                    <div className="pointer-events-auto hidden md:block font-mono text-[10px] bg-[#F2F0E9]/80 backdrop-blur px-2 py-1 rounded border border-[#2B2B2B]/10 text-[#2B2B2B]/60">
                        BUILD_ID: {slots.length}N-{selectedMetal.substring(0,2).toUpperCase()}
                    </div>
                </div>

                {/* Canvas Area (Takes remaining height) */}
                <div className="flex-1 bg-[#EBEAE4] relative flex items-center justify-center overflow-hidden shadow-[inset_0_-20px_40px_-20px_rgba(0,0,0,0.1)]">
                    <div className="absolute inset-0 opacity-[0.05]" 
                         style={{ backgroundImage: 'linear-gradient(#2B2B2B 1px, transparent 1px), linear-gradient(90deg, #2B2B2B 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>
                    
                    {/* Ruler */}
                    <div className="absolute top-0 left-0 w-full h-6 flex justify-between px-4 border-b border-[#2B2B2B]/10">
                         {Array(20).fill(0).map((_, i) => <div key={i} className="w-px h-2 bg-[#2B2B2B]/20 mt-2"></div>)}
                    </div>

                    <svg viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="w-full max-w-3xl overflow-visible relative z-10">
                        <defs>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                <feOffset dx="2" dy="4" result="offsetblur" />
                                <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
                                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        
                        <path d={`M0,${CHAIN_START_Y} Q${CANVAS_WIDTH/2},320 ${CANVAS_WIDTH},${CHAIN_START_Y}`} fill="none" stroke={chainMetal === 'gold' ? '#C5A059' : '#A0A0A0'} strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
                        <path d={`M0,${CHAIN_START_Y} Q${CANVAS_WIDTH/2},320 ${CANVAS_WIDTH},${CHAIN_START_Y}`} fill="none" stroke={chainMetal === 'gold' ? '#D4AF37' : '#C0C0C0'} strokeWidth="1.5" />

                        <AnimatePresence>
                            {slotTs.map((t, i) => {
                                const slotData = slots[i]; 
                                const isActive = activeSlotIndex === i;
                                const pos = getPointOnCurveStatic(t);
                                return (
                                    <g key={i}>
                                        {!slotData && (
                                            <g onClick={() => setActiveSlotIndex(isActive ? null : i)} className="cursor-pointer group" transform={`translate(${pos.x}, ${pos.y})`}>
                                                <circle r="30" fill="transparent" />
                                                <circle r="4" fill="#F2F0E9" stroke="#2B2B2B" strokeWidth="1" className="transition-opacity duration-300 group-hover:opacity-100 opacity-50"/>
                                                {isActive && (
                                                    <g>
                                                        <circle r="16" fill="none" stroke="#2B2B2B" strokeWidth="1" strokeDasharray="2 2" className="animate-spin-slow" />
                                                        <text y="-25" textAnchor="middle" className="font-mono text-[8px] fill-[#2B2B2B] uppercase tracking-widest">Select</text>
                                                    </g>
                                                )}
                                            </g>
                                        )}
                                        {slotData && (
                                            <BeadNode key={slotData.uniqueId} targetT={t} curveWidth={CANVAS_WIDTH} startY={CHAIN_START_Y} data={slotData} isActive={isActive} onClick={() => setActiveSlotIndex(isActive ? null : i)} onClear={() => handleClearSlot(i)} />
                                        )}
                                    </g>
                                );
                            })}
                        </AnimatePresence>
                    </svg>
                    
                    {/* Floating Canvas Controls */}
                    <div className="absolute bottom-6 left-6 z-20">
                         <div className="flex gap-2 p-1 bg-[#F2F0E9] border border-[#2B2B2B]/10 rounded-full shadow-sm">
                             {['silver', 'gold'].map(metal => (
                                <button key={metal} onClick={() => setSelectedMetal(metal)} className={`px-4 py-1.5 font-mono text-[10px] uppercase rounded-full transition-all ${selectedMetal === metal ? 'bg-[#2B2B2B] text-[#F2F0E9]' : 'text-[#2B2B2B] hover:bg-[#E5E7E6]'}`}>
                                    {metal}
                                </button>
                             ))}
                        </div>
                    </div>
                    
                    <div className="absolute bottom-6 right-6 z-20">
                         <div className="flex items-center bg-[#F2F0E9] border border-[#2B2B2B]/10 rounded-full shadow-sm overflow-hidden">
                             <button onClick={() => setBeadCount(Math.max(1, beadCount - 1))} className="p-3 hover:bg-[#E5E7E6]"><Minus size={12} /></button>
                             <span className="w-8 text-center font-mono text-xs">{beadCount}</span>
                             <button onClick={() => setBeadCount(Math.min(8, beadCount + 1))} className="p-3 hover:bg-[#E5E7E6]"><Plus size={12} /></button>
                        </div>
                    </div>
                </div>

                {/* Bead Tray (Fixed at Bottom) */}
                <div className="bg-[#F2F0E9] border-t border-[#2B2B2B] z-30 h-auto">
                    <div className="overflow-x-auto p-4 md:p-6 hide-scrollbar">
                        <div className="flex gap-4 min-w-max mx-auto justify-center">
                            {BEAD_LIBRARY[selectedMetal].map(bead => (
                                <button 
                                    key={bead.id}
                                    onClick={() => handleAddBead(bead)}
                                    className="group flex flex-col gap-2 items-center p-2 w-20 md:w-24 cursor-pointer transition-transform hover:-translate-y-1"
                                >
                                    {/* Removed white bg circle, now floating */}
                                    <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center relative">
                                         <img src={bead.img} alt={bead.name} className="max-w-[90%] max-h-[90%] object-contain drop-shadow-sm" />
                                    </div>
                                    <span className="font-mono text-[9px] uppercase text-center text-[#2B2B2B]/60 group-hover:text-[#2B2B2B] leading-tight">{bead.name.split(' ')[0]}<br/>{bead.name.split(' ')[1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: SPECS SIDEBAR */}
            <div className="w-full md:w-80 lg:w-96 bg-[#F9F8F6] border-l border-[#2B2B2B] flex flex-col min-h-[340px] md:min-h-0 md:max-h-[90vh] shrink-0 shadow-xl md:shadow-none z-40 md:sticky md:top-0">
                <div className="p-6 md:p-8 border-b border-[#2B2B2B]/10 bg-[#F9F8F6]">
                    <h3 className="font-serif text-xl md:text-2xl italic mb-1">Manifest</h3>
                    <p className="font-mono text-[10px] text-[#2B2B2B]/60 uppercase tracking-wide">Configuration & Spec</p>
                </div>
                
                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    <div>
                        <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-[#2B2B2B]/40 mb-4 pb-2 border-b border-[#2B2B2B]/10">
                            <span>Item</span>
                            <span>Ref</span>
                        </div>
                        <ul className="space-y-2">
                            {slots.map((bead, i) => (
                                <li key={i} className="flex items-center justify-between py-2 border-b border-[#2B2B2B]/5 text-xs group">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-[#2B2B2B]/30">0{i + 1}</span>
                                        {bead ? (
                                            <span className="font-serif">{bead.name}</span>
                                        ) : (
                                            <span className="font-mono text-[#2B2B2B]/30 italic">-- Empty --</span>
                                        )}
                                    </div>
                                    {bead && (
                                        <button onClick={() => handleClearSlot(i)} className="text-[#2B2B2B]/40 hover:text-red-500 transition-colors">
                                            <X size={10} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* UPDATED: Interactive Chain Options */}
                    <div className="pt-6 border-t border-[#2B2B2B]/10 space-y-6">
                        
                        {/* Metal Selection */}
                        <div className="space-y-3">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#2B2B2B]/60">Chain Material</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => setChainMetal('silver')}
                                    className={`px-3 py-3 font-mono text-[10px] uppercase border text-center transition-all ${chainMetal === 'silver' ? 'bg-[#2B2B2B] text-[#F2F0E9] border-[#2B2B2B]' : 'border-[#2B2B2B]/20 hover:border-[#2B2B2B]'}`}
                                >
                                    925 Silver
                                </button>
                                <button 
                                    onClick={() => setChainMetal('gold')}
                                    className={`px-3 py-3 font-mono text-[10px] uppercase border text-center transition-all ${chainMetal === 'gold' ? 'bg-[#2B2B2B] text-[#F2F0E9] border-[#2B2B2B]' : 'border-[#2B2B2B]/20 hover:border-[#2B2B2B]'}`}
                                >
                                    Gold Filled
                                </button>
                            </div>
                        </div>

                        {/* Length Selection */}
                        <div className="space-y-3">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#2B2B2B]/60">Chain Length</span>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setChainLengthType('standard')}
                                    className={`px-3 py-3 font-mono text-[10px] uppercase border text-left transition-all flex justify-between items-center ${chainLengthType === 'standard' ? 'border-[#2B2B2B] bg-[#F2F0E9]' : 'border-[#2B2B2B]/20'}`}
                                >
                                    <span>Standard (18")</span>
                                    {chainLengthType === 'standard' && <div className="w-2 h-2 bg-[#2B2B2B] rounded-full"></div>}
                                </button>
                                <button 
                                    onClick={() => setChainLengthType('custom')}
                                    className={`px-3 py-3 font-mono text-[10px] uppercase border text-left transition-all flex justify-between items-center ${chainLengthType === 'custom' ? 'border-[#2B2B2B] bg-[#F2F0E9]' : 'border-[#2B2B2B]/20'}`}
                                >
                                    <span>Custom Length</span>
                                    {chainLengthType === 'custom' && <div className="w-2 h-2 bg-[#2B2B2B] rounded-full"></div>}
                                </button>
                                
                                {chainLengthType === 'custom' && (
                                    <div className="animate-in slide-in-from-top-2">
                                        <div className="flex items-center border-b border-[#2B2B2B] pb-1">
                                            <input 
                                                type="number" 
                                                value={customLength}
                                                onChange={(e) => setCustomLength(e.target.value)}
                                                className="w-full bg-transparent font-serif text-xl outline-none placeholder:text-[#2B2B2B]/20"
                                                placeholder="20"
                                            />
                                            <span className="font-mono text-xs text-[#2B2B2B]/50">INCHES</span>
                                        </div>
                                        <p className="font-mono text-[9px] text-[#2B2B2B]/40 mt-2">Enter desired length in inches.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Material Note */}
                        <div className="font-mono text-[9px] text-[#2B2B2B]/50 leading-relaxed border-t border-[#2B2B2B]/10 pt-4">
                            <p>Beads are 925 Sterling Silver base and 14k Gold plated. Water Resistant. Feel free to mix metals.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 md:p-8 bg-[#F2F0E9] border-t border-[#2B2B2B]/10">
                    <div className="flex justify-between items-baseline mb-4">
                         <span className="font-mono text-xs uppercase tracking-widest opacity-60">Est. Total</span>
                         <span className="font-serif text-2xl">${currentPrice.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={() => {
                            const lengthText = chainLengthType === 'standard' ? '18"' : `${customLength}"`;
                            const metalText = chainMetal === 'silver' ? '925 Sterling Silver' : 'Gold Filled';
                            const customProduct = {
                                ...PRODUCTS[1],
                                name: "Custom Composition",
                                desc: `${metalText} Chain (${lengthText}) | ${slots.filter(s => s).length} Beads`,
                                price: currentPrice
                            };
                            onAddToCart(customProduct);
                        }}
                        disabled={!slots.some(s => s)}
                        className="w-full py-4 bg-[#2B2B2B] text-[#F2F0E9] hover:bg-[#3E3E3E] transition-all font-mono text-xs uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Design
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
    if (activeSection === 'builder') setActiveSection('home');
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
                                onClick={() => setActiveSection(item.target)}
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
                    onClick={() => setActiveSection('home')}
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
                    onClick={() => setActiveSection(item.target)}
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
                            onClick={() => product.isCustomizable ? setActiveSection('builder') : addToCart(product)}
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
                                        <h3 className="font-serif text-xl italic text-[#567fff]">{product.name}</h3>
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
                                        <h3 className="font-serif text-3xl italic mb-1 text-[#567fff]">{product.name}</h3>
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
                <CustomBuilder onClose={() => setActiveSection('home')} onAddToCart={addToCart} />
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
                                Rockii Studios is a project by Raquel Navarro. Based in Los Angeles, CA.
                            </p>
                            <p>
                                Using 925 silver clay allows us to capture fingerprints, dust, and the natural wobble of the hand. Each piece is fired in a kiln at 1600°F, transforming soft clay into solid silver.
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
