import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useStore } from '../hooks/useStore';

const Analytics = () => {
    const { sessions } = useStore();
    const [filter, setFilter] = useState('ALL');

    const filteredSessions = filter === 'ALL' ? sessions : sessions.filter(s => s.category === filter);

    // Last 7 days
    const getLast7Days = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = days[d.getDay()];
            const dayMinutes = filteredSessions.filter(s => s.date === dateStr).reduce((acc, s) => acc + s.minutes, 0);
            result.push({ name: dayName, hours: parseFloat((dayMinutes / 60).toFixed(1)), date: dateStr });
        }
        return result;
    };

    const chartData = getLast7Days();
    const totalMinutesAll = sessions.reduce((acc, s) => acc + s.minutes, 0);
    const totalHoursAll = (totalMinutesAll / 60).toFixed(1);
    const weeklyMin = chartData.reduce((acc, d) => acc + d.hours, 0);
    const weeklyAvg = (weeklyMin / 7).toFixed(1);

    const ieltsTotal = sessions.filter(s => s.category === 'IELTS').reduce((acc, s) => acc + s.minutes, 0);
    const infosecTotal = sessions.filter(s => s.category === 'InfoSec').reduce((acc, s) => acc + s.minutes, 0);
    const topCategory = totalMinutesAll === 0 ? 'N/A' : (ieltsTotal >= infosecTotal ? 'IELTS' : 'InfoSec');
    const topPercent = totalMinutesAll > 0 ? Math.round((Math.max(ieltsTotal, infosecTotal) / totalMinutesAll) * 100) : 0;

    // Session history
    const recentSessions = [...sessions].reverse().slice(0, 10);

    return (
        <div className="pb-24 lg:pb-0">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase italic">Performance Analytics</h1>
                    <p className="text-zinc-500 mt-1 font-medium text-sm">Real data from your combat sessions</p>
                </div>
                <div className="flex gap-1 bg-zinc-900 rounded-xl p-1">
                    {['ALL', 'IELTS', 'InfoSec'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-[9px] font-black tracking-widest px-4 py-2 rounded-lg transition-all ${filter === f ? 'bg-primary/20 text-primary' : 'text-zinc-600 hover:text-zinc-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {/* Chart */}
            <div className="glass p-6 md:p-8 mb-8 relative overflow-hidden">
                <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-8">
                    Weekly Output ({filter === 'ALL' ? 'Combined' : filter})
                </h3>
                <div className="h-[250px] md:h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#8B5CF6', fontWeight: 'bold' }}
                                labelStyle={{ color: '#71717a', fontSize: '10px', textTransform: 'uppercase', fontWeight: '900' }}
                            />
                            <Area type="monotone" dataKey="hours" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" animationDuration={1500} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="glass p-6 group hover:border-emerald-500/20 transition-all">
                    <h4 className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-emerald-500 transition-colors">Total Uptime</h4>
                    <div className="text-2xl md:text-3xl font-black italic tracking-tighter">{totalHoursAll}h</div>
                    <p className="text-[9px] text-zinc-600 mt-1 font-bold">All-time engagement</p>
                </div>
                <div className="glass p-6 group hover:border-primary/20 transition-all">
                    <h4 className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">Weekly Average</h4>
                    <div className="text-2xl md:text-3xl font-black italic tracking-tighter">{weeklyAvg}h/day</div>
                    <p className="text-[9px] text-zinc-600 mt-1 font-bold">Rolling 7-day window</p>
                </div>
                <div className="glass p-6 group hover:border-accent1/20 transition-all">
                    <h4 className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.2em] mb-2 group-hover:text-accent1 transition-colors">Primary Focus</h4>
                    <div className="text-2xl md:text-3xl font-black italic tracking-tighter">{topCategory}</div>
                    <p className="text-[9px] text-zinc-600 mt-1 font-bold">{topPercent}% total share</p>
                </div>
            </div>

            {/* Session History */}
            <div className="glass p-6 md:p-8">
                <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Recent Sessions</h3>
                {recentSessions.length === 0 ? (
                    <p className="text-zinc-700 text-xs text-center py-8 font-bold tracking-widest uppercase">No sessions archived yet</p>
                ) : (
                    <div className="space-y-2">
                        {recentSessions.map(s => (
                            <div key={s.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1 h-6 rounded-full ${s.category === 'IELTS' ? 'bg-primary' : 'bg-accent1'}`} />
                                    <div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${s.category === 'IELTS' ? 'text-primary' : 'text-accent1'}`}>{s.category}</span>
                                        <p className="text-xs text-zinc-400 font-bold">{s.date}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-black text-zinc-300">{s.minutes}m</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
