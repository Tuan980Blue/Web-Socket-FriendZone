// ✅ app/profile/[userId]/page.tsx

import ProfilePageClient from './ProfilePageClient';

type Props = {
  params: { userId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ProfilePage({ params }: Props) {
  return <ProfilePageClient userId={params.userId} />;
}
