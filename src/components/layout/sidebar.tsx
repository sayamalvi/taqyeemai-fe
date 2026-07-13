'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, BarChart3, Layers, History, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/resumes', icon: FileText, label: 'Resumes' },
    { to: '/insights', icon: BarChart3, label: 'Insights' },
    { to: '/history', icon: History, label: 'History' },
];

const ROW_BASE =
    "relative flex items-center h-11 w-11 rounded-2xl overflow-hidden " +
    "group-hover/sidebar:w-[200px] " +
    "transition-[width,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

const LABEL_BASE =
    "text-sm font-medium whitespace-nowrap pr-4 " +
    "opacity-0 -translate-x-1 " +
    "transition-[opacity,transform] duration-200 ease-out " +
    "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100";

function NavItem({ to, icon: Icon, label, isActive }: { to: string; icon: any; label: string; isActive: boolean }) {
    return (
        <Link href={to} title={label} className="block w-full">
            <div
                className={cn(
                    ROW_BASE,
                    isActive
                        ? "bg-ink text-bg shadow-card"
                        : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                )}
            >
                <span className="h-11 w-11 flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={2} />
                </span>
                <span className={LABEL_BASE}>{label}</span>
            </div>
        </Link>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    const displayName = "Account";

    return (
        <aside
            className={cn(
                "group/sidebar hidden md:flex shrink-0 h-[calc(100vh-32px)] sticky top-4 ml-4",
                "flex-col items-center justify-between py-5 rounded-3xl",
                "bg-surface border border-border shadow-card overflow-hidden z-50",
                "w-[88px] hover:w-[248px]",
                "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            )}
        >
            <div className="flex flex-col items-center gap-6 w-full px-4">
                {/* Placeholder Logo */}
                <div
                    className={cn(
                        "flex items-center h-14 w-14 group-hover/sidebar:w-[200px] overflow-hidden",
                        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    )}
                >
                    <div className="h-12 w-12 flex items-center justify-center shrink-0 bg-accent text-white rounded-xl font-bold text-xl">
                        R
                    </div>
                    <span className={cn("ml-3 font-display text-lg font-bold text-ink", LABEL_BASE)}>
                        Roaster
                    </span>
                </div>

                <nav className="flex flex-col items-center gap-1.5 w-full">
                    {NAV.map((item) => (
                        <NavItem
                            key={item.to}
                            {...item}
                            isActive={pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to))}
                        />
                    ))}
                </nav>
            </div>

            <div className="flex flex-col items-center gap-2 w-full px-4">
                <NavItem to="/settings" icon={Settings} label="Settings" isActive={pathname.startsWith('/settings')} />
                <button title="Log out" className="block w-full text-left">
                    <div className={cn(ROW_BASE, "text-ink-muted hover:bg-surface-2 hover:text-danger")}>
                        <span className="h-11 w-11 flex items-center justify-center shrink-0">
                            <LogOut size={18} />
                        </span>
                        <span className={LABEL_BASE}>Log out</span>
                    </div>
                </button>

                {/* User Profile */}
                <div
                    className={cn(
                        "flex items-center h-12 mt-1 w-10 group-hover/sidebar:w-[200px] overflow-hidden",
                        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    )}
                >
                    <div className="h-10 w-10 rounded-full bg-accent-soft text-accent-strong font-semibold flex items-center justify-center text-sm ring-2 ring-surface shrink-0">
                        A
                    </div>
                    <div className={cn("ml-3 min-w-0 flex-1", LABEL_BASE)}>
                        <div className="text-sm font-semibold text-ink truncate">{displayName}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
