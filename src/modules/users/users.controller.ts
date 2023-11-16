import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConsumes,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
// import { Gender, User, UserRole, UserStatus } from './schemas/user.schema';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import {
	ErrorResponse,
	ListOptions,
} from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { SignupDto } from '../auth/dto/signup-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateLoggedUserDataDto } from './dto/update-logged-user-data-dto';
import { UpdateLoggedUserPasswordDto } from './dto/update-logged-user-password-dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { User, UserGender, UserStatus, UserType } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
// import { UserAddress } from './schemas/user-address.schema';
// import { ErrorResponse } from 'src/shared/response/common-response';
// import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
// import { UpdateLoggedUserDataDto } from './dto/update-logged-user-data-dto';
// import { UpdateLoggedUserPasswordDto } from './dto/update-logged-user-password-dto';
// import { RolesGuard } from 'src/guards/role.guard';
// import { Roles } from 'src/decorators/role.decorator';

@ApiTags('users')
// @ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@ApiOperation({
		summary: 'Get Profile',
	})
	@ApiOkResponse({ type: User, status: 200 })
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
	@Get('me')
	// @Roles(UserType.CUSTOMER, UserType.PERSONEL)
	async getProfile(@GetCurrentUser('sub') userID: string): Promise<User> {
		return await this.userService.getCurrentUser(userID);
	}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'User ID' })
	@ApiOkResponse({ type: User, status: 200 })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'User not found!',
	})
	getUserById(@Param('id') id) {
		return this.userService.findUserById(id);
	}

	@Public()
	@Get()
	@ApiResponse({
		schema: {
			example: {
				total: 0,
				filter: {
					limit: 10,
					offset: 0,
					roleId: 1,
					searchField: 'string',
					searchValue: 'string',
					sortBy: 'name',
					sortOrder: ESortOrder.ASC,
				} as GetUserDto,
				data: [
					{
						_id: 'string',
						firstName: 'string',
						lastName: 'string',
						email: 'string',
						// roles: [],
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				] as User[],
			} as SuccessResponse<User[], GetUserDto>,
		},
		status: 200,
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllUsers(@Query() filter: ListOptions<User>) {
		return this.userService.findMany(filter);
	}

	@Public()
	@Post()
	@ApiBody({
		type: CreateUserDto,
		examples: {
			customer: {
				summary: 'customer',
				value: {
					firstName: 'first customer',
					lastName: 'last customer',
					displayName: 'display customer',
					username: 'user customer',
					email: 'admin@test.com',
					password: 'nhung@123',
					userType: UserType.Customer,
					gender: UserGender.Male,
					phoneNumber: '0899329380',
					roles: [],
					status: UserStatus.Active,
				} as CreateUserDto,
			},
			admin: {
				summary: 'admin',
				value: {
					firstName: 'first admin',
					lastName: 'last admin',
					displayName: 'display admin',
					username: 'user admin',
					email: 'admin1@test.com',
					password: 'admin@123',
					userType: UserType.Personnel,
					birthDate: new Date(),
					gender: UserGender.Male,
					phoneNumber: '0899329380',
					roles: ['65178f41e9dff37a826dcc04'],
					status: UserStatus.Active,
				} as CreateUserDto,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createUser(@Body() input: CreateUserDto | SignupDto) {
		return this.userService.createUser(input);
	}

	@Patch(':userID/avatar')
	@ApiOperation({
		summary: 'Update Avatar',
		description: `Update user's avatar.\n\nRoles: ${UserType.Customer}, ${UserType.Personnel}`,
	})
	@ApiConsumes('multipart/form-data')
	@ApiParam({ name: 'userID', type: String, description: 'User ID' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'accept: jpeg|png',
				},
			},
		},
	})
	@ApiOkResponse({
		schema: {
			example: {
				data: true,
			},
		},
	})
	@ApiResponse({
		status: 400,
		schema: {
			example: {
				code: '400',
				message: 'File size invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
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
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 404,
		schema: {
			example: {
				code: '404',
				message: 'Not found user with that ID',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiResponse({
		status: 415,
		schema: {
			example: {
				code: '415',
				message: 'File invalid',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	// @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	// @UseGuards(RolesGuard)
	@UseInterceptors(FileInterceptor('file'))
	async updateAvatar(
		@Param('userID') userID: string,
		@UploadedFile()
		file: Express.Multer.File,
		@Req() req: any,
	): Promise<boolean> {
		return await this.userService.updateAvatar(userID, file, req);
	}

	// @ApiOperation({
	// 	summary: 'Update My Data (not password)',
	// })
	// @ApiBody({
	// 	type: UpdateLoggedUserDataDto,
	// 	examples: {
	// 		example1: {
	// 			value: {
	// 				username: 'string',
	// 				email: 'string',
	// 				displayName: 'string',
	// 				firstName: 'string',
	// 				lastName: 'string',
	// 				gender: 'string',
	// 				birthDate: 'string',
	// 				tel: 'string',
	// 				address: 'string',
	// 			},
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
	// @ApiResponse({
	// 	status: 401,
	// 	schema: {
	// 		example: {
	// 			code: '401',
	// 			message: 'Unauthorized',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 403,
	// 	schema: {
	// 		example: {
	// 			code: '403',
	// 			message: `Forbidden resource`,
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Patch('update-me')
	// // @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	// // @UseGuards(RolesGuard)
	// async updateMyData(
	// 	@GetCurrentUser('sub') userID: string,
	// 	@Body() dto: UpdateLoggedUserDataDto,
	// ): Promise<User> {
	// 	return await this.userService.updateMyData(userID, dto);
	// }

	// @ApiOperation({
	// 	summary: 'Update Password',
	// })
	// @ApiBody({
	// 	type: UpdateLoggedUserPasswordDto,
	// 	examples: {
	// 		example1: {
	// 			value: {
	// 				password: 'string',
	// 			},
	// 		},
	// 	},
	// })
	// @ApiOkResponse({
	// 	schema: {
	// 		example: {
	// 			data: true,
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
	// @ApiResponse({
	// 	status: 401,
	// 	schema: {
	// 		example: {
	// 			code: '401',
	// 			message: 'Unauthorized',
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @ApiResponse({
	// 	status: 403,
	// 	schema: {
	// 		example: {
	// 			code: '403',
	// 			message: `Forbidden resource`,
	// 			details: null,
	// 		} as ErrorResponse<null>,
	// 	},
	// })
	// @Patch('update-my-password')
	// // @Roles(UserRole.ADMIN, UserRole.FACILITY_OWNER, UserRole.MEMBER)
	// // @UseGuards(RolesGuard)
	// async updateMyPassword(
	// 	@GetCurrentUser('sub') userID: string,
	// 	@Body() dto: UpdateLoggedUserPasswordDto,
	// ): Promise<boolean> {
	// 	return await this.userService.updateMyPassword(userID, dto);
	// }

	// @Patch('update-my-address')
	// async updateMyAddress(
	// 	@GetCurrentUser('sub') userID: string,
	// 	@Body() dto: UpdateUserAddressDto,
	// ): Promise<boolean> {
	// 	return await this.userService.updateMyAddress(userID, dto);
	// }

	// @Patch('update-my-role')
	// async updateMyRoles(
	// 	@GetCurrentUser('sub') userID: string,
	// 	@Body() dto: UpdateUserRolesDto,
	// ): Promise<boolean> {
	// 	return await this.userService.updateMyRoles(userID, dto);
	// }

	@Patch(':userId')
	@ApiParam({ name: 'userId', type: String, description: 'user ID' })
	async updateUser(
		@Param('userId') userId,
		@Body() dto: UpdateUserDto,
	): Promise<User> {
		console.log(dto);
		return this.userService.findOneAndUpdate(userId, dto);
	}

	@ApiOperation({
		summary: 'Delete Me',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: true,
			},
		},
	})
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
	@ApiResponse({
		status: 403,
		schema: {
			example: {
				code: '403',
				message: `Forbidden resource`,
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@Delete('delete-me')
	// @Roles(UserRole.FACILITY_OWNER, UserRole.MEMBER)
	// @UseGuards(RolesGuard)
	async deleteMe(@GetCurrentUser('sub') userID: string): Promise<boolean> {
		return await this.userService.deleteMe(userID);
	}
}
