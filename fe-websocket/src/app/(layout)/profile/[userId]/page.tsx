// ✅ app/profile/[userId]/page.tsx

import ProfilePageClient from './ProfilePageClient';

interface PageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: PageProps) {
  return <ProfilePageClient userId={params.userId} />;
}
