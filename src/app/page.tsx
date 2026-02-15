import { redirect } from "next/navigation";
import Shell from "@/components/Shell";

/**
 * We wrap the redirect in a Shell that has the 'zen' palette.
 * This ensures that while the browser is processing the move to /create,
 * the background is already the correct green.
 */
export default function RootPage() {
  // This triggers the redirect immediately
  redirect("/create");

  // We return a Shell just in case the browser shows a split-second
  // of this page before moving. This keeps the color consistent.
  return (
    <Shell title="" paletteKey="zen">
      <div />
    </Shell>
  );
}