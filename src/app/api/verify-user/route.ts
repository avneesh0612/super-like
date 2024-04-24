import { NextRequest, NextResponse } from "next/server";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";
import client from "@/lib/neynarClient";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { signerUuid, fid } = (await request.json()) as {
    signerUuid: string;
    fid: string;
  };

  let isVerifiedUser = false;
  try {
    const { fid: userFid } = await client.lookupSigner(signerUuid);

    if (userFid === Number(fid)) {
      isVerifiedUser = true;

      const user = await prisma.user.findUnique({
        where: {
          fid,
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            fid,
            signerUUID: signerUuid,
          },
        });
      }
    } else isVerifiedUser = false;
    return NextResponse.json({ isVerifiedUser }, { status: 200 });
  } catch (err) {
    if (isApiErrorResponse(err)) {
      return NextResponse.json(
        { ...err.response.data },
        { status: err.response.status }
      );
    } else
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
  }
}
