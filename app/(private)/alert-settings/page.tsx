import { getUserProfile } from "@/actions/profile";
import { NotificationPreferencesPanel } from "@/components/private/notification-preferences";
import Link from "next/link";

export default async function AlertSettingsPage() {
  const profile = await getUserProfile();

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/dashboard">Home</Link>
          </li>
          <li>
            <Link href="/alert-settings">Configurações</Link>
          </li>
        </ul>
      </div>

      <NotificationPreferencesPanel phoneNumber={profile?.phoneNumber} />
    </div>
  );
}
