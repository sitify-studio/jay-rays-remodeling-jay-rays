import { NextResponse } from 'next/server';
import {
  BUILDER_NO_CACHE_HEADERS,
  fetchPublicSite,
  resolveSchemaDocuments,
  resolveSiteBaseUrl,
} from '@/app/lib/webbuilder-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const site = await fetchPublicSite();
    const baseUrl = resolveSiteBaseUrl();
    const schemaJson = resolveSchemaDocuments(site, baseUrl);

    return NextResponse.json(schemaJson, {
      headers: {
        'Content-Type': 'application/ld+json',
        ...BUILDER_NO_CACHE_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error generating schema.json:', error);
    return NextResponse.json([], {
      status: 500,
      headers: {
        'Content-Type': 'application/ld+json',
        ...BUILDER_NO_CACHE_HEADERS,
      },
    });
  }
}
