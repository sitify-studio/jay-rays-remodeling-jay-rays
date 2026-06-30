import { NextResponse } from 'next/server';
import {
  BUILDER_NO_CACHE_HEADERS,
  fetchPublicSite,
  resolveRobotsTxt,
  resolveSiteBaseUrl,
} from '@/app/lib/webbuilder-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = resolveSiteBaseUrl();

  try {
    const site = await fetchPublicSite();
    const robotsTxt = resolveRobotsTxt(site, baseUrl);

    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        ...BUILDER_NO_CACHE_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return new NextResponse(`User-agent: *\nDisallow:\nSitemap: ${baseUrl}/sitemap.xml`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        ...BUILDER_NO_CACHE_HEADERS,
      },
    });
  }
}
