import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../types/token-payload.type';
import { TokenPayloadWithRefreshToken } from '../types/token-payload-with-rt.type';
import { Request } from 'express';

export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: `${process.env.JWT_RT_SECRET}`,
			passReqToCallback: true,
		});
	}
	validate(req: Request, payload: TokenPayload): TokenPayloadWithRefreshToken {
		const refreshToken = req.headers.authorization.split(' ')[1];

		return { ...payload, refreshToken };
	}
}
