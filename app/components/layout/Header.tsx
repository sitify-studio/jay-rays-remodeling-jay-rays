'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getBrandName, getHeaderNavItems } from '@/app/lib/siteContent';
import { getImageSrc } from '@/app/lib/utils';

const FALLBACK_NAV_LINKS = [
  { id: 'home', name: 'Home', href: '/' },
  { id: 'about', name: 'About', href: '/about-us' },
  { id: 'contact', name: 'Contact', href: '/contact-us' },
  { id: 'services', name: 'Services', href: '/services' },
] as const;

const navLinkClass =
  'px-4 py-2 text-sm font-medium text-[var(--wb-text-main)] rounded-lg transition-colors hover:text-[var(--wb-primary)] hover:bg-[color-mix(in_srgb,var(--wb-primary)_10%,transparent)]';

const mobileNavLinkClass =
  'px-3 py-2.5 text-sm font-medium text-[var(--wb-text-main)] rounded-lg transition-colors hover:text-[var(--wb-primary)] hover:bg-[color-mix(in_srgb,var(--wb-primary)_10%,transparent)]';

export function Header() {
  const { site, pages } = useWebBuilder();
  const businessName = useMemo(
    () => getBrandName(site) || "Jay Ray's Custom Remodeling",
    [site]
  );
  const logoSrc = useMemo(() => {
    const url = site?.footer?.logo?.url || site?.theme?.logoUrl;
    return url ? getImageSrc(url) : '/logo.png';
  }, [site?.footer?.logo?.url, site?.theme?.logoUrl]);
  const navLinks = useMemo(() => {
    const items = getHeaderNavItems(pages);
    return items.length > 0 ? items : [...FALLBACK_NAV_LINKS];
  }, [pages]);

  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
          <Link href="/" className="flex items-center shrink-0" onClick={closeMenu}>
            <Image
              src={logoSrc}
              alt={`${businessName} logo`}
              width={200}
              height={60}
              className="h-11 sm:h-12 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.name}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--wb-text-main)] hover:text-[var(--wb-primary)] hover:bg-[color-mix(in_srgb,var(--wb-primary)_10%,transparent)] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenu} className={mobileNavLinkClass}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
