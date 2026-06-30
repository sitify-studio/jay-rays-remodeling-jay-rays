/** Shared slug + link helpers for service area pages. */

import type { Service, ServiceAreaPage } from '@/app/lib/types';

export type ServingAreaNavLink = {
  id: string;
  label: string;
  href: string;
};

function formatAreaLabel(city: string, region: string): string {
  if (!region) return city;
  if (city.toLowerCase().includes(region.toLowerCase())) return city;
  return `${city}, ${region}`;
}

function resolveSlugForAreaPage(page: ServiceAreaPage, services: Service[]): string {
  const fromPage = getServiceSlugFromAreaPage(page);
  if (fromPage) return fromPage;

  const embedded = (page as { service?: { slug?: string; _id?: string } }).service;
  if (embedded?.slug) return resolveServiceSlug({ slug: embedded.slug });
  if (embedded?._id) {
    const svc = services.find((s) => s._id === embedded._id);
    if (svc) return resolveServiceSlug(svc);
  }

  const serviceRef = page.serviceId as string | { slug?: string; _id?: string } | undefined;
  if (serviceRef && typeof serviceRef === 'object' && serviceRef.slug) {
    return resolveServiceSlug({ slug: serviceRef.slug });
  }
  if (typeof serviceRef === 'string') {
    const svc = services.find((s) => s._id === serviceRef);
    if (svc) return resolveServiceSlug(svc);
  }
  if (serviceRef && typeof serviceRef === 'object' && serviceRef._id) {
    const svc = services.find((s) => s._id === serviceRef._id);
    if (svc) return resolveServiceSlug(svc);
  }
  return '';
}

function pageMatchesService(page: ServiceAreaPage, service: Service, services: Service[]): boolean {
  const normSlug = normalizeSlug(resolveServiceSlug(service));
  const pageServiceSlug = resolveSlugForAreaPage(page, services);
  if (pageServiceSlug && normalizeSlug(pageServiceSlug) === normSlug) return true;

  const serviceRef = page.serviceId as string | { _id?: string } | undefined;
  if (typeof serviceRef === 'string' && serviceRef === service._id) return true;
  if (serviceRef && typeof serviceRef === 'object' && serviceRef._id === service._id) return true;

  const embedded = (page as { service?: { _id?: string } }).service;
  if (embedded?._id && embedded._id === service._id) return true;

  return false;
}

function resolvePageCity(page: ServiceAreaPage): string {
  const city = page.city?.trim();
  if (city) return city;
  const slug = page.slug?.trim();
  if (!slug) return '';
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Published serving-area page links for a single service (header nav, etc.). */
export function getServingAreaLinksForService(
  service: Service,
  serviceAreaPages: ServiceAreaPage[] | undefined,
  services: Service[]
): ServingAreaNavLink[] {
  const normSlug = normalizeSlug(resolveServiceSlug(service));
  const result: ServingAreaNavLink[] = [];
  const seen = new Set<string>();

  const pushArea = (city: string, region: string, pageSlug?: string) => {
    const key = `${city.toLowerCase()}|${region.toLowerCase()}|${pageSlug || ''}`;
    if (!city || seen.has(key)) return;
    seen.add(key);
    const areaRef = pageSlug ? { city, region, slug: pageSlug } : { city, region };
    result.push({
      id: `${normSlug}-${key}`,
      label: formatAreaLabel(city, region),
      href: getServiceAreaPageHref(normSlug, areaRef, serviceAreaPages),
    });
  };

  const collectFromPages = (filterPublished: boolean) => {
    (serviceAreaPages ?? []).forEach((page) => {
      if (filterPublished && page.status !== 'published') return;
      if (!pageMatchesService(page, service, services)) return;
      const city = resolvePageCity(page);
      if (!city) return;
      pushArea(city, (page.region || '').trim(), page.slug?.trim());
    });
  };

  collectFromPages(true);
  if (result.length === 0) collectFromPages(false);

  if (result.length === 0) {
    (service.serviceAreas ?? []).forEach((area) => {
      const city = getAreaCity(area);
      if (!city) return;
      pushArea(city, getAreaRegion(area));
    });
  }

  return result.sort((a, b) => a.label.localeCompare(b.label));
}

export function normalizeSlug(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function resolveServiceSlug(service: { slug?: string; name?: string }): string {
  if (typeof service?.slug === 'string' && service.slug.trim()) {
    return normalizeSlug(service.slug);
  }
  return normalizeSlug(service?.name || 'service');
}

export function getAreaCity(area: unknown): string {
  if (typeof area === 'string') return area.trim();
  const city = (area as { city?: string; name?: string })?.city ?? (area as { name?: string })?.name;
  return typeof city === 'string' ? city.trim() : '';
}

export function getAreaRegion(area: unknown): string {
  if (typeof area === 'string') return '';
  const region = (area as { region?: string })?.region;
  return typeof region === 'string' ? region.trim() : '';
}

export function getAreaDisplayName(area: unknown): string {
  const city = getAreaCity(area);
  const region = getAreaRegion(area);
  if (!city) return '';
  return region ? `${city}, ${region}` : city;
}

export function buildAreaSlugCandidates(area: unknown): string[] {
  const seen = new Set<string>();
  const add = (value: string) => {
    const slug = normalizeSlug(value);
    if (slug) seen.add(slug);
  };

  if (area && typeof area === 'object') {
    const record = area as { slug?: string };
    if (record.slug) add(record.slug);
  }

  const city = getAreaCity(area);
  const region = getAreaRegion(area);
  if (city) {
    add(city);
    if (region) add(`${city}-${region}`);
  }

  return [...seen];
}

export function getServiceSlugFromAreaPage(page: {
  serviceId?: { slug?: string } | string;
  serviceSlug?: string;
}): string {
  if (typeof page.serviceSlug === 'string' && page.serviceSlug.trim()) {
    return normalizeSlug(page.serviceSlug);
  }
  if (page.serviceId && typeof page.serviceId === 'object' && page.serviceId.slug) {
    return normalizeSlug(page.serviceId.slug);
  }
  return '';
}

export function findServiceAreaPage(
  serviceAreaPages: unknown[] | undefined,
  serviceSlug: string,
  areaOrCitySlug: unknown
): Record<string, unknown> | undefined {
  if (!serviceAreaPages?.length) return undefined;

  const normService = normalizeSlug(serviceSlug);
  const slugCandidates =
    typeof areaOrCitySlug === 'string' && !getAreaCity(areaOrCitySlug)
      ? [normalizeSlug(areaOrCitySlug)]
      : buildAreaSlugCandidates(areaOrCitySlug);

  const cityLower = getAreaCity(areaOrCitySlug).toLowerCase();

  return serviceAreaPages.find((raw) => {
    const page = raw as { slug?: string; city?: string; serviceId?: { slug?: string }; serviceSlug?: string };
    if (getServiceSlugFromAreaPage(page) !== normService) return false;
    const pageSlug = normalizeSlug(page.slug || '');
    if (slugCandidates.some((c) => c === pageSlug)) return true;
    if (cityLower && (page.city || '').trim().toLowerCase() === cityLower) return true;
    return false;
  }) as Record<string, unknown> | undefined;
}

export const SERVICE_AREA_ROUTE_SEGMENT = 'service-areas';

export function getServiceAreaPageHref(
  serviceSlug: string,
  area: unknown,
  serviceAreaPages?: unknown[]
): string {
  const normService = normalizeSlug(serviceSlug);
  const matched = findServiceAreaPage(serviceAreaPages, normService, area);
  const citySlug = matched?.slug
    ? normalizeSlug(String(matched.slug))
    : buildAreaSlugCandidates(area)[0] || 'area';

  return `/service/${normService}/${SERVICE_AREA_ROUTE_SEGMENT}/${citySlug}`;
}
