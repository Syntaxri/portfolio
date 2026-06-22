"use client";

import React from 'react';
import { Search, Activity, Cpu, Code, Zap, Grid, User, Settings } from 'lucide-react';

export default function DashboardLayout() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden text-sm">

            {/* ── Background Layer ── */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
                <div className="bg-blob w-[600px] h-[600px] bg-[var(--accent)] top-[-10%] left-[-10%] opacity-20" />
                <div className="bg-blob w-[500px] h-[500px] bg-indigo-600 bottom-[-20%] right-[-10%] opacity-20" style={{ animationDelay: '5s' }} />
            </div>

            {/* ── Main Grid Layout ── */}
            <div className="relative z-10 container mx-auto px-6 lg:px-8 py-8 h-screen flex flex-col lg:grid lg:grid-cols-[24%_1fr_24%] gap-6">

                {/* LEFT PANEL: Identity & System */}
                <aside className="glass-panel flex flex-col h-full p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-indigo-900 flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
                            <span className="font-bold text-lg tracking-wider">SK</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-wide">System Admin</h1>
                            <p className="text-xs text-muted">Meknes, Morocco</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between glass-card px-4 py-3 mb-8">
                        <span className="text-xs font-medium text-white/70 uppercase tracking-widest">Network</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--accent)] font-mono">ONLINE</span>
                            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-glow" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 flex-grow">
                        {[
                            { label: 'Active Tasks', val: '14' },
                            { label: 'CPU Usage', val: '28%' },
                            { label: 'Memory', val: '4.2 GB' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card flex justify-between items-center p-4">
                                <span className="text-muted text-xs font-medium">{stat.label}</span>
                                <span className="font-mono text-sm">{stat.val}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* CENTER PANEL: Primary Interactive Hub */}
                <main className="flex flex-col h-full gap-6">
                    <div className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[var(--accent)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Query system protocols..."
                            className="glass-input pl-11"
                        />
                    </div>

                    <div className="glass-panel flex-grow p-8 flex flex-col">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Active Modules</h2>
                                <p className="text-xs text-muted">Monitor and control primary subsystems</p>
                            </div>
                            <button className="text-xs text-[var(--accent)] hover:text-white transition-colors">
                                View All →
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Neural Engine', desc: 'Processing 420.5 TFLOPS', icon: Cpu },
                                { title: 'Data Pipeline', desc: 'Syncing remote nodes', icon: Activity }
                            ].map((card, i) => {
                                const Icon = card.icon;
                                return (
                                    <div key={i} className="glass-card p-6 group cursor-pointer">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors">
                                            <Icon className="w-5 h-5 text-white/70 group-hover:text-[var(--accent)]" />
                                        </div>
                                        <h3 className="text-base font-semibold text-white mb-1">{card.title}</h3>
                                        <p className="text-xs text-muted mb-4">{card.desc}</p>
                                        <span className="inline-block px-2 py-1 rounded border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] uppercase tracking-wider font-mono">
                      Running
                    </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>

                {/* RIGHT PANEL: Event Stream */}
                <aside className="glass-panel flex flex-col h-full p-6 hidden lg:flex">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6">Live Feed</h3>

                    <div className="relative flex-grow">
                        <div className="absolute left-[7px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-white/10 to-transparent" />

                        <div className="flex flex-col gap-6 relative">
                            {[
                                { title: 'Deployment Success', time: 'Just now', type: 'success' },
                                { title: 'API Sync Triggered', time: '2m ago', type: 'neutral' },
                                { title: 'High Latency Detected', time: '14m ago', type: 'warning' },
                            ].map((event, i) => (
                                <div key={i} className="relative pl-6 group">
                                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-[var(--bg-base)] bg-[var(--bg-base)] flex items-center justify-center z-10 group-hover:scale-125 transition-transform
                    ${event.type === 'success' ? 'text-emerald-400' : event.type === 'warning' ? 'text-amber-400' : 'text-violet-400'}
                  `}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ boxShadow: '0 0 8px currentColor' }} />
                                    </div>

                                    <div className="glass-card p-3 group-hover:border-white/20">
                                        <h4 className="text-xs font-semibold text-white mb-0.5">{event.title}</h4>
                                        <span className="text-[10px] text-muted font-mono">{event.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

            </div>

            {/* BOTTOM DOCK (Fixed) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]">
                    {[Grid, Code, Zap, Settings, User].map((Icon, i) => (
                        <button key={i} className="relative p-2 text-white/50 hover:text-white transition-colors group">
                            <Icon className="w-5 h-5 relative z-10" />
                            <div className="absolute inset-0 rounded-full bg-white/5 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
                            {i === 0 && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(var(--accent-rgb),1)]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}