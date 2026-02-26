export function calculateCapacity(minutes, target = 240) {
    // target defaults to 240 minutes (4 hours)
    return Math.min((minutes / target) * 100, 100).toFixed(0);
}
