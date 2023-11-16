import { IsNotEmpty, IsString } from 'class-validator';

export class TokenResponse {
	@IsNotEmpty()
	@IsString()
	accessToken: string;

	@IsNotEmpty()
	@IsString()
	refreshToken: string;

	@IsString()
	userType: string;
}
