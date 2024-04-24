import client from "@/lib/neynarClient";
import prisma from "@/lib/prisma";
import { createFrames } from "frames.js/next";

const frames = createFrames({});

export const POST = frames(async (ctx) => {
  try {
    const body = await ctx.request.json();

    const { action } = await client.validateFrameAction(
      body.trustedData.messageBytes
    );

    const user = await prisma.user.findUnique({
      where: {
        fid: String(action.interactor.fid),
      },
    });

    if (!user) {
      return Response.json({
        message: "Please create a signer first!",
      });
    }

    await prisma.likes.create({
      data: {
        castHash: action.cast.hash,
        fid: String(action.interactor.fid),
      },
    });

    let message = `Super liked! 🎉`;

    return Response.json({
      message,
    });
  } catch (e) {
    console.error("error at /mint", e);
    return Response.json({
      message: "Error",
    });
  }
});
