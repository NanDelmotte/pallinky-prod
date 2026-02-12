"use client";

export default function DecideLaterGo() {
  return (
    <button
      type="button"
      className="c-btnSecondary"
      onClick={(e) => {
        const form = e.currentTarget.closest("form") as HTMLFormElement | null;
        if (!form) return;

        const date = form.querySelector<HTMLInputElement>(
          'input[name="starts_at"]'
        );
        const duration = form.querySelector<HTMLSelectElement>(
          'select[name="duration_minutes"]'
        );
        const flag = form.querySelector<HTMLInputElement>(
          'input[name="decide_later"]'
        );

        if (flag) flag.value = "1";

        if (date) {
          date.value = "";
          date.required = false;
        }

        if (duration) {
          duration.value = "0";
        }

        // Go straight to Step 3
        form.requestSubmit();
      }}
    >
      Skip for now
    </button>
  );
}
