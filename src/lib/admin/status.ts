import { statusLabel } from "@/lib/i18n/dictionaries";
import { ADMIN_LOCALE } from "@/lib/admin/locale";

export function adminStatusLabel(status: string) {
  return statusLabel(ADMIN_LOCALE, status);
}
