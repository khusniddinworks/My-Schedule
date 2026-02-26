import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CapacityCard from '../components/CapacityCard';
import StreakBadge from '../components/StreakBadge';
import { useStore } from '../hooks/useStore';
import { Trash2, CheckCircle, Plus } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { tasks, addTask, completeTask, deleteTask, user, sessions, getCurrentDay } = useStore();
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.date === today);
    const currentDay = getCurrentDay();

    const ieltsMinutes = todaySessions.filter(s => s.category === 'IELTS').reduce((acc, s) => acc + s.minutes, 0);
    const infosecMinutes = todaySessions.filter(s => s.category === 'InfoSec').reduce((acc, s) => acc + s.minutes, 0);
    const totalMinutes = ieltsMinutes + infosecMinutes;
    const targetMinutes = user.targetHours * 60;
    const totalCapacity = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [filter, setFilter] = useState('ALL');

    const submitTask = (category) => {
        if (!newTaskTitle.trim()) return;
        addTask({ title: newTaskTitle.trim(), category });
        setNewTaskTitle('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') submitTask('IELTS');
    };

    const filteredTasks = tasks.filter(t => {
        if (t.status !== 'todo') return false;
        if (filter === 'ALL') return true;
        return t.category === filter;
    });

    const doneCount = tasks.filter(t => t.status === 'done').length;
    const phaseProgress = Math.round((doneCount / (tasks.length || 1)) * 100);

    return (
        <div className="pb-24 lg:pb-0">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase italic">Mission Control</h1>
                    <p className="text-zinc-500 mt-1 font-medium text-sm">IELTS 7.5 + InfoSec Associate | <span className="text-primary font-black">Day {currentDay}</span> of 180</p>
                </div>
                <StreakBadge streak={user.streak || 0} />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <CapacityCard
                    title="IELTS TRACK"
                    value={`${(ieltsMinutes / 60).toFixed(1)}h`}
                    label="Target: 2.0h"
                    progress={Math.min(100, Math.round((ieltsMinutes / 120) * 100))}
                    color="bg-primary"
                />
                <CapacityCard
                    title="INFOSEC TRACK"
                    value={`${(infosecMinutes / 60).toFixed(1)}h`}
                    label="Target: 2.0h"
                    progress={Math.min(100, Math.round((infosecMinutes / 120) * 100))}
                    color="bg-accent1"
                />
                <CapacityCard
                    title="MISSION UPTIME"
                    value={`${totalCapacity}%`}
                    label={`Total: ${(totalMinutes / 60).toFixed(1)}h / ${user.targetHours}h`}
                    progress={totalCapacity}
                    color="bg-gradient-to-r from-primary to-accent1"
                />
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold tracking-tight uppercase italic">Operations</h2>
                        <div className="flex gap-1">
                            {['ALL', 'IELTS', 'InfoSec'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-[9px] font-black tracking-widest px-3 py-1.5 rounded-lg transition-all ${filter === f ? 'bg-primary/20 text-primary' : 'text-zinc-600 hover:text-zinc-300'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add Task */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="New target..."
                            className="flex-1 bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary outline-none placeholder:text-zinc-700"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={() => submitTask('IELTS')} className="text-[9px] font-black text-primary bg-primary/10 hover:bg-primary/20 px-3 rounded-xl transition-all flex items-center gap-1">
                            <Plus size={12} /> IELTS
                        </button>
                        <button onClick={() => submitTask('InfoSec')} className="text-[9px] font-black text-accent1 bg-accent1/10 hover:bg-accent1/20 px-3 rounded-xl transition-all flex items-center gap-1">
                            <Plus size={12} /> SEC
                        </button>
                    </div>

                    {/* Task List */}
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {filteredTasks.length === 0 ? (
                            <div className="glass p-10 text-center text-zinc-700 text-xs font-bold tracking-widest uppercase">No targets. Add one above.</div>
                        ) : (
                            filteredTasks.map(task => (
                                <div key={task.id} className="glass p-4 flex justify-between items-center group hover:border-white/10 transition-all rounded-2xl">
                                    <div className="flex gap-3 items-center min-w-0">
                                        <div className={`w-1 h-8 rounded-full shrink-0 ${task.category === 'IELTS' ? 'bg-primary' : 'bg-accent1'}`} />
                                        <div className="min-w-0">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${task.category === 'IELTS' ? 'text-primary' : 'text-accent1'}`}>
                                                {task.category}
                                            </span>
                                            <h4 className="text-sm font-bold text-zinc-200 truncate">{task.title}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => completeTask(task.id)} className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-all" title="Complete">
                                            <CheckCircle size={16} />
                                        </button>
                                        <button onClick={() => deleteTask(task.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-all" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Phase Status Card */}
                <div className="lg:col-span-2 glass p-6 flex flex-col justify-between border-primary/10 bg-primary/[0.01] h-fit">
                    <div>
                        <h3 className="text-base font-black mb-1 tracking-tighter uppercase italic">Phase I Readiness</h3>
                        <p className="text-zinc-600 text-xs leading-relaxed mb-6 italic">
                            &ldquo;The foundation determines the height of the skyscraper.&rdquo;
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Done</div>
                                <div className="text-2xl font-black">{doneCount}</div>
                            </div>
                            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Sessions</div>
                                <div className="text-2xl font-black">{sessions.length}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-black tracking-widest uppercase">
                                <span className="text-zinc-600">Progress</span>
                                <span>{phaseProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${phaseProgress}%` }} />
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn-primary w-full mt-6 py-4 text-[10px] tracking-[0.2em] font-black"
                        onClick={() => navigate('/timer')}
                    >
                        INITIALIZE COMBAT SESSION
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
