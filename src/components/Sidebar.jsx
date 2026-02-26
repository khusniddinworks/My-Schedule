import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Timer, Map, BarChart3, LogOut, ShieldCheck, Download, Upload } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const Sidebar = () => {
    const navigate = useNavigate();
    const { exportData, importData, getCurrentDay, user } = useStore();

    const links = [
        { to: '/', icon: <LayoutDashboard size={18} />, label: 'Mission Control' },
        { to: '/timer', icon: <Timer size={18} />, label: 'Combat Session' },
        { to: '/roadmap', icon: <Map size={18} />, label: 'Roadmap' },
        { to: '/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
    ];

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mission180-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const success = importData(ev.target.result);
                if (success) {
                    alert('Data imported successfully!');
                    navigate('/');
                } else {
                    alert('Invalid backup file.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return (
        <aside className="hidden lg:flex w-[280px] h-screen sticky top-0 bg-zinc-950 border-r border-white/5 p-6 flex-col">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    <ShieldCheck size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-black tracking-tighter uppercase italic leading-none">My Schedule</span>
                    <span className="text-[8px] font-black text-zinc-600 tracking-[0.3em] uppercase mt-0.5">Day {getCurrentDay()}</span>
                </div>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_4px_15px_rgba(139,92,246,0.1)]'
                                        : 'text-zinc-600 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                {link.icon}
                                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Target</div>
                    <div className="text-[10px] font-bold text-zinc-300">IELTS 7.5 @ 180 Days</div>
                    <div className="text-[8px] font-black text-primary mt-1">🔥 {user.streak} day streak</div>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-zinc-600 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all" title="Export Backup">
                        <Download size={14} />
                        <span className="text-[8px] font-black tracking-widest uppercase">Export</span>
                    </button>
                    <button onClick={handleImport} className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-zinc-600 hover:text-blue-400 hover:bg-blue-400/5 transition-all" title="Import Backup">
                        <Upload size={14} />
                        <span className="text-[8px] font-black tracking-widest uppercase">Import</span>
                    </button>
                </div>

                <button
                    onClick={() => { if (window.confirm('Terminate portal session?')) { localStorage.clear(); window.location.reload(); } }}
                    className="flex items-center gap-2 w-full p-3 text-zinc-700 hover:text-rose-500 transition-colors font-bold text-[9px] tracking-widest uppercase"
                >
                    <LogOut size={14} />
                    <span>Reset System</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
