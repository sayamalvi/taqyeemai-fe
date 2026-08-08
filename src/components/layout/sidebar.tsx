'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, FileText, BarChart3, History, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/ui/logo';
import { api } from '../../../api';
import { useUser } from '@/hooks/useUser';
import { Zap } from 'lucide-react';

const NAV = [
    { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
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
    "text-sm font-medium whitespace-nowrap pr-4 font-sans",
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
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/50 hover:bg-white/5 hover:text-foreground"
            )}>
                {/* Active indicator bar */}
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
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
    const { data: user } = useUser();

    async function handleLogout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            router.push('/login');
            router.refresh();
        }
    }

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className={cn(
                "group/sidebar hidden md:flex shrink-0 h-[calc(100vh-32px)] sticky top-4 ml-4",
                "flex-col items-center justify-between py-5 rounded-3xl",
                "glass-panel z-50",
                "w-[76px] hover:w-[240px]",
                "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            )}>
                {/* Top section: Logo + Nav */}
                <div className="flex flex-col items-center gap-8 w-full px-4">
                    {/* Logo */}
                    <div className={cn(
                        "flex items-center h-12 w-12 group-hover/sidebar:w-[200px] overflow-hidden",
                        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] mt-2"
                    )}>
                        <div className="shrink-0 flex items-center justify-center w-10 h-10">
                            <Logo variant="monogram" size={24} />
                        </div>
                        <span className={cn("ml-2", LABEL_BASE)}>
                            <span className="font-display text-lg font-bold tracking-tight text-foreground">
                                Taqyeem<span className="text-primary">.ai</span>
                            </span>
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col items-center gap-2 w-full">
                        {NAV.map((item) => (
                            <NavItem
                                key={item.to}
                                {...item}
                                isActive={pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to))}
                            />
                        ))}
                    </nav>
                </div>

                {/* Bottom section: Settings, Theme, Logout, User */}
                <div className="flex flex-col items-center gap-2 w-full px-4 mb-2">
                    <NavItem to="/settings" icon={Settings} label="Settings" isActive={pathname.startsWith('/settings')} />

                    {/* Theme Toggle */}
                    <div className={cn(ROW_BASE, "text-foreground/50 hover:bg-white/5 hover:text-foreground w-full overflow-visible")}>
                        <ThemeToggle isExpanded textClassName={LABEL_BASE} />
                    </div>

                    {/* Logout */}
                    <button title="Log out" className="block w-full text-left" onClick={handleLogout}>
                        <div className={cn(ROW_BASE, "text-foreground/50 hover:bg-[#EF4444]/10 hover:text-[#EF4444]")}>
                            <span className="h-11 w-11 flex items-center justify-center shrink-0">
                                <LogOut size={18} strokeWidth={1.8} />
                            </span>
                            <span className={LABEL_BASE}>Log out</span>
                        </div>
                    </button>

                    {/* User Avatar */}
                    {/* Credits Badge */}
                    <div className={cn(
                        "flex items-center h-10 w-10 group-hover/sidebar:w-[200px] overflow-hidden",
                        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    )}>
                        <span className="h-10 w-10 flex items-center justify-center shrink-0">
                            <Zap size={16} className="text-[#D4AF37]" />
                        </span>
                        <span className={cn(LABEL_BASE)}>
                            <span className="text-sm font-semibold text-[#D4AF37]">{user?.credits ?? '–'}</span>
                            <span className="text-foreground/50 text-xs"> credits left</span>
                        </span>
                    </div>

                    {/* User Avatar */}
                    <div className={cn(
                        "flex items-center h-12 mt-2 w-10 group-hover/sidebar:w-[200px] overflow-hidden",
                        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    )}>
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-sans font-semibold flex items-center justify-center text-sm ring-1 ring-primary/20 shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div className={cn("ml-3 min-w-0 flex-1", LABEL_BASE)}>
                            <div className="text-sm font-semibold text-foreground truncate">{user?.name ?? 'Loading...'}</div>
                            <div className="text-[10px] text-foreground/50 truncate">{user?.tier ?? 'FREE'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MOBILE FLOATING DOCK */}
            <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50">
                <div className="flex items-center justify-evenly p-2 rounded-full bg-background/60 backdrop-blur-3xl border border-white/10 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    {[...NAV, { to: '/settings', icon: Settings, label: 'Settings' }].map((item) => {
                        const isActive = pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to));
                        return (
                            <Link 
                                key={item.to} 
                                href={item.to} 
                                className={cn(
                                    "relative flex items-center justify-center flex-1 h-14 rounded-full transition-all duration-300 ease-out",
                                    isActive ? "text-primary" : "text-foreground/50 hover:text-foreground"
                                )}
                            >
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <item.icon 
                                        size={22} 
                                        strokeWidth={isActive ? 2.5 : 2} 
                                        className={cn(
                                            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]", 
                                            isActive ? "-translate-y-1.5" : "translate-y-0"
                                        )} 
                                    />
                                    <span 
                                        className={cn(
                                            "absolute bottom-1.5 text-[10px] font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]", 
                                            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
