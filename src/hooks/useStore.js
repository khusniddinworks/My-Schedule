import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set, get) => ({
            // --- USER STATE ---
            user: {
                name: 'Operator',
                targetHours: 4,
                streak: 0,
                startDate: new Date().toISOString().split('T')[0],
            },

            // --- TIMER (Persistent!) ---
            timer: {
                seconds: 0,
                isActive: false,
                category: 'IELTS',
                startedAt: null, // ISO timestamp when timer was started
            },

            startTimer: (category) => {
                set({
                    timer: {
                        seconds: get().timer.seconds,
                        isActive: true,
                        category,
                        startedAt: Date.now(),
                    }
                });
            },

            pauseTimer: () => {
                const { timer } = get();
                if (!timer.isActive || !timer.startedAt) return;
                const elapsed = Math.floor((Date.now() - timer.startedAt) / 1000);
                set({
                    timer: {
                        ...timer,
                        seconds: timer.seconds + elapsed,
                        isActive: false,
                        startedAt: null,
                    }
                });
            },

            getTimerSeconds: () => {
                const { timer } = get();
                if (timer.isActive && timer.startedAt) {
                    return timer.seconds + Math.floor((Date.now() - timer.startedAt) / 1000);
                }
                return timer.seconds;
            },

            setTimerCategory: (category) => {
                const { timer } = get();
                if (!timer.isActive) {
                    set({ timer: { ...timer, category } });
                }
            },

            archiveTimer: () => {
                const totalSeconds = get().getTimerSeconds();
                const minutes = Math.floor(totalSeconds / 60);
                const category = get().timer.category;

                if (minutes < 1) return false;

                get().addSession(category, minutes);
                set({
                    timer: { seconds: 0, isActive: false, category, startedAt: null }
                });
                return true;
            },

            resetTimer: () => {
                set({
                    timer: {
                        seconds: 0,
                        isActive: false,
                        category: get().timer.category,
                        startedAt: null,
                    }
                });
            },

            // --- TASKS ---
            tasks: [
                { id: 1, title: 'IELTS Grammar: Perfect Tenses', category: 'IELTS', status: 'todo', createdAt: new Date().toISOString() },
                { id: 2, title: 'Linux Mastery: Terminal Ops', category: 'InfoSec', status: 'todo', createdAt: new Date().toISOString() },
            ],

            addTask: (task) => set((state) => ({
                tasks: [...state.tasks, { ...task, id: Date.now(), status: 'todo', createdAt: new Date().toISOString() }]
            })),

            completeTask: (id) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'done', completedAt: new Date().toISOString() } : t)
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

            editTask: (id, newTitle) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, title: newTitle } : t)
            })),

            // --- SESSIONS & ANALYTICS ---
            sessions: [],

            addSession: (category, minutes) => {
                const today = new Date().toISOString().split('T')[0];
                set((state) => ({
                    sessions: [...state.sessions, { date: today, category, minutes, id: Date.now() }]
                }));
                get().updateStreak();
            },

            // --- STREAK LOGIC (Fixed) ---
            updateStreak: () => {
                const { sessions } = get();
                if (sessions.length === 0) {
                    set((state) => ({ user: { ...state.user, streak: 0 } }));
                    return;
                }

                const dailyMinutes = sessions.reduce((acc, sess) => {
                    acc[sess.date] = (acc[sess.date] || 0) + sess.minutes;
                    return acc;
                }, {});

                let streak = 0;
                const today = new Date();

                for (let i = 0; i < 365; i++) {
                    const checkDate = new Date(today);
                    checkDate.setDate(today.getDate() - i);
                    const dateStr = checkDate.toISOString().split('T')[0];

                    if (dailyMinutes[dateStr] && dailyMinutes[dateStr] >= 240) {
                        streak++;
                    } else if (i === 0) {
                        // Today hasn't reached 4h yet — that's ok, check from yesterday
                        continue;
                    } else {
                        break;
                    }
                }

                set((state) => ({ user: { ...state.user, streak } }));
            },

            // --- DAY CALCULATOR ---
            getCurrentDay: () => {
                const { user } = get();
                const start = new Date(user.startDate);
                const now = new Date();
                const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
                return Math.max(1, diff + 1);
            },

            // --- CURRENT PHASE ---
            getCurrentPhase: () => {
                const day = get().getCurrentDay();
                if (day <= 30) return 0;
                if (day <= 60) return 1;
                if (day <= 90) return 2;
                if (day <= 120) return 3;
                if (day <= 150) return 4;
                return 5;
            },

            // --- TODAY STATS ---
            getTodayStats: () => {
                const today = new Date().toISOString().split('T')[0];
                const todaySessions = get().sessions.filter(s => s.date === today);
                const ieltsMinutes = todaySessions.filter(s => s.category === 'IELTS').reduce((acc, s) => acc + s.minutes, 0);
                const infosecMinutes = todaySessions.filter(s => s.category === 'InfoSec').reduce((acc, s) => acc + s.minutes, 0);
                return { ieltsMinutes, infosecMinutes, totalMinutes: ieltsMinutes + infosecMinutes };
            },

            // --- EXPORT / IMPORT ---
            exportData: () => {
                const state = get();
                return JSON.stringify({
                    user: state.user,
                    tasks: state.tasks,
                    sessions: state.sessions,
                }, null, 2);
            },

            importData: (jsonString) => {
                try {
                    const data = JSON.parse(jsonString);
                    if (data.user && data.tasks && data.sessions) {
                        set({
                            user: data.user,
                            tasks: data.tasks,
                            sessions: data.sessions,
                        });
                        return true;
                    }
                    return false;
                } catch {
                    return false;
                }
            },

            // --- RESET ---
            resetAll: () => {
                set({
                    user: { name: 'Operator', targetHours: 4, streak: 0, startDate: new Date().toISOString().split('T')[0] },
                    timer: { seconds: 0, isActive: false, category: 'IELTS', startedAt: null },
                    tasks: [],
                    sessions: [],
                });
            },
        }),
        {
            name: 'mission-180-storage',
        }
    )
);
