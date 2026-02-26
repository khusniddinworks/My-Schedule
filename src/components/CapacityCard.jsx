const CapacityCard = ({ title, value, label, progress, color }) => {
    return (
        <div className="glass p-8 group overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">{title}</h3>
            <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
            <div className="text-sm text-zinc-500 mb-6 font-medium">{label}</div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${color}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default CapacityCard;
