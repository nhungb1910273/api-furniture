import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayloadWithRefreshToken } from 'src/modules/auth/types/token-payload-with-rt.type';

export const GetCurrentUser = createParamDecorator(
	(
		data: keyof TokenPayloadWithRefreshToken | undefined,
		context: ExecutionContext,
	) => {
		const request = context.switchToHttp().getRequest();
		if (!data) return request.user;
		return request.user[data];
	},
);
