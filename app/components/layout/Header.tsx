'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getBrandName, getHeaderNavItems } from '@/app/lib/siteContent';
import {
  getServingAreaLinksForService,
  resolveServiceSlug,
} from '@/app/lib/serviceAreaSlugs';
import { getImageSrc } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';

const SERVICES_HREF = '/services';

const FALLBACK_NAV_LINKS = [
  { id: 'home', name: 'Home', href: '/' },
  { id: 'about', name: 'About', href: '/about-us' },
  { id: 'contact', name: 'Contact', href: '/contact-us' },
  { id: 'services', name: 'Services', href: SERVICES_HREF },
] as const;

const navLinkClass =
  'px-4 py-2 text-sm font-medium text-[var(--wb-text-main)] rounded-lg transition-colors hover:text-[var(--wb-primary)] hover:bg-[color-mix(in_srgb,var(--wb-primary)_10%,transparent)]';

const mobileNavLinkClass =
  'px-3 py-2.5 text-sm font-medium text-[var(--wb-text-main)] rounded-lg transition-colors hover:text-[var(--wb-primary)] hover:bg-[color-mix(in_srgb,var(--wb-primary)_10%,transparent)]';

type ServiceNavItem = {
  id: string;
  name: string;
  href: string;
  areas: ReturnType<typeof getServingAreaLinksForService>;
};

function isServicesNavItem(link: { href: string; name: string }) {
  const href = link.href.replace(/\/+$/, '') || '/';
  const name = link.name.trim().toLowerCase();
  return href === SERVICES_HREF || name === 'services' || name === 'service';
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function Header() {
  const { site, pages, services, serviceAreaPages } = useWebBuilder();
  const colors = useThemeColors();
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

  const serviceLinks = useMemo<ServiceNavItem[]>(
    () =>
      (services ?? [])
        .filter((service) => service.status === 'published' && service.name?.trim())
        .map((service) => ({
          id: service._id,
          name: service.name.trim(),
          href: `/service/${resolveServiceSlug(service)}`,
          areas: getServingAreaLinksForService(service, serviceAreaPages, services ?? []),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [services, serviceAreaPages]
  );

  const activeService = useMemo(
    () => serviceLinks.find((s) => s.areas.length > 0) ?? null,
    [serviceLinks]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileExpandedServiceId, setMobileExpandedServiceId] = useState<string | null>(null);

  const hoveredService =
    serviceLinks.find((s) => s.id === activeServiceId) ?? activeService;

  const closeMenu = () => {
    setIsOpen(false);
    setMobileServicesOpen(false);
    setMobileExpandedServiceId(null);
    setServicesMenuOpen(false);
    setActiveServiceId(null);
  };

  const menuPanelDark = colors.sectionBackgroundDark;
  const menuTextLight = 'var(--wb-text-on-dark, #fff)';
  const menuHoverBg = colors.pageBackground;
  const menuHoverText = colors.mainText;
  const submenuBg = colors.pageBackground;
  const submenuText = colors.mainText;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between lg:h-20">
          <Link href="/" className="flex shrink-0 items-center" onClick={closeMenu}>
            <Image
              src={logoSrc}
              alt={`${businessName} logo`}
              width={260}
              height={78}
              className="h-14 w-auto object-contain sm:h-16"
              priority
            />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) =>
              isServicesNavItem(link) && serviceLinks.length > 0 ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => {
                    setServicesMenuOpen(true);
                    setActiveServiceId((current) => {
                      if (current) return current;
                      const firstWithAreas = serviceLinks.find((s) => s.areas.length > 0);
                      return firstWithAreas?.id ?? null;
                    });
                  }}
                  onMouseLeave={() => {
                    setServicesMenuOpen(false);
                    setActiveServiceId(null);
                  }}
                >
                  <Link
                    href={link.href}
                    className={`${navLinkClass} inline-flex items-center gap-1`}
                    aria-haspopup="menu"
                    aria-expanded={servicesMenuOpen}
                  >
                    {link.name}
                    <ChevronIcon
                      className={`h-4 w-4 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>

                  {servicesMenuOpen && (
                    <div className="absolute left-0 top-full z-50 pt-1" role="menu">
                      <div className="flex items-stretch shadow-2xl">
                        {/* Primary panel — services list */}
                        <div
                          className="min-w-[15.5rem] py-2"
                          style={{ backgroundColor: menuPanelDark, color: menuTextLight }}
                        >
                          <Link
                            href={link.href}
                            className="flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors"
                            style={{ color: menuTextLight }}
                            role="menuitem"
                            onMouseEnter={() => setActiveServiceId(null)}
                          >
                            All Services
                          </Link>
                          {serviceLinks.map((service) => {
                            const isActive = activeServiceId === service.id;
                            const hasAreas = service.areas.length > 0;
                            return (
                              <Link
                                key={service.id}
                                href={service.href}
                                className="flex items-center justify-between gap-3 px-5 py-3 text-sm font-medium transition-colors"
                                style={{
                                  backgroundColor: isActive ? menuHoverBg : 'transparent',
                                  color: isActive ? menuHoverText : menuTextLight,
                                }}
                                role="menuitem"
                                onMouseEnter={() => setActiveServiceId(hasAreas ? service.id : null)}
                              >
                                <span>{service.name}</span>
                                {hasAreas && (
                                  <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                                )}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Secondary panel — serving areas */}
                        {hoveredService && hoveredService.areas.length > 0 && (
                          <div
                            className="min-w-[13.5rem] border-l border-gray-200 py-2"
                            style={{ backgroundColor: submenuBg, color: submenuText }}
                            role="menu"
                          >
                            {hoveredService.areas.map((area) => (
                              <Link
                                key={area.id}
                                href={area.href}
                                className="block px-5 py-3 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--wb-primary)_8%,transparent)]"
                                style={{ color: submenuText }}
                                role="menuitem"
                              >
                                {area.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href} className={navLinkClass}>
                  {link.name}
                </Link>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--wb-text-main)] transition-colors hover:bg-[color-mix(in_srgb,var(--wb-primary)_10%,transparent)] hover:text-[var(--wb-primary)] md:hidden"
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
          <div className="border-t border-gray-100 pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) =>
                isServicesNavItem(link) && serviceLinks.length > 0 ? (
                  <div key={link.href}>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      className={`${mobileNavLinkClass} flex w-full items-center justify-between`}
                      aria-expanded={mobileServicesOpen}
                    >
                      <span>{link.name}</span>
                      <ChevronIcon
                        className={`h-4 w-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileServicesOpen && (
                      <div
                        className="ml-1 mt-1 overflow-hidden rounded-lg"
                        style={{ backgroundColor: menuPanelDark }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className="block px-4 py-3 text-sm font-medium"
                          style={{ color: menuTextLight }}
                        >
                          All Services
                        </Link>
                        {serviceLinks.map((service) => (
                          <div key={service.id}>
                            {service.areas.length > 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setMobileExpandedServiceId((current) =>
                                      current === service.id ? null : service.id
                                    )
                                  }
                                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                                  style={{
                                    backgroundColor:
                                      mobileExpandedServiceId === service.id
                                        ? menuHoverBg
                                        : 'transparent',
                                    color:
                                      mobileExpandedServiceId === service.id
                                        ? menuHoverText
                                        : menuTextLight,
                                  }}
                                  aria-expanded={mobileExpandedServiceId === service.id}
                                >
                                  <span>{service.name}</span>
                                  <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
                                </button>
                                {mobileExpandedServiceId === service.id && (
                                  <div
                                    className="border-t border-white/10 py-1"
                                    style={{ backgroundColor: submenuBg }}
                                  >
                                    <Link
                                      href={service.href}
                                      onClick={closeMenu}
                                      className="block px-5 py-2.5 text-xs font-medium"
                                      style={{ color: submenuText }}
                                    >
                                      View service
                                    </Link>
                                    {service.areas.map((area) => (
                                      <Link
                                        key={area.id}
                                        href={area.href}
                                        onClick={closeMenu}
                                        className="block px-5 py-2.5 text-sm"
                                        style={{ color: submenuText }}
                                      >
                                        {area.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={service.href}
                                onClick={closeMenu}
                                className="block px-4 py-3 text-sm font-medium"
                                style={{ color: menuTextLight }}
                              >
                                {service.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href} onClick={closeMenu} className={mobileNavLinkClass}>
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
