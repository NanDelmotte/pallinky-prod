// src/app/e/[slug]/thanks/page.tsx
"use client"; // Added client for copy functionality
import Link from "next/link";
import Shell from "@/components/Shell";
import { useParams, useSearchParams } from "next/navigation";

export default function ThanksPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "yes";
  const isNo = status === "no";

  // Logic to build the specific "Yippee" text
  const getShareText = () => {
    const protocol = window.location.hostname === "localhost" ? "http" : "https";
    const url = `${protocol}://${window.location.host}/e/${params.slug}`;
    const slugStr = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const namePart = slugStr.split('-')[0];
    return `${url} Yippee! ${namePart} is inviting you! Click here to RSVP.`;
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(getShareText());
    alert("Invite copied to clipboard!");
  };

  return (
    <Shell
      title={isNo ? "Thanks for letting them know" : "You’re in"}
      subtitle={isNo ? "Appreciated." : "See you there."}
      tightCard
    >
      <div className="c-stack" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>{isNo ? "🫶" : "🎉"}</div>

       
        <Link href={`/e/${params.slug}/details`} className="c-btnPrimary">
          View guest list & details
        </Link>
      </div>
    </Shell>
  );
}