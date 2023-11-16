import { TokenPayload } from './token-payload.type';

export type TokenPayloadWithRefreshToken = TokenPayload & {
	refreshToken: string;
};
