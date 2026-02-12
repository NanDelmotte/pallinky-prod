// src/app/create/details/page.tsx
import Shell from "@/components/Shell";
import { paletteForGif } from "@/lib/palette";
import { step1Action, step2Action, step3Action, step4CreateAction } from "./actions";
import { Step1What } from "./components/Step1What";
import { Step2When } from "./components/Step2When";
import { Step3Details } from "./components/Step3Details";
import { Step4Create } from "./components/Step4Create";

type Draft = {
  title?: string;
  starts_at?: string;
  duration_minutes?: string;
  ends_at?: string;
  description?: string;
  location?: string;
  host_name?: string;
  host_email?: string;
  expires_in_days?: string;
  cover_image_url?: string;
  gif_key?: string;
  keyword?: string;
};

function getDraftFromSearchParams(sp: any): Draft {
  const get = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : v; };
  return {
    title: get("title"),
    starts_at: get("starts_at"),
    duration_minutes: get("duration_minutes"),
    ends_at: get("ends_at"),
    description: get("description"),
    location: get("location"),
    host_name: get("host_name"),
    host_email: get("host_email"),
    expires_in_days: get("expires_in_days"),
    cover_image_url: get("cover_image_url"),
    gif_key: get("gif_key"),
    keyword: get("keyword"),
  };
}

function hiddenDraftInputs(draft: Draft, exclude: (keyof Draft)[] = []) {
  const keys: (keyof Draft)[] = ["title", "starts_at", "duration_minutes", "ends_at", "description", "location", "host_name", "host_email", "expires_in_days", "cover_image_url", "gif_key", "keyword"];
  return (
    <>
      {keys.filter((k) => !exclude.includes(k)).map((k) => {
          const v = draft[k];
          if (typeof v !== "string" || v.length === 0) return null;
          return <input key={k} type="hidden" name={k} value={v} />;
      })}
    </>
  );
}

function hrefForStep(draft: Draft, step: number) {
  const qs = new URLSearchParams();
  qs.set("step", String(step));
  Object.entries(draft).forEach(([k, v]) => { if (typeof v === "string" && v.length) qs.set(k, v); });
  return `/create/details?${qs.toString()}`;
}

export default function CreateDetailsPage({ searchParams }: { searchParams: any }) {
  const step = Math.min(4, Math.max(1, Number(searchParams.step || "1")));
  const draft = getDraftFromSearchParams(searchParams);
  const paletteKey = paletteForGif((draft.gif_key || "zen").trim() || "zen");
  const stepLabel = `${step}/4`;

  return (
    <Shell title={getStepTitle(step)} subtitle={stepLabel} paletteKey={paletteKey}>
      {step === 1 && <Step1What draft={draft} action={step1Action} />}
      {step === 2 && (
        <Step2When 
          draft={draft} 
          action={step2Action} 
          backHref={hrefForStep(draft, 1)} 
          hiddenInputs={hiddenDraftInputs(draft, ["starts_at", "duration_minutes", "ends_at"])} 
        />
      )}
      {step === 3 && (
        <Step3Details 
          draft={draft} 
          action={step3Action} 
          backHref={hrefForStep(draft, 2)} 
          hiddenInputs={hiddenDraftInputs(draft, ["description", "location"])} 
        />
      )}
      {step === 4 && (
        <Step4Create 
          draft={draft} 
          action={step4CreateAction} 
          backHref={hrefForStep(draft, 3)} 
          hiddenInputs={hiddenDraftInputs(draft, ["host_name", "host_email"])} 
        />
      )}
    </Shell>
  );
}

function getStepTitle(step: number) {
  if (step === 1) return "What’s happening?";
  if (step === 2) return "When is it?";
  if (step === 3) return "Anything you want to say?";
  return "Create your invite";
}