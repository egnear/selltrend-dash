"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Painel" },
  { href: "/conexoes", label: "Integrações" },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="app-nav" aria-label="Navegação principal">
      <Link href="/" className="app-nav-brand" aria-label="Automatos, ir para o painel">
        <span className="app-nav-tomato" aria-hidden="true">●</span>
        <span>Automatos</span>
      </Link>
      <div className="page-switch" role="tablist" aria-label="Páginas do Automatos">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              role="tab"
              aria-selected={active}
              className={`page-switch-link ${active ? "page-switch-link-active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}