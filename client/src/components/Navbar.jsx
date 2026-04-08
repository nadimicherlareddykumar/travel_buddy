import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Plane } from 'lucide-react';

const navLinks = [
  { to: '/dashboard',    label: 'Dashboard',       Icon: LayoutDashboard },
  { to: '/destinations', label: 'My Destinations',  Icon: MapPin },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
            <Plane className="w-4 h-4 text-white -rotate-45" />
          </div>
          <span className="text-lg font-extrabold text-gradient tracking-tight">TravelBuddy</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
