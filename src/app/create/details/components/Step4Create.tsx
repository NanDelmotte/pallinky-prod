"use client";

import { useEffect, useState } from "react";
import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function Step4Create({ 
  draft, 
  action, 
  backHref, 
  hiddenInputs 
}: { 
  draft: any; 
  action: any; 
  backHref: string; 
  hiddenInputs: any 
}) {
  const supabase = createSupabaseBrowser();

  // 1. Initialize State from Draft -> LocalStorage -> Empty
  const [name, setName] = useState(() => {
    if (draft.host_name) return draft.host_name;
    if (typeof window !== "undefined") {
      return localStorage.getItem("pallinky_last_name") || "";
    }
    return "";
  });

  const [email, setEmail] = useState(() => {
    if (draft.host_email) return draft.host_email;
    if (typeof window !== "undefined") {
      return localStorage.getItem("pallinky_last_email") || "";
    }
    return "";
  });

  // 2. Fallback to Supabase Session for logged-in users
  useEffect(() => {
    if (!email || !name) {
      const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (!email) setEmail(session.user.email || "");
          // Some providers include the full name in metadata
          if (!name) setName(session.user.user_metadata?.full_name || "");
        }
      };
      fetchSession();
    }
  }, [email, name, supabase.auth]);

  // 3. Intercept the form submission to save to LocalStorage
  const handleFormAction = async (formData: FormData) => {
    const submittedEmail = formData.get("host_email") as string;
    const submittedName = formData.get("host_name") as string;

    if (typeof window !== "undefined") {
      if (submittedEmail) localStorage.setItem("pallinky_last_email", submittedEmail);
      if (submittedName) localStorage.setItem("pallinky_last_name", submittedName);
    }

    return action(formData);
  };

  return (
    <form action={handleFormAction} className="c-stack" style={{ display: "flex", flexDirection: "column", minHeight: 360 }}>
      {hiddenInputs}
      
      <div className="c-stack" style={{ gap: "var(--space-3)" }}>
        <label className="c-field">
          <span className="c-label">Host Name</span>
          <input 
            name="host_name" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name" 
            className="c-input" 
            autoFocus 
          />
        </label>

        <label className="c-field">
          <span className="c-label">Email Address</span>
          <input 
            name="host_email" 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@email.com" 
            className="c-input" 
          />
          <p className="c-help">Your RSVP dashboard link will be sent here.</p>
        </label>
      </div>

      <div style={{ flex: 1 }} />
      
      <BottomNav
        left={<ArrowNav dir="left" kind="link" href={backHref} ariaLabel="Back" />}
        right={<ArrowNav dir="right" kind="submit" ariaLabel="Create invite" />}
      />
    </form>
  );
}