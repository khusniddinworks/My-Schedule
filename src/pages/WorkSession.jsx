import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../hooks/useStore';
import { useNavigate } from 'react-router-dom';

const WorkSession = () => {
    const navigate = useNavigate();
    const { timer, startTimer, pauseTimer, archiveTimer, resetTimer, getTimerSeconds, setTimerCategory } = useStore();
    const [displaySeconds, setDisplaySeconds] = useState(getTimerSeconds());

    // Tick every second when active
    useEffect(() => {
        if (!timer.isActive) {
            setDisplaySeconds(timer.seconds);
            return;
        }
        const interval = setInterval(() => {
            setDisplaySeconds(getTimerSeconds());
        }, 1000);
        return () => clearInterval(interval);
    }, [timer.isActive, timer.startedAt, timer.seconds, getTimerSeconds]);

    const formatTime = useCallback((totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const handleToggle = () => {
        if (timer.isActive) {
            pauseTimer();
        } else {
            startTimer(timer.category);
        }
    };

    const handleArchive = () => {
        const totalSec = getTimerSeconds();
        if (totalSec < 60) {
            alert('Sessions under 1 minute are not archived.');
            return;
        }
        const minutes = Math.floor(totalSec / 60);
        if (window.confirm(`Archive ${minutes} minutes to ${timer.category} track?`)) {
            const success = archiveTimer();
            if (success) {
                setDisplaySeconds(0);
                navigate('/');
            }
        }
    };

    const handleDiscard = () => {
        if (displaySeconds > 0 && !window.confirm('Discard this session without saving?')) return;
        resetTimer();
        setDisplaySeconds(0);
    };

    const glowColor = timer.category === 'IELTS' ? 'rgba(139,92,246,0.3)' : 'rgba(14,165,233,0.3)';

    return (
        <div className="pb-24 lg:pb-0">
            <header className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase italic">Combat Session</h1>
                <p className="text-zinc-500 mt-1 font-medium text-sm">Persistent timer — survives refresh and tab close</p>
            </header>

            <div className="glass max-w-3xl mx-auto p-8 md:p-16 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                {/* Category Selector */}
                <div className="flex justify-center gap-3 mb-12 md:mb-16">
                    <button
                        className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] transition-all duration-300 ${timer.category === 'IELTS' ? 'bg-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] ring-2 ring-primary/50' : 'bg-white/5 text-zinc-600 hover:text-zinc-400 border border-white/5'}`}
                        onClick={() => setTimerCategory('IELTS')}
                    >
                        IELTS OPS
                    </button>
                    <button
                        className={`px-6 md:px-10 py-3 md:py-4 rounded-2xl text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] transition-all duration-300 ${timer.category === 'InfoSec' ? 'bg-accent1 text-white shadow-[0_0_30px_rgba(14,165,233,0.4)] ring-2 ring-accent1/50' : 'bg-white/5 text-zinc-600 hover:text-zinc-400 border border-white/5'}`}
                        onClick={() => setTimerCategory('InfoSec')}
                    >
                        INFOSEC OPS
                    </button>
                </div>

                {/* Timer Display — responsive font */}
                <div
                    className={`text-[60px] sm:text-[90px] md:text-[130px] font-black tracking-tighter tabular-nums leading-none mb-12 md:mb-16 transition-all duration-700 select-none ${timer.isActive ? 'text-white' : 'text-zinc-800'}`}
                    style={{ textShadow: timer.isActive ? `0 0 70px ${glowColor}` : 'none' }}
                >
                    {formatTime(displaySeconds)}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-6">
                    <button
                        className={`flex-1 py-5 md:py-6 rounded-2xl text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] font-black transition-all uppercase italic ${timer.isActive ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_10px_30px_rgba(244,63,94,0.3)]' : 'bg-primary hover:bg-primary/90 shadow-[0_10px_30px_rgba(139,92,246,0.3)]'} text-white`}
                        onClick={handleToggle}
                    >
                        {timer.isActive ? 'HALT ENGAGEMENT' : 'INITIALIZE UPTIME'}
                    </button>
                    <button
                        className="py-5 md:py-6 px-8 md:px-12 btn-ghost text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] font-black uppercase italic"
                        onClick={handleArchive}
                    >
                        ARCHIVE SESSION
                    </button>
                    {displaySeconds > 0 && !timer.isActive && (
                        <button
                            className="py-5 md:py-6 px-6 text-[9px] font-black tracking-widest text-rose-500/50 hover:text-rose-500 transition-colors uppercase"
                            onClick={handleDiscard}
                        >
                            DISCARD
                        </button>
                    )}
                </div>

                {/* Meta Info */}
                <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16">
                    <div className="text-center">
                        <div className="text-zinc-700 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-2">Track</div>
                        <div className="text-xs md:text-sm font-black italic tracking-wider text-zinc-400">{timer.category}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-zinc-700 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-2">Status</div>
                        <div className={`text-xs md:text-sm font-black italic tracking-wider ${timer.isActive ? 'text-emerald-500 animate-pulse' : 'text-zinc-700'}`}>
                            {timer.isActive ? 'ENGAGED' : displaySeconds > 0 ? 'PAUSED' : 'STANDBY'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-zinc-700 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-2">Minutes</div>
                        <div className="text-xs md:text-sm font-black italic tracking-wider text-zinc-400">{Math.floor(displaySeconds / 60)}m</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkSession;
