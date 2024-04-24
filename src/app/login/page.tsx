"use client";

import { useApp } from "@/Context/AppContext";
import useLocalStorage from "@/hooks/use-local-storage-state";
import Image from "next/image";
import { UserInfo } from "../../types";
import SignIn from "@/components/SignIn";
import { Header } from "@/components/Header";

export default function Login() {
  const { userData } = useApp();
  const [, _1, removeItem] = useLocalStorage<UserInfo>("user");

  const handleSignout = () => {
    removeItem();
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center gap-4 min-h-screen flex-col">
      <Header />

      <h1 className="text-2xl font-semibold">
        {userData?.displayName
          ? "You can start super liking!"
          : "Sign in to start super liking!"}
      </h1>

      {userData?.displayName ? (
        <div className="flex items-center gap-4">
          {userData?.pfp.url && (
            <Image
              src={userData?.pfp.url}
              alt="User profile picture"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <p className="text-sm font-semibold">{userData?.displayName}</p>
          <button onClick={handleSignout}>Sign out</button>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
