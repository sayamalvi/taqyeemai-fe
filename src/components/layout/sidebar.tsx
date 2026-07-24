'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, FileText, BarChart3, History, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/ui/logo';

const NAV = [
    { to: '/', icon: LayoutGrid, label: 'Dashboard' },
    { to: '/resumes', icon: FileText, label: 'Resumes' },
    { to: '/insights', icon: BarChart3, label: 'Insights' },
    { to: '/history', icon: History, label: 'History' },
];

/* ─── Shared transition class strings ─── */
const ROW_BASE = [
    "relative flex items-center h-11 w-11 rounded-xl overflow-hidden",
    "group-hover/sidebar:w-[200px]",
    "transition-[width,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
].join(" ");

const LABEL_BASE = [
    "text-sm font-medium whitespace-nowrap pr-4",
    "opacity-0 -translate-x-1",
    "transition-[opacity,transform] duration-200 ease-out",
    "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100",
].join(" ");

/* ─── Nav Item ─── */
function NavItem({ to, icon: Icon, label, isActive }: { to: string; icon: any; label: string; isActive: boolean }) {
    return (
        <Link href={to} title={label} className="block w-full">
            <div className={cn(
                ROW_BASE,
                isActive
                    ? "bg-accent/10 text-accent"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink"
            )}>
                {/* Active indicator bar */}
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" />
                )}
                <span className="h-11 w-11 flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span className={cn(LABEL_BASE, isActive && "font-semibold")}>{label}</span>
            </div>
        </Link>
    );
}

/* ─── Sidebar ─── */
export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    // HIDE SIDEBAR COMPLETELY ON AUTH PAGES!
    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    function handleLogout() {
        localStorage.removeItem('accessToken');
        router.push('/login');
    }

    return (
        <aside className={cn(
            "group/sidebar hidden md:flex shrink-0 h-[calc(100vh-32px)] sticky top-4 ml-4",
            "flex-col items-center justify-between py-5 rounded-2xl",
            "bg-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50",
            "w-[72px] hover:w-[240px]",
            "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        )}>
            {/* Top section: Logo + Nav */}
            <div className="flex flex-col items-center gap-6 w-full px-3">
                {/* Logo */}
                <div className={cn(
                    "flex items-center h-12 w-12 group-hover/sidebar:w-[200px] overflow-hidden",
                    "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                )}>
                    <div className="shrink-0 flex items-center justify-center w-12 h-12">
                        <Logo variant="monogram" size={28} />
                    </div>
                    <span className={cn("ml-1", LABEL_BASE)}>
                        <span className="font-display text-base font-bold tracking-tight text-ink">
                            taqyeem<span className="text-accent">.ai</span>
                        </span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col items-center gap-1 w-full">
                    {NAV.map((item) => (
                        <NavItem
                            key={item.to}
                            {...item}
                            isActive={pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to))}
                        />
                    ))}
                </nav>
            </div>

            {/* Bottom section: Settings, Theme, Logout, User */}
            <div className="flex flex-col items-center gap-1 w-full px-3">
                <NavItem to="/settings" icon={Settings} label="Settings" isActive={pathname.startsWith('/settings')} />

                {/* Theme Toggle */}
                <div className={cn(ROW_BASE, "text-ink-muted hover:bg-surface-2 hover:text-ink w-full overflow-visible")}>
                    <ThemeToggle isExpanded textClassName={LABEL_BASE} />
                </div>

                {/* Logout */}
                <button title="Log out" className="block w-full text-left" onClick={handleLogout}>
                    <div className={cn(ROW_BASE, "text-ink-muted hover:bg-danger/10 hover:text-danger")}>
                        <span className="h-11 w-11 flex items-center justify-center shrink-0">
                            <LogOut size={18} strokeWidth={1.8} />
                        </span>
                        <span className={LABEL_BASE}>Log out</span>
                    </div>
                </button>

                {/* User Avatar */}
                <div className={cn(
                    "flex items-center h-12 mt-2 w-10 group-hover/sidebar:w-[200px] overflow-hidden",
                    "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                )}>
                    <div className="h-9 w-9 rounded-full bg-accent/15 text-accent font-semibold flex items-center justify-center text-sm ring-2 ring-accent/20 shrink-0">
                        U
                    </div>
                    <div className={cn("ml-3 min-w-0 flex-1", LABEL_BASE)}>
                        <div className="text-sm font-semibold text-ink truncate">Account</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
