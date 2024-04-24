"use client";

import type { FC } from "react";
import { useApp } from "@/Context/AppContext";
import useLocalStorage from "@/hooks/use-local-storage-state";
import Image from "next/image";
import SignIn from "@/components/SignIn";
import { UserInfo } from "@/types";
import Link from "next/link";

export const Header: FC = () => {
  const { userData } = useApp();
  const [, _1, removeItem] = useLocalStorage<UserInfo>("user");

  const handleSignout = () => {
    removeItem();
    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center justify-between absolute w-full top-0">
      <h1>Degen super like</h1>

      <div className="flex items-center gap-4">
        <Link href="/likes">Super liked casts</Link>
        <Link href={`${process.env.NEXT_PUBLIC_ADD_URL}`}>Add Cast action</Link>
        <Link href="/logout">Check out demo</Link>
      </div>

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
    </nav>
  );
};
