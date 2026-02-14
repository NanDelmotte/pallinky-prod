"use client";

import { useEffect, useState } from "react";
import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";
import { subscribeToPush } from "@/lib/notifications";

export function Step4Create({ draft, action, backHref, hiddenInputs }: { draft: any; action: any; backHref: string; hiddenInputs: any }) {
  // 1. Initialize state from draft OR localStorage
  const [name, setName] = useState(draft.host_name || "");
  const [email, setEmail] = useState(draft.host_email || "");
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [pushSubscription, setPushSubscription] = useState<any>(null);

  // 2. Load saved data on mount
  useEffect(() => {
    const savedName = localStorage.getItem("tp_name");
    const savedEmail = localStorage.getItem("tp_email");
    if (!name && savedName) setName(savedName);
    if (!email && savedEmail) setEmail(savedEmail);
  }, []);

  // 3. Save data as it changes
  useEffect(() => {
    localStorage.setItem("tp_name", name);
    localStorage.setItem("tp_email", email);
  }, [name, email]);

  const handlePushToggle = async () => {
    try {
      if (!isPushEnabled) {
        const sub = await subscribeToPush(email);
        setPushSubscription(sub);
        setIsPushEnabled(true);
      } else {
        setIsPushEnabled(false);
        setPushSubscription(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error: Make sure you've added the app to your Home Screen!");
    }
  };

  return (
    <form action={action} className="c-stack" style={{ display: "flex", flexDirection: "column", minHeight: 400 }}>
      {hiddenInputs}
      <input type="hidden" name="push_subscription" value={JSON.stringify(pushSubscription)} />

      <div className="c-stack" style={{ gap: "var(--space-3)" }}>
        <label className="c-field">
          <span className="c-label">Host Name</span>
          <input name="host_name" required value={name} onChange={e => setName(e.target.value)} className="c-input" autoFocus />
        </label>

        <label className="c-field">
          <span className="c-label">Email Address</span>
          <input name="host_email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="c-input" />
        </label>

        <div className="c-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Push Notifications</div>
            <div className="c-help" style={{ marginTop: 0 }}>Notify me when guests RSVP</div>
          </div>
          <button 
            type="button" 
            onClick={handlePushToggle}
            style={{
              width: '50px',
              height: '28px',
              borderRadius: '20px',
              backgroundColor: isPushEnabled ? 'var(--accent)' : '#ccc',
              position: 'relative',
              border: 'none',
              transition: '0.2s'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'white',
              position: 'absolute',
              top: '2px',
              left: isPushEnabled ? '24px' : '2px',
              transition: '0.2s'
            }} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* 4. Development Refresh Button */}
      <button 
        type="button" 
        onClick={() => window.location.reload()}
        style={{ fontSize: '10px', opacity: 0.5, marginBottom: '10px', background: 'none', border: 'none', color: 'inherit' }}
      >
        ↻ Refresh App
      </button>

      <BottomNav
        left={<ArrowNav dir="left" kind="link" href={backHref} ariaLabel="Back" />}
        right={<ArrowNav dir="right" kind="submit" ariaLabel="Create invite" />}
      />
    </form>
  );
}