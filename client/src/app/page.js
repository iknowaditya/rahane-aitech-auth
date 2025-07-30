"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      router.push("/login");
      return;
    }
    const userObj = JSON.parse(userRaw);

    if (userObj.role === "admin") router.push("/admin/users");
    else if (userObj.role === "editor") router.push("/editor/content");
    else if (userObj.role === "viewer") router.push("/viewer/content");
    else router.push("/login");
  }, [router]);

  return <p className="text-center mt-20">Redirecting...</p>;
}
