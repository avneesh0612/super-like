import client from "@/lib/neynarClient";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    const likes = await prisma.likes.findMany({
      where: {
        completed: false,
      },
    });

    const fids = likes
      .map((like) => like.fid)
      .filter((fid, index, self) => self.indexOf(fid) === index);

    const userPromises = fids.map((fid) =>
      fetch(`https://www.degentip.me/api/get_allowance?fid=${fid}`)
    );

    const users = await Promise.all(userPromises);

    for (const user of users) {
      const { allowance } = await user.json();
      console.log(allowance);

      if (!allowance) {
      }

      const signer = await prisma.user.findUnique({
        where: {
          fid: String(allowance.fid),
        },
      });

      if (!signer) {
        console.log("No signer found");
        continue;
      }

      const likesToComplete = likes.filter(
        (like) => like.fid === String(allowance.fid)
      );

      const tipEach =
        Math.floor(allowance.remaining_allowance / likesToComplete.length) - 1;
      console.log(tipEach);

      for (const like of likesToComplete) {
        const reply = await client.publishCast(
          signer?.signerUUID!,
          `${tipEach} $DEGEN`,
          {
            replyTo: like.castHash,
          }
        );
        console.log(reply);

        await prisma.likes.update({
          where: {
            fid: like.fid,
            castHash: like.castHash,
          },
          data: {
            completed: true,
          },
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("error at /cron", e);
  }
}
