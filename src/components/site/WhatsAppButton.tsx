import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { settingsQuery } from "@/lib/catalog.queries";
import { buildGeneralMessage, whatsappHref } from "@/lib/whatsapp";
import { defaultSettings } from "@/lib/catalog.functions";

export function useSettings() {
  const { data } = useQuery(settingsQuery);
  return data ?? defaultSettings;
}

/** Generic "chat with us" link — used in header, footer and hero. */
export function WhatsAppLink({
  className,
  children,
  label,
}: {
  className?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  const settings = useSettings();
  const href = whatsappHref(settings, buildGeneralMessage(settings.whatsappGreeting));
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ?? "Chat on WhatsApp"}
      className={className}
    >
      {children ?? (
        <>
          <MessageCircle className="size-4" />
          Order via WhatsApp
        </>
      )}
    </a>
  );
}

export function FloatingWhatsApp() {
  const settings = useSettings();
  if (!settings.floatingWhatsapp) return null;
  const href = whatsappHref(settings, buildGeneralMessage(settings.whatsappGreeting));
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BIZZAG on WhatsApp"
      className="fixed right-4 bottom-20 z-50 grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 sm:bottom-6"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
