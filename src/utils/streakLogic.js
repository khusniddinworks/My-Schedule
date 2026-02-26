export function calculateStreak(dailyStats) {
    // dailyStats is an array of objects: { date: string, totalMinutes: number }
    let streak = 0;

    // Sort by date descending
    const sortedStats = [...dailyStats].sort((a, b) => new Date(b.date) - new Date(a.date));

    for (let i = 0; i < sortedStats.length; i++) {
        if (sortedStats[i].totalMinutes >= 240) {
            streak++;
        } else {
            // If we miss a day, streak is broken
            // Note: We might want to check if the day is 'today' or 'yesterday'
            break;
        }
    }

    return streak;
}
