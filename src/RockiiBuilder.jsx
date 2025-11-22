import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Plus, Minus, Trash2, MoveLeft } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { BEAD_LIBRARY as DEFAULT_BEAD_LIBRARY, CUSTOM_PRICING as DEFAULT_CUSTOM_PRICING } from './config/defaults';

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
    }, [targetT, t]);

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

/**
 * RockiiBuilder - Standalone customizable bead builder component
 *
 * @param {Object} props
 * @param {Object} props.beadLibrary - Library of available beads by metal type { silver: [...], gold: [...] }
 * @param {Object} props.customPricing - Pricing table by bead count { 1: 65, 2: 105, ... }
 * @param {string|number} props.productId - Shopify product ID (for future integration)
 * @param {Array} props.productVariants - Shopify product variants (for future integration)
 * @param {Function} props.onAddToCart - Callback when user confirms design
 * @param {Function} props.onClose - Callback when user closes builder
 */
export const RockiiBuilder = ({
    beadLibrary = DEFAULT_BEAD_LIBRARY,
    customPricing = DEFAULT_CUSTOM_PRICING,
    productId,
    productVariants = [],
    onAddToCart,
    onClose
}) => {
    const [beadCount, setBeadCount] = useState(5);
    const [selectedMetal, setSelectedMetal] = useState('silver');
    const [slots, setSlots] = useState(Array(5).fill(null));
    const [activeSlotIndex, setActiveSlotIndex] = useState(null);

    // New state for chain customization
    const [chainMetal, setChainMetal] = useState('silver'); // 'silver' or 'gold'
    const [chainLengthType, setChainLengthType] = useState('standard'); // 'standard' or 'custom'
    const [customLength, setCustomLength] = useState('20');

    const idCounter = useRef(0);
    const generateId = () => {
        idCounter.current += 1;
        return `bead-${idCounter.current}`;
    };

    // Calculate dynamic price based on bead count
    const currentPrice = customPricing[beadCount] || 105;

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

    const handleConfirmDesign = () => {
        const lengthText = chainLengthType === 'standard' ? '18"' : `${customLength}"`;
        const metalText = chainMetal === 'silver' ? '925 Sterling Silver' : 'Gold Filled';

        // Prepare payload for Shopify integration
        const payload = {
            productId,
            beadCount,
            beads: slots.filter(s => s).map((bead, idx) => ({
                position: idx + 1,
                id: bead.id,
                name: bead.name,
                code: bead.code,
                img: bead.img
            })),
            chainMetal,
            chainLength: chainLengthType === 'standard' ? 18 : parseInt(customLength) || 18,
            chainLengthType,
            price: currentPrice,
            description: `${metalText} Chain (${lengthText}) | ${slots.filter(s => s).length} Beads`
        };

        // Call the onAddToCart callback with payload
        if (onAddToCart) {
            onAddToCart(payload);
        }
    };

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
                            {beadLibrary[selectedMetal].map(bead => (
                                <button
                                    key={bead.id}
                                    onClick={() => handleAddBead(bead)}
                                    className="group flex flex-col gap-2 items-center p-2 w-20 md:w-24 cursor-pointer transition-transform hover:-translate-y-1"
                                >
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
            <div className="w-full md:w-80 lg:w-96 bg-[#F9F8F6] flex flex-col min-h-[340px] md:min-h-0 md:max-h-[90vh] shrink-0 shadow-xl md:shadow-none z-40 md:sticky md:top-0">
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
                        onClick={handleConfirmDesign}
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

export default RockiiBuilder;
