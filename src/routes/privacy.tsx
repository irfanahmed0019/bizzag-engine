import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy | BIZZAG" }, { name: "description", content: "How BIZZAG collects, uses and protects your personal information." }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Privacy Policy"
      updated="28 October 2026"
      intro="This page explains what personal information BIZZAG collects when you use this website, why, and the choices you have."
      sections={[
        { title: "What we collect", body: (<>
          <p>Only what we need to answer you and deliver your order:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Contact form: your name, email, optional phone number, subject and message.</li>
            <li>Orders: orders are placed on WhatsApp. What you share there (name, delivery address, phone number, payment confirmation) goes directly to us in that chat.</li>
            <li>Google sign-in, where offered: your name, email and profile picture from your Google account, and any delivery details you choose to save in your profile.</li>
            <li>Your cart: items you add are saved in your own browser (local storage) so they are still there when you return.</li>
          </ul>
          <p>We do not ask for card details on this website, and nothing is paid on it. We do not run advertising or analytics trackers.</p></>) },
        { title: "How we use it", body: <p>To reply to you, confirm and deliver orders, handle exchanges, and keep the website working. We do not sell your personal information.</p> },
        { title: "Cookies and local storage", body: <p>The website uses only what it needs to work: your cart in local storage, and a sign-in session if you choose to sign in. We do not set advertising or tracking cookies, so there is no cookie consent banner. If that changes, we will ask for your consent first.</p> },
        { title: "Who we share it with", body: (<>
          <p>Only with the services needed to run the shop:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>WhatsApp (Meta), where you chat with us to place an order.</li>
            <li>Our hosting and database provider, which stores contact messages and saved profiles for us.</li>
            <li>Google, if you choose to sign in with Google.</li>
            <li>Courier partners, who receive your name, address and phone number to deliver your parcel.</li>
          </ul>
          <p>We may also share information if the law requires it.</p></>) },
        { title: "How long we keep it", body: <p>We keep messages and order details as long as needed to serve you and handle any issue with an order, then delete them or keep only what the law requires. You can ask us to delete your saved profile at any time.</p> },
        { title: "Your choices", body: <p>Under India&apos;s Digital Personal Data Protection Act, 2023 you can ask what personal data we hold about you, ask us to correct or delete it, or withdraw your consent. Message us on WhatsApp at +91 62385 63188 or use the Contact page.</p> },
        { title: "Children", body: <p>This website is meant for adults. If you are under 18, please order with a parent or guardian.</p> },
        { title: "Changes", body: <p>If we change this policy we will update the date at the top of this page.</p> },
        { title: "Contact", body: <p>BIZZAG, WhatsApp +91 62385 63188, or the Contact page on this website.</p> },
      ]}
    />
  );
}
