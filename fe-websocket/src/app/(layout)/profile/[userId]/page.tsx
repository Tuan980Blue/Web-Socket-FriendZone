// ✅ app/profile/[userId]/page.tsx

import ProfilePageClient from './ProfilePageClient';

interface PageProps {
  params: {
    userId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ProfilePage({ params }: PageProps) {
  return <ProfilePageClient userId={params.userId} />;
}
