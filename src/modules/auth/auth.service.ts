import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup-dto';
import { TokenResponse } from './types/token-response.types';
import { TokenPayload } from './types/token-payload.type';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from '../../app.config';
import { Encrypt } from 'src/shared/utils/encrypt';
import { LoginDto } from './dto/login-dto';
import { UserStatus } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	async signTokens(sub: string, type: string): Promise<TokenResponse> {
		const tokenPayload: TokenPayload = {
			sub,
			type,
		};

		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(tokenPayload, {
				secret: `${appConfig.jwtAccessSecret}`,
				expiresIn: `${appConfig.jwtAccessExpiresIn}`,
			}),
			this.jwtService.signAsync(tokenPayload, {
				secret: `${appConfig.jwtRefreshSecret}`,
				expiresIn: `${appConfig.jwtRefreshExpiresIn}`,
			}),
		]).catch(async () => {
			throw new InternalServerErrorException('Sign token failed');
		});

		return {
			accessToken: at,
			refreshToken: rt,
			userType: type,
		};
	}

	async updateRefreshTokenHashed(userID: string, rt: string): Promise<void> {
		const refreshToken = await Encrypt.hashData(rt);
		await this.userService.findOneByIDAndUpdate(userID, {
			refreshToken,
		});
	}

	async signup(signupDto: SignupDto): Promise<TokenResponse> {
		const newUser = await this.userService.createUser(signupDto);

		const tokens = await this.signTokens(newUser._id, newUser.userType);

		await this.updateRefreshTokenHashed(newUser._id, tokens.refreshToken);

		return tokens;
	}

	async login(loginDto: LoginDto): Promise<TokenResponse> {
		const user = await this.userService.findOneByEmail(loginDto.email);

		if (user.status === UserStatus.Inactive) {
			throw new BadRequestException('User status inactive');
		}

		const isMatched = await Encrypt.compareData(
			user.password,
			loginDto.password,
		);

		if (!isMatched) throw new BadRequestException('Password not correct');

		const tokens = await this.signTokens(user._id, user.userType);
		await this.updateRefreshTokenHashed(user._id, tokens.refreshToken);

		return tokens;
	}

	async logout(userID: string): Promise<boolean> {
		const user = await this.userService.findOneByID(userID);

		if (user.refreshToken === null)
			throw new BadRequestException('User already logout');

		await this.userService.findOneByIDAndUpdate(userID, {
			refreshToken: null,
		});

		return true;
	}

	async refreshTokens(
		userID: string,
		refreshToken: string,
	): Promise<TokenResponse> {
		const user = await this.userService.findOneByID(userID);

		if (!user.refreshToken) throw new UnauthorizedException('Unauthorized');

		const isMatched = await Encrypt.compareData(
			user.refreshToken,
			refreshToken,
		);

		if (!isMatched) throw new UnauthorizedException('Unauthorized');

		const tokens = await this.signTokens(user._id, user.firstName);

		await this.updateRefreshTokenHashed(user._id, tokens.refreshToken);

		return tokens;
	}
}
