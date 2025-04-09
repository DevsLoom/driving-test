import { decodeToken, isExpired } from "react-jwt";
import { CurrentUserType } from "../types/currentUser";

type TokenDecoderResult = {
    myDecodedToken: CurrentUserType | null;
    isMyTokenExpired: boolean;
};

const tokenDecoder = (token: string): TokenDecoderResult => {
    const myDecodedToken = decodeToken<CurrentUserType>(token);
    const isMyTokenExpired = isExpired(token);

    return { myDecodedToken: myDecodedToken ?? null, isMyTokenExpired };
};

export default tokenDecoder;
