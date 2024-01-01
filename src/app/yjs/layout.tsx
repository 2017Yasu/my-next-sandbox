'use client'

import { useRouter } from "next/navigation";

export default function YjsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div>
      <div>
        <button style={{padding: '3px'}} onClick={() => router.back()}>Go Back</button>
      </div>
      <div style={{width: '100vw', padding: '5px'}}>{children}</div>
    </div>
  );
}
