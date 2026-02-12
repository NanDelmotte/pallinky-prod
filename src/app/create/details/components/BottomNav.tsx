// src/app/create/details/components/BottomNav.tsx

export function BottomNav({ left, right }: { left?: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{
      marginTop: "var(--space-3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-2)",
    }}>
      <div>{left ?? null}</div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}