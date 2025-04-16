// ✅ app/profile/[userId]/page.tsx

import ProfilePageClient from './ProfilePageClient';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProfilePageClient userId={resolvedParams.userId} />;
}
