"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRoleGuard(user, allowedRoles) {
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // user loading, wait

    if (!user) {
      router.push("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.push("/");
    }
  }, [user, allowedRoles, router]);
}
