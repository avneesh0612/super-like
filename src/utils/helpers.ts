import axios, { AxiosError } from "axios";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export const verifyUser = async (signerUuid: string, fid: string) => {
  let _isVerifiedUser = false;
  try {
    const {
      data: { isVerifiedUser },
    } = await axios.post("/api/verify-user", { signerUuid, fid });
    _isVerifiedUser = isVerifiedUser;
  } catch (err) {
    const { message } = (err as AxiosError).response?.data as ErrorRes;
    console.error(message);
  }
  return _isVerifiedUser;
};
