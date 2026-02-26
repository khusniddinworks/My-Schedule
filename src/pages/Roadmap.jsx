import { useStore } from '../hooks/useStore';

const Roadmap = () => {
    const { getCurrentPhase } = useStore();
    const activePhase = getCurrentPhase();

    const phases = [
        {
            days: '1-30', title: 'Phase I: Structural Foundation',
            ielts: ['Grammar Reset: Past/Present/Future Perfect', 'Vocab: 500 Academic Essentials', 'Listening: Test format & Section 1-2 mastery', 'Daily journaling for fluency'],
            infosec: ['Networking: OSI, TCP/IP, Subnetting', 'Linux: Mastery of terminal & permissions', 'TryHackMe: Complete Pre-Security Path', 'Set up GitHub Notes Repository']
        },
        {
            days: '31-60', title: 'Phase II: Tactical Skill Building',
            ielts: ['Writing Task 1: Comparative/Trend Analysis', 'Speaking: Part 2 Cue Card simulation', 'Reading: Skimming & Scanning techniques', 'Timed practice for Sections 1-3'],
            infosec: ['Security+ Fundamentals: CIA Triad, Risk', 'Active Traffic: Wireshark & Nmap mastery', 'TryHackMe: Intro to CyberPath', 'Create First Project: Home Lab Setup']
        },
        {
            days: '61-90', title: 'Phase III: Intermediate Mastery',
            ielts: ['Writing Task 2: Advanced Essay Structures', 'Speaking: Part 3 Abstract Discussion', 'Reading: Matching Heading/Summary completion', 'Weekly Full-Length Mock Exams'],
            infosec: ['Web Security: OWASP Top 10 (SQLi, XSS)', 'Defensive Ops: SIEM (ELK/Splunk basics)', 'TryHackMe: SOC Level 1 Path', 'Write 2 Security Blog posts on LinkedIn']
        },
        {
            days: '91-120', title: 'Phase IV: Advanced Ops & Portfolio',
            ielts: ['Advanced Vocab: Idiomatic expressions', 'Writing: Cohesion & Coherence polish', 'Reading: Timed Mock Tests (Hard Level)', 'Target: Consistent Band 7.0+ in sessions'],
            infosec: ['Offensive Security: MetaSploit & Exploit research', 'Active Directory: Lateral Movement basics', 'THM: Complete Junior Pentester Path', 'Build Portfolio Website with 3 Writeups']
        },
        {
            days: '121-150', title: 'Phase V: Simulation & Refinement',
            ielts: ['Daily Full Mock Tests (4 skills)', 'Intense Speaking Simulations (Mock Interviews)', 'Final Error Analysis & Correction', 'Official Exam Registration Week'],
            infosec: ['Incident Response: Digital Forensics basics', 'Interview Prep: Technical Q&A mastery', 'LinkedIn Optimization & Resume Building', 'Networking with InfoSec Professionals']
        },
        {
            days: '151-180', title: 'Phase VI: Target Engagement',
            ielts: ['EXAM DAY (Target 7.5)', 'Final Review of Academic Templates', 'Post-Exam Reflection'],
            infosec: ['Job Application Blitz: Apply 5 Roles/Day', 'Final CTF Challenges (HackTheBox)', 'GRADUATION: Career Ready Portfolio', 'MY SCHEDULE COMPLETE']
        }
    ];

    return (
        <div className="pb-24 lg:pb-0">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase italic">Strategic Roadmap</h1>
                <p className="text-zinc-500 mt-1 font-medium text-sm max-w-xl">180-day precision sequence. IELTS 7.5 + InfoSec Associate.</p>
            </header>

            <div className="space-y-6">
                {phases.map((phase, idx) => {
                    const isCurrent = idx === activePhase;
                    const isDone = idx < activePhase;

                    return (
                        <div key={phase.days} className={`glass p-6 md:p-10 transition-all relative overflow-hidden ${isCurrent ? 'border-primary/40 ring-1 ring-primary/20 bg-primary/[0.02]' : isDone ? 'opacity-60 border-emerald-500/20' : 'opacity-30 hover:opacity-60'}`}>
                            {isCurrent && (
                                <div className="absolute top-0 right-0 bg-primary/20 text-primary px-4 py-1.5 rounded-bl-2xl text-[9px] font-black tracking-[0.3em] uppercase animate-pulse">
                                    ACTIVE
                                </div>
                            )}
                            {isDone && (
                                <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-bl-2xl text-[9px] font-black tracking-[0.3em] uppercase">
                                    COMPLETED
                                </div>
                            )}

                            <div className="mb-8">
                                <h2 className="text-xl md:text-2xl font-black tracking-tighter text-white mb-2">{phase.title}</h2>
                                <span className="text-zinc-600 font-bold bg-white/5 px-3 py-1 rounded-full text-[10px]">DAYS {phase.days}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-5 bg-primary rounded-full" />
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">IELTS TRACK</h4>
                                    </div>
                                    {phase.ielts.map((item, i) => (
                                        <p key={i} className="text-zinc-400 flex items-start gap-2 text-xs leading-relaxed">
                                            <span className="text-primary/40 mt-0.5 text-[10px]">▸</span> {item}
                                        </p>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-5 bg-accent1 rounded-full" />
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">INFOSEC OPS</h4>
                                    </div>
                                    {phase.infosec.map((item, i) => (
                                        <p key={i} className="text-zinc-400 flex items-start gap-2 text-xs leading-relaxed">
                                            <span className="text-accent1/40 mt-0.5 text-[10px]">▸</span> {item}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Roadmap;
