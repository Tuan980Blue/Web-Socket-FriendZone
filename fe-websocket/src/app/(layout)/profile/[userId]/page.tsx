// ✅ app/profile/[userId]/page.tsx

import ProfilePageClient from './ProfilePageClient';

type Props = {
  params: { userId: string };
};

export default async function ProfilePage({ params }: Props) {
  return <ProfilePageClient userId={params.userId} />;
}
