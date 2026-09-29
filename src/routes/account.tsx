import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, MapPin, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [
    { title: "My Profile — BIZZAG" },
    { name: "description", content: "Save your BIZZAG delivery details for quicker WhatsApp orders." },
    { property: "og:title", content: "My Profile — BIZZAG" },
    { property: "og:description", content: "Save delivery details for quicker BIZZAG orders." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AccountPage,
});

type ProfileForm = { full_name: string; phone: string; address_line: string; city: string; state: string; postal_code: string };
const emptyProfile: ProfileForm = { full_name: "", phone: "", address_line: "", city: "", state: "", postal_code: "" };

function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setUser(data.user);
      if (data.user) {
        const { data: row } = await supabase.from("profiles").select("full_name,phone,address_line,city,state,postal_code").eq("user_id", data.user.id).maybeSingle();
        if (active && row) setProfile(row);
      }
      if (active) setLoading(false);
    }
    void load();
    const { data: listener } = supabase.auth.onAuthStateChange(() => void load());
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function signIn() {
    setMessage("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/account`, extraParams: { prompt: "select_account" } });
    if (result.error) setMessage("Google sign-in could not start. Please try again.");
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("profiles").upsert({ user_id: user.id, ...profile, avatar_url: String(user.user_metadata.avatar_url ?? "") });
    setMessage(error ? "Could not save your address. Please try again." : "Delivery details saved.");
    setSaving(false);
  }

  if (loading) return <div className="mx-auto min-h-[55vh] max-w-xl px-5 py-16 text-sm text-muted-foreground">Loading your profile…</div>;

  if (!user) return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg items-center px-5 py-12">
      <div className="w-full border-y border-border py-10 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-secondary"><UserRound className="size-5" /></div>
        <h1 className="mt-5 text-3xl font-black uppercase">Your BIZZAG profile</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Sign in once, save your delivery address, and send complete orders to WhatsApp faster.</p>
        <Button onClick={signIn} className="mt-7 h-12 w-full max-w-xs">Continue with Google</Button>
        {message ? <p className="mt-3 text-sm text-destructive">{message}</p> : null}
      </div>
    </section>
  );

  const field = (key: keyof ProfileForm, label: string, autoComplete: string) => (
    <label className="block text-sm font-medium">{label}<input required value={profile[key]} autoComplete={autoComplete} onChange={(e) => setProfile((current) => ({ ...current, [key]: e.target.value }))} className="bizzag-input mt-1.5 w-full" /></label>
  );

  return (
    <section className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
        <div><p className="eyebrow">MY ACCOUNT</p><h1 className="mt-2 text-3xl font-black uppercase">Delivery profile</h1><p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}</p></div>
        <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}><LogOut /> Sign out</Button>
      </div>
      <form onSubmit={save} className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2 flex items-center gap-2 text-sm font-bold"><MapPin className="size-4 text-accent" /> Saved for WhatsApp checkout</div>
        {field("full_name", "Full name", "name")}
        {field("phone", "Phone number", "tel")}
        <div className="sm:col-span-2">{field("address_line", "House, street and area", "street-address")}</div>
        {field("city", "City", "address-level2")}
        {field("state", "State", "address-level1")}
        {field("postal_code", "PIN code", "postal-code")}
        <div className="self-end"><Button type="submit" disabled={saving} className="h-12 w-full">{saving ? "Saving…" : "Save delivery details"}</Button></div>
        {message ? <p className="sm:col-span-2 text-sm text-muted-foreground">{message}</p> : null}
      </form>
    </section>
  );
}