// src/app/page.tsx
import { Suspense } from "react";
import NewsApp from "./NewsApp";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading News...</p>}>
      <NewsApp />
    </Suspense>
  );
}
