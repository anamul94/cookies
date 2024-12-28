"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mt-4 px-6 py-3 bg-[#1D3557] text-white rounded-lg hover:bg-[#FCB929] transition duration-300"
    >
      Go Back
    </button>
  );
}
