import { getUserProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/app/components/private/profile-form";
import Link from "next/link";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard">Home</Link>
          </li>
          <li>
            <Link href="/profile">Perfil</Link>
          </li>
        </ul>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
