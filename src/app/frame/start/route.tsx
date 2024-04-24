import prisma from "@/lib/prisma";
import { createFrames, Button } from "frames.js/next";

const frames = createFrames({});

const HOST = process.env.HOST || "http://localhost:3000";

const handleRequest = frames(async (payload) => {
  const fid = payload.message?.requesterFid;

  const user = await prisma.user.findUnique({
    where: {
      fid: String(fid),
    },
  });

  if (!user) {
    return {
      image: (
        <div
          style={{
            alignItems: "center",
            background: "black",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            User not found!
          </div>
        </div>
      ),
      buttons: [
        <Button action="link" key="login" target={`${HOST}/login`}>
          Sign in
        </Button>,
      ],
    };
  }

  return {
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          You can start super liking!
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="link"
        key="add"
        target={`${process.env.NEXT_PUBLIC_ADD_URL}`}
      >
        Add cast action
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
