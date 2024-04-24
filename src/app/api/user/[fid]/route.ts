import { NextRequest, NextResponse } from "next/server";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";
import client from "@/lib/neynarClient";

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = parseInt(params.fid);
    const {
      result: { user },
    } = await client.lookupUserByFid(fid);
    return NextResponse.json({ user }, { status: 200 });
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
