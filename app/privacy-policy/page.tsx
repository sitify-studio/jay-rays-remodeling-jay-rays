'use client';

import { LegalPageLayout } from '@/app/components/layout/LegalPageLayout';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

export default function PrivacyPolicyPage() {
  const { site } = useWebBuilder();
  const privacyPolicy = site?.legal?.privacyPolicy;

  return (
    <LegalPageLayout
      title={privacyPolicy?.heading || 'Privacy Policy'}
      description={privacyPolicy?.description}
      content={privacyPolicy?.content}
      emptyTitle="Privacy Policy coming soon"
      emptyDescription="This page will be updated from the Website Builder. Contact us if you have any questions in the meantime."
      emptyIcon="shield"
    />
  );
}
