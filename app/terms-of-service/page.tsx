'use client';

import { LegalPageLayout } from '@/app/components/layout/LegalPageLayout';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

export default function TermsOfServicePage() {
  const { site } = useWebBuilder();
  const termsOfService = site?.legal?.termsOfService;

  return (
    <LegalPageLayout
      title={termsOfService?.heading || 'Terms of Service'}
      description={termsOfService?.description}
      content={termsOfService?.content}
      emptyTitle="Terms of Service coming soon"
      emptyDescription="This page will be updated from the Website Builder. Contact us if you have any questions in the meantime."
      emptyIcon="document"
    />
  );
}
