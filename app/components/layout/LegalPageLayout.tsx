'use client';

import Link from 'next/link';
import { Cormorant, Manrope } from 'next/font/google';
import { useMemo } from 'react';
import { Footer } from '@/app/components/layout/Footer';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { useSectionTheme } from '@/app/hooks/useSectionTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { cn } from '@/app/lib/utils';

const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
});

type LegalPageLayoutProps = {
  title: string;
  description?: string;
  content?: unknown;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: 'shield' | 'document';
};

function EmptyIcon({ type }: { type: 'shield' | 'document' }) {
  if (type === 'shield') {
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 3l7.5 3v5.5c0 4.15-2.55 7.95-7.5 9-4.95-1.05-7.5-4.85-7.5-9V6L12 3z"
      />
    );
  }

  return (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14 3v5h5" />
    </>
  );
}

export function LegalPageLayout({
  title,
  description,
  content,
  emptyTitle,
  emptyDescription,
  emptyIcon,
}: LegalPageLayoutProps) {
  const { site } = useWebBuilder();
  const theme = useSectionTheme();

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>({
    threshold: 0.3,
  });
  const { ref: descRef, isVisible: descVisible } = useScrollAnimation<HTMLParagraphElement>({
    threshold: 0.3,
  });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.15,
  });

  const lastUpdated = useMemo(() => {
    if (!site?.updatedAt) return new Date().toLocaleDateString(undefined, { dateStyle: 'long' });
    return new Date(site.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' });
  }, [site?.updatedAt]);

  const hasContent = Boolean(content);

  return (
    <div
      className="min-h-screen selection:bg-black/10 selection:text-inherit"
      style={{
        backgroundColor: theme.colors.pageBackground,
        color: theme.colors.mainText,
        fontFamily: theme.fonts.body,
      }}
    >
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full opacity-20 animate-float"
              style={{
                ...theme.styles.floatingDot,
                left: `${15 + i * 12}%`,
                top: `${20 + i * 10}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              ref={titleRef}
              className={cn(
                cormorant.className,
                'mb-6 text-4xl font-bold leading-[1.1] transition-all duration-1000 md:text-5xl lg:text-6xl',
                titleVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
              style={theme.styles.titleGradient}
            >
              {title}
            </h1>

            {description && (
              <p
                ref={descRef}
                className={cn(
                  manrope.className,
                  'mx-auto max-w-2xl text-base leading-relaxed transition-all duration-1000 delay-200 md:text-lg',
                  descVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                )}
                style={{ color: theme.colors.secondaryText }}
              >
                {description}
              </p>
            )}

            <div
              className="mx-auto mt-8 h-px w-16 transition-all duration-1000 delay-300"
              style={theme.styles.dividerGradient}
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-12 lg:py-20">
        <div className="absolute inset-0" style={theme.styles.sectionGradientBg} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full opacity-20 animate-float"
              style={{
                ...theme.styles.floatingDot,
                left: `${10 + i * 10}%`,
                top: `${15 + i * 9}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${3.5 + i * 0.4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={contentRef}
            className={cn(
              'mx-auto max-w-4xl rounded-2xl border p-8 shadow-lg transition-all duration-1000 sm:p-10 lg:p-12',
              contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
            style={theme.styles.cardSolid}
          >
            {hasContent ? (
              <div
                className={cn(
                  manrope.className,
                  'legal-prose space-y-6 text-base leading-relaxed',
                  '[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--wb-text-main)]',
                  '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--wb-text-main)]',
                  '[&_p]:text-[var(--wb-text-secondary)]',
                  '[&_li]:text-[var(--wb-text-secondary)]',
                  '[&_a]:font-medium [&_a]:text-[var(--wb-primary)] [&_a]:underline [&_a]:underline-offset-2',
                  '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
                  '[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5'
                )}
                style={{ color: theme.colors.secondaryText }}
              >
                <TiptapRenderer content={content} />
              </div>
            ) : (
              <div className="py-10 text-center">
                <div
                  className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full"
                  style={theme.styles.statCircle}
                >
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <EmptyIcon type={emptyIcon} />
                  </svg>
                </div>
                <h2
                  className={cn(cormorant.className, 'mb-3 text-2xl font-semibold')}
                  style={{ color: theme.colors.mainText }}
                >
                  {emptyTitle}
                </h2>
                <p
                  className={cn(manrope.className, 'mx-auto mb-8 max-w-md text-sm leading-relaxed')}
                  style={{ color: theme.colors.secondaryText }}
                >
                  {emptyDescription}
                </p>
                <Link
                  href="/contact-us"
                  className="group relative inline-block overflow-hidden rounded-xl px-10 py-4 text-sm font-medium uppercase tracking-wide transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
                  style={theme.styles.primaryCta}
                >
                  <span className="relative z-10">Contact Us</span>
                  <div
                    className="absolute inset-0 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-0"
                    style={{
                      background: `linear-gradient(to right, ${theme.colors.primaryButton}, ${theme.colors.hoverActive})`,
                    }}
                  />
                </Link>
              </div>
            )}

            <div
              className="mt-10 border-t pt-6 text-center text-sm"
              style={{
                borderColor: 'color-mix(in srgb, var(--wb-primary) 12%, transparent)',
                color: theme.colors.secondaryText,
              }}
            >
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LegalPageLayout;
