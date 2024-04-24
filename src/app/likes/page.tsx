"use client";

import { useApp } from "@/Context/AppContext";
import { Header } from "@/components/Header";
import SignIn from "@/components/SignIn";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Login() {
  const { userData } = useApp();
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [casts, setCasts] = useState([] as any[]);

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`/api/likes?fid=${userData?.fid}`, {
        data: {
          fid: userData?.fid,
        },
      });
      setLikes(response.data.casts);
      setFetched(true);

      setLoading(false);
    } catch (e) {
      console.error("error at /api/likes", e);
    }
  };

  useEffect(() => {
    if (userData?.fid) {
      if (!likes.length && !fetched) fetchLikes();
    }
  }, [userData]);

  return (
    <div className="flex items-center justify-center gap-4 min-h-screen flex-col">
      <Header />

      {userData?.displayName ? (
        <h2 className="text-2xl font-semibold">Super liked casts</h2>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">Please sign in to continue</h1>

          <SignIn />
        </>
      )}

      {loading && <p>Loading...</p>}

      {likes.length > 0 && (
        <div className="flex flex-col gap-4">
          {likes.map(
            ({ cast }: { cast: Cast }) => (
              console.log(cast),
              (
                <div className="border-[#272B30] border-[1px] rounded-md p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-400 relative h-fit pb-20 max-w-[500px]">
                  <div className="flex items-center">
                    <Link
                      href={`/user/${cast?.author.fid}`}
                      className="flex gap-2 items-center"
                    >
                      {cast.author.pfp_url && (
                        <Image
                          src={cast.author.pfp_url}
                          alt={
                            cast?.author.display_name ||
                            cast?.author.username ||
                            ""
                          }
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      )}
                      <p className="font-semibold text-white text-lg">
                        {cast?.author.display_name || cast?.author.username}
                      </p>
                    </Link>
                  </div>
                  <p className="text-[#646D7A] mt-8">{String(cast?.text)}</p>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
