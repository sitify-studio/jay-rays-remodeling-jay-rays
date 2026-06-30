'use client';

import { useMemo } from 'react';
import { Manrope, Cormorant } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type { Page, Service } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '@/app/hooks/useScrollAnimation';
import { useThemeColors } from '@/app/hooks/useTheme';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';
import { resolveServiceSlug } from '@/app/lib/serviceAreaSlugs';

const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/6195895/pexels-photo-6195895.jpeg';

type DisplayService = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

interface ServicesSectionProps {
  servicesSection?: Page['servicesSection'];
  companyDetailSection?: Page['companyDetailSection'];
  ctaSection?: Page['ctaSection'];
  page?: Page | null;
  className?: string;
  linkable?: boolean;
}

function formatServicePrice(service: Service): string {
  if (service.price?.trim()) return service.price.trim();
  if (service.priceType === 'quote') return 'Quote';
  if (service.priceType === 'range') return 'Custom';
  return '';
}

function mapLiveService(service: Service): DisplayService {
  const imageUrl = service.thumbnailImage?.url
    ? getImageSrc(service.thumbnailImage.url)
    : service.galleryImages?.[0]?.url
      ? getImageSrc(service.galleryImages[0].url)
      : FALLBACK_IMAGE;

  return {
    name: service.name,
    description: tiptapToText(service.shortDescription),
    price: formatServicePrice(service),
    imageUrl,
    imageAlt:
      service.thumbnailImage?.altText ||
      service.galleryImages?.[0]?.altText ||
      service.name,
    href: `/service/${resolveServiceSlug(service)}`,
  };
}

export function ServicesSection({
  servicesSection,
  className,
  linkable = true,
}: ServicesSectionProps) {
  const { services: liveServices } = useWebBuilder();
  const colors = useThemeColors();
  const primary = colors.primaryButton;
  const secondary = colors.mainText;
  const accent = colors.hoverActive;

  const title = useMemo(() => tiptapToText(servicesSection?.title), [servicesSection?.title]);
  const description = useMemo(
    () => tiptapToText(servicesSection?.description),
    [servicesSection?.description]
  );

  const services = useMemo<DisplayService[]>(() => {
    const published = (liveServices ?? []).filter((s) => s.status === 'published');
    const filtered = servicesSection?.serviceIds?.length
      ? published.filter((s) => servicesSection.serviceIds.includes(s._id))
      : published;
    return filtered.map(mapLiveService);
  }, [liveServices, servicesSection?.serviceIds]);

  const { ref: titleRef, isVisible: titleVisible } =
    useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 });
  const { ref: descRef, isVisible: descVisible } =
    useScrollAnimation<HTMLParagraphElement>({ threshold: 0.2 });
  const { ref: gridRef, visibleItems } = useStaggeredAnimation(services.length, 180);

  if (!servicesSection || servicesSection.enabled === false) return null;
  if (!title && !description && services.length === 0) return null;

  return (
    <section
      id="services"
      className={cn('py-12 lg:py-16 relative overflow-hidden', className)}
      style={{ backgroundColor: colors.pageBackground }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[var(--wb-primary)] rounded-full opacity-20 animate-float"
            style={{
              left: `${4 + i * 5.3}%`,
              top: `${8 + i * 5.1}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${5 + i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-20 left-10 w-16 h-16 opacity-15">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--wb-primary)] animate-sway">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 w-14 h-14 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--wb-primary)] animate-breathe">
          <path d="M25,50 Q37,25 50,50 Q63,25 75,50 Q63,75 50,50 Q37,75 25,50" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 lg:mb-10">
          <div
            className={`inline-flex items-center justify-center w-18 h-18 rounded-full mb-8 transition-all duration-1000 ${titleVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-45'}`}
            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
          >
            <svg className="w-9 h-9 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>

          {title && (
            <h2
              ref={titleRef}
              className={`${cormorant.className} inline-block w-fit bg-clip-text text-transparent text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 transition-all duration-1000 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                backgroundImage: `linear-gradient(135deg, ${secondary} 0%, ${primary} 100%)`,
              }}
            >
              {title}
            </h2>
          )}

          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px bg-[color-mix(in_srgb,var(--wb-primary)_20%,transparent)]" />
            <div className="w-4 h-4 bg-[var(--wb-primary)] rounded-full mx-6 animate-pulse" />
            <div className="w-16 h-px bg-[color-mix(in_srgb,var(--wb-primary)_20%,transparent)]" />
          </div>

          {description && (
            <p
              ref={descRef}
              className={`${manrope.className} text-lg md:text-xl text-[var(--wb-text-secondary)] max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {description}
            </p>
          )}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch"
        >
          {services.map((service, index) => {
            const card = (
              <div className="relative rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border border-[color-mix(in_srgb,var(--wb-primary)_10%,transparent)]" style={{ backgroundColor: colors.pageBackground }}>
                <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
                  <Image
                    src={service.imageUrl}
                    alt={service.imageAlt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />

                  {service.price && (
                    <div
                      className="absolute top-4 right-4 bg-white rounded-2xl px-4 py-2 animate-bounce"
                      style={{ animationDelay: `${index * 0.3}s`, animationDuration: '3s' }}
                    >
                      <span className={`${cormorant.className} text-[var(--wb-text-main)] font-bold text-lg`}>
                        {service.price}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-[var(--wb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className={`${cormorant.className} inline-block w-fit bg-clip-text text-transparent text-2xl md:text-3xl font-semibold leading-tight transition-colors duration-300 mb-3`}
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${secondary} 0%, ${primary} 100%)`,
                    }}
                  >
                    {service.name}
                  </h3>

                  {service.description && (
                    <p className={`${manrope.className} text-[var(--wb-text-secondary)] leading-relaxed line-clamp-3`}>
                      {service.description}
                    </p>
                  )}

                  <div className="hidden group-hover:flex items-center justify-center space-x-2 pt-4 transition-opacity duration-500">
                    <div className="w-2 h-2 bg-[var(--wb-primary)] rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                    <div className="w-8 h-px bg-[color-mix(in_srgb,var(--wb-primary)_20%,transparent)]" />
                    <div className="w-3 h-3 bg-[var(--wb-primary-hover)] rounded-full animate-pulse" />
                    <div className="w-8 h-px bg-[color-mix(in_srgb,var(--wb-primary)_20%,transparent)]" />
                    <div className="w-2 h-2 bg-[color-mix(in_srgb,var(--wb-primary)_40%,transparent)] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>

                <div
                  className="absolute -top-3 -right-3 w-8 h-8 bg-[var(--wb-primary)] rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );

            return (
              <div
                key={service.href}
                className={`group relative h-full transition-all duration-1000 ${visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 180}ms` }}
              >
                {linkable ? (
                  <Link href={service.href} className="block h-full">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-sway { animation: sway 12s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

export default ServicesSection;
