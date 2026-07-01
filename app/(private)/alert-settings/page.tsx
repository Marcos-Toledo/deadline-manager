import { NotificationPreferencesPanel } from "@/app/components/private/notification-preferences";
import Link from "next/link";

export default function AlertSettingsPage() {
  return (
    <div>
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

      <NotificationPreferencesPanel />
    </div>
  );
}
