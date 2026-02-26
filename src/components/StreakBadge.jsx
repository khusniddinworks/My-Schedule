const StreakBadge = ({ streak }) => {
    return (
        <div className="glass px-6 py-3 flex items-center gap-3">
            <span className="text-2xl animate-pulse">🔥</span>
            <span className="font-black text-lg tracking-tighter">{streak} DAY STREAK</span>
        </div>
    );
};

export default StreakBadge;
