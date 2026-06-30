import { NextResponse } from 'next/server';
import {
  BUILDER_NO_CACHE_HEADERS,
  fetchPublicSite,
} from '@/app/lib/webbuilder-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const site = await fetchPublicSite();

    return NextResponse.json(
      {
        success: true,
        data: {
          legal: site.legal || {},
          files: site.files || {},
          updatedAt: site.updatedAt,
        },
      },
      { headers: BUILDER_NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error fetching legal files:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch legal files' } },
      { status: 500, headers: BUILDER_NO_CACHE_HEADERS }
    );
  }
}
