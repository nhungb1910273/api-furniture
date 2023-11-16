import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { ErrorResponse } from 'src/shared/response/common-response';
import { UserGender } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login-dto';
import { SignupDto } from './dto/signup-dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { TokenResponse } from './types/token-response.types';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({
		summary: 'Signup',
		description: 'Allow user sign up.\n\nRoles: none.',
	})
	@ApiBody({
		type: SignupDto,
		examples: {
			CUSTOMER: {
				summary: 'Sign up customer account',
				value: {
					firstName: 'first cus',
					lastName: 'last cus',
					username: 'customer1',
					email: 'customer1@test.com',
					password: '1@Aabcde',
					displayName: 'Customer User',
					tel: '0899329380',
					gender: UserGender.Male,
				} as SignupDto,
			},
		},
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				accessToken: 'string',
				refreshToken: 'string',
			} as TokenResponse,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Post('signup')
	@Public()
	@HttpCode(HttpStatus.CREATED)
	async signup(@Body() signupDto: SignupDto): Promise<TokenResponse> {
		return this.authService.signup(signupDto);
	}

	@ApiOperation({
		summary: 'Login',
		description: 'Allow user login.\n\nRoles: none.',
	})
	@ApiBody({
		type: LoginDto,
		examples: {
			ADMIN: {
				summary: 'Admin account',
				value: {
					email: 'admin@test.com',
					password: '1@Aabcde',
				} as LoginDto,
			},
			CUSTOMER: {
				summary: 'Customer account',
				value: {
					email: 'customer1@test.com',
					password: '1@Aabcde',
				} as LoginDto,
			},
		},
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				accessToken: 'string',
				refreshToken: 'string',
			} as TokenResponse,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Input invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
		console.log('Controller', loginDto);
		return this.authService.login(loginDto);
	}

	@ApiOperation({
		summary: 'Logout',
	})
	@ApiResponse({ status: 204 })
	@ApiResponse({
		status: 401,
		schema: {
			example: {
				code: '401',
				message: 'Unauthorized',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBearerAuth()
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@GetCurrentUser('sub') userID: string): Promise<boolean> {
		return this.authService.logout(userID);
	}

	@ApiOperation({
		summary: 'RefreshToken',
	})
	@ApiResponse({
		status: 201,
		schema: {
			example: {
				accessToken: 'string',
				refreshToken: 'string',
			} as TokenResponse,
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'Token invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiBearerAuth()
	@Post('refresh-token')
	@UseGuards(RefreshTokenGuard)
	@HttpCode(HttpStatus.OK)
	refreshTokens(
		@GetCurrentUser('sub') userID: string,
		@GetCurrentUser('refreshToken') refreshToken: string,
	): Promise<TokenResponse> {
		return this.authService.refreshTokens(userID, refreshToken);
	}

	// @ApiOperation({
	// 	summary: 'forgotPassword',
	// 	description: 'Allow user send forgot password request to reset password',
	// })
	// @ApiResponse({
	// 	status: 200,
	// 	schema: {
	// 		example: {
	// 			code: '200',
	// 			message: 'Token sent to email',
	// 		},
	// 	},
	// })
	// @ApiResponse({
	// 	status: 400,
	// 	schema: {
	// 		example: {
	// 			code: '400',
	// 			message: 'Input invalid',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Post('forgot-password')
	// forgotPassword() {
	// 	return 'forgotPassword';
	// }

	// @ApiOperation({
	// 	summary: 'resetPassword',
	// 	description: 'Allow user reset password',
	// })
	// @ApiParam({
	// 	name: 'resetPasswordToken',
	// 	type: String,
	// 	description: 'Reset Password Token',
	// })
	// @ApiCreatedResponse({ type: TokenResponse, status: 200 })
	// @ApiResponse({
	// 	status: 400,
	// 	schema: {
	// 		example: {
	// 			code: '400',
	// 			message: 'Reset Password token invalid  or has expired',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Patch('reset-password/:resetPasswordToken')
	// resetPassword() {
	// 	return 'resetPassword';
	// }
}
