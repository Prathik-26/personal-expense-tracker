"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthRedirect(shouldBeLoggedIn: boolean) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (shouldBeLoggedIn && !token) {
      router.push("/auth/login");
    } else if (!shouldBeLoggedIn && token) {
      router.push("/");
    }
  }, [shouldBeLoggedIn, router]);
}
