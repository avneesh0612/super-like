import client from "@/lib/neynarClient";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  console.log(fid);

  if (!fid) {
    return NextResponse.json({ message: "No fid provided" }, { status: 400 });
  }

  try {
    const likes = await prisma.likes.findMany({
      where: {
        fid,
      },
    });

    const castPromises = likes.map((like) =>
      client.lookUpCastByHashOrWarpcastUrl(like.castHash, "hash")
    );

    const casts = await Promise.all(castPromises);

    console.log(likes);

    return NextResponse.json({ likes, casts }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
