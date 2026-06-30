'use client';

import { OptimizedImage, IMAGE_SIZES } from '@/app/components/ui/OptimizedImage';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Page } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { resolvePrimaryCta } from '@/app/components/ui/made';
import { cn, getImageSrc } from '@/app/lib/utils';
import { tiptapToText } from '@/app/lib/seo';

interface AboutSectionProps {
  aboutSection?: Page['aboutSection'];
  page?: Page | null;
  className?: string;
}

export function AboutSection({ aboutSection, page, className }: AboutSectionProps) {
  const { site, pages } = useWebBuilder();
  const theme = useSectionTheme();

  const title = useMemo(() => tiptapToText(aboutSection?.title), [aboutSection?.title]);
  const description = useMemo(
    () => tiptapToText(aboutSection?.description),
    [aboutSection?.description]
  );
  const features = useMemo(
    () => aboutSection?.features?.filter((f) => f?.label?.trim()).map((f) => f.label.trim()) ?? [],
    [aboutSection?.features]
  );
  const ctaButton = useMemo(
    () => resolvePrimaryCta(page ?? null, site, pages) ?? { href: '#contact', label: 'Learn More' },
    [page, site, pages]
  );
  const image = useMemo(() => {
    const url = aboutSection?.image?.url;
    return url ? getImageSrc(url) : undefined;
  }, [aboutSection?.image?.url]);
  const imageAlt = aboutSection?.image?.altText?.trim() || 'About us';

  const { ref: titleRef, isVisible: titleVisible } =
    useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 });
  const { ref: descRef, isVisible: descVisible } =
    useScrollAnimation<HTMLParagraphElement>({ threshold: 0.2 });
  const { ref: featuresRef, visibleItems } = useStaggeredAnimation(features.length, 100);
  const { ref: imageRef, isVisible: imageVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  if (!aboutSection || aboutSection.enabled === false) return null;
  if (!title && !description && !image && features.length === 0) return null;

  const ctaIsExternal =
    ctaButton.href.startsWith('http') ||
    ctaButton.href.startsWith('mailto:') ||
    ctaButton.href.startsWith('tel:');

  const ctaClassName = cn(
    'inline-block px-10 py-5 font-medium text-sm tracking-wide uppercase transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 group relative overflow-hidden rounded-xl',
    descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  );
  const ctaStyle = {
    ...theme.styles.primaryCta,
    fontFamily: theme.fonts.body,
    transitionDelay: `${900 + features.length * 120}ms`,
  };

  return (
    <section
      id="about"
      className={cn('py-20 lg:py-28 relative overflow-hidden', className)}
      style={{ fontFamily: theme.fonts.body, backgroundColor: theme.colors.pageBackground }}
    >
      <div className="absolute inset-0" style={theme.styles.sectionGradientBg} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-25 animate-float"
            style={{
              ...theme.styles.floatingDot,
              left: `${8 + i * 9}%`,
              top: `${12 + i * 8}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-16 left-6 w-20 h-20 opacity-15">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-sway"
          style={{ color: theme.colors.primaryButton }}
        >
          <path d="M25,75 Q35,25 50,45 Q65,25 75,75" fill="none" stroke="currentColor" strokeWidth="2" />
          <ellipse cx="30" cy="40" rx="5" ry="10" fill="currentColor" transform="rotate(-25 30 40)" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
          <ellipse cx="50" cy="30" rx="6" ry="12" fill="currentColor" transform="rotate(0 50 30)" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
          <ellipse cx="70" cy="40" rx="5" ry="10" fill="currentColor" transform="rotate(25 70 40)" className="animate-pulse" style={{ animationDelay: '1.8s' }} />
        </svg>
      </div>

      <div className="absolute bottom-16 right-6 w-18 h-18 opacity-20">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-breathe"
          style={{ color: theme.colors.primaryButton }}
        >
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="animate-ping" style={{ animationDelay: '0s' }} />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" className="animate-ping" style={{ animationDelay: '1s' }} />
          <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left — image */}
          <div
            ref={imageRef}
            className={cn(
              'transition-all duration-1000 delay-200',
              imageVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            )}
          >
            {image ? (
              <div className="relative group">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                  <OptimizedImage
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes={IMAGE_SIZES.portrait}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3s' }}>
                  <svg className="w-5 h-5" style={theme.styles.accentText} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full animate-pulse" style={theme.styles.floatingDot} />
                <div className="absolute top-1/4 -left-4 w-4 h-4 bg-white rounded-full shadow-md animate-float" style={{ animationDelay: '1.5s' }} />
                <div
                  className="absolute bottom-1/3 -right-2 w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: theme.colors.hoverActive, opacity: 0.8 }}
                />
              </div>
            ) : (
              <div className="relative">
                <div
                  className="aspect-[4/5] rounded-3xl flex items-center justify-center relative overflow-hidden hover:scale-[1.02] transition-all duration-500 shadow-2xl group"
                  style={theme.styles.imagePlaceholder}
                >
                  <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '0s', animationDuration: '4s' }}>
                    <svg className="w-7 h-7" style={theme.styles.accentText} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <svg className="w-10 h-10 animate-pulse" style={theme.styles.accentText} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="font-medium text-xs" style={theme.styles.accentText}>Wellness</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — content + CTA */}
          <div className="space-y-8 lg:space-y-10">
            {title && (
              <h2
                ref={titleRef}
                className={cn(
                  'text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold leading-[1.1] transition-all duration-1000 text-center lg:text-left',
                  titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ ...theme.styles.titleGradient, fontFamily: theme.fonts.heading }}
              >
                {title}
              </h2>
            )}

            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-16 h-px" style={theme.styles.dividerLine} />
              <div className="w-4 h-4 rounded-full mx-6 animate-pulse" style={theme.styles.dividerDot} />
              <div className="w-16 h-px" style={theme.styles.dividerLine} />
            </div>

            {description && (
              <p
                ref={descRef}
                className={cn(
                  'text-lg md:text-xl leading-relaxed wb-text-on-light-secondary transition-all duration-1000 delay-300 text-center lg:text-left',
                  descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
              >
                {description}
              </p>
            )}

            {features.length > 0 && (
              <div ref={featuresRef} className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={`${feature}-${index}`}
                    className={cn(
                      'group flex items-start space-x-3 p-4 rounded-2xl backdrop-blur-sm shadow-md border transition-all duration-500 hover:bg-white hover:shadow-lg hover:scale-[1.02]',
                      visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    )}
                    style={{ ...theme.styles.card, transitionDelay: `${500 + index * 120}ms` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-all duration-300"
                      style={theme.styles.iconBadge}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: 'var(--wb-text-on-dark, #fff)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="wb-text-on-light font-medium leading-relaxed group-hover:text-[var(--wb-primary)] transition-colors text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {ctaButton &&
              (ctaIsExternal ? (
                <div className="text-center lg:text-left pt-2">
                  <a href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                    <span className="relative z-10 group-hover:animate-pulse">{ctaButton.label} →</span>
                    <div
                      className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
                      style={{
                        background: `linear-gradient(90deg, ${theme.colors.primaryButton}, ${theme.colors.hoverActive})`,
                      }}
                    />
                  </a>
                </div>
              ) : (
                <div className="text-center lg:text-left pt-2">
                  <Link href={ctaButton.href} className={ctaClassName} style={ctaStyle}>
                    <span className="relative z-10 group-hover:animate-pulse">{ctaButton.label} →</span>
                    <div
                      className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
                      style={{
                        background: `linear-gradient(90deg, ${theme.colors.primaryButton}, ${theme.colors.hoverActive})`,
                      }}
                    />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(2deg);
          }
          75% {
            transform: rotate(-2deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
