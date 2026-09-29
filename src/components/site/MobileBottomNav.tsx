import { Link, useRouterState } from "@tanstack/react-router";
import { Home, PackageOpen, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/lib/cart";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/new-drops", label: "New Drops", icon: PackageOpen },
  { to: "/account", label: "Profile", icon: UserRound },
] as const;

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { count } = useCart();

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-[60] grid h-16 grid-cols-4 overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl backdrop-blur-md sm:hidden">
      {items.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link key={to} to={to} aria-current={active ? "page" : undefined} className={`relative flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${active ? "text-accent" : "text-muted-foreground"}`}>
            <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
            <span className="truncate">{label}</span>
            {to === "/shop" && count > 0 ? <span className="absolute right-[24%] top-2 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] text-accent-foreground">{count}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}