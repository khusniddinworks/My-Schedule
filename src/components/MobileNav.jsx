import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Timer, Map, BarChart3 } from 'lucide-react';

const MobileNav = () => {
    const links = [
        { to: '/', icon: <LayoutDashboard size={22} /> },
        { to: '/timer', icon: <Timer size={22} /> },
        { to: '/roadmap', icon: <Map size={22} /> },
        { to: '/analytics', icon: <BarChart3 size={22} /> },
    ];

    return (
        <nav className="lg:hidden fixed bottom-6 left-4 right-4 h-20 bg-zinc-950/90 backdrop-blur-2xl border border-white/5 rounded-3xl flex justify-around items-center px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                        `p-4 rounded-2xl transition-all duration-300 ${isActive
                            ? 'text-primary bg-primary/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                            : 'text-zinc-600'
                        }`
                    }
                >
                    {link.icon}
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileNav;
