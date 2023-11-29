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
import {
	ErrorResponse,
	ListOptions,
} from 'src/shared/response/common-response';
import { Public } from '../auth/decorators/public.decorator';
import { SignupDto } from '../auth/dto/signup-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User, UserType } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UpdateProductFavoriteDto } from './dto/update-product-favorite.dto';
// import { UserAddress } from './schemas/user-address.schema';
// import { ErrorResponse } from 'src/shared/response/common-response';
// import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
// import { UpdateLoggedUserDataDto } from './dto/update-logged-user-data-dto';
// import { UpdateLoggedUserPasswordDto } from './dto/update-logged-user-password-dto';
// import { RolesGuard } from 'src/guards/role.guard';
// import { Roles } from 'src/decorators/role.decorator';

@ApiTags('users')
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
		return this.userService.findUserById({ _id: id });
	}

	@Public()
	@Get()
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
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	createUser(@Body() input: CreateUserDto | SignupDto) {
		return this.userService.createUser(input);
	}

	@Public()
	@Patch(':userID/avatar')
	@ApiOperation({
		summary: 'Update Avatar',
		description: `Update user's avatar.\n\nRoles: ${UserType.Customer}, ${UserType.Personnel}`,
	})
	@ApiConsumes('multipart/form-data')
	@ApiParam({ name: 'userID', type: String, description: 'User ID' })
	@ApiOkResponse({
		schema: {
			example: {
				data: true,
			},
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
	@UseInterceptors(FileInterceptor('file'))
	async updateAvatar(
		@Param('userID') userID: string,
		@UploadedFile()
		file: Express.Multer.File,
		@Req() req: any,
	): Promise<boolean> {
		return await this.userService.updateAvatar(userID, file, req);
	}

	@Public()
	@Patch(':userId')
	@ApiParam({ name: 'userId', type: String, description: 'user ID' })
	async updateUser(
		@Param('userId') userId,
		@Body() dto: UpdateUserDto,
	): Promise<User> {
		console.log('dto', dto);
		return this.userService.findOneAndUpdate(userId, dto);
	}

	@Public()
	@Patch('/add-favorite/:userId')
	@ApiParam({ name: 'userId', type: String, description: 'user ID' })
	async updateProductFavorite(
		@Param('userId') userId,
		@Body() dto: UpdateProductFavoriteDto,
	): Promise<User> {
		console.log('dto', dto);
		return this.userService.updateProductFavorite(userId, dto);
	}

	@Delete('delete-me')
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
	async deleteMe(@GetCurrentUser('sub') userID: string): Promise<boolean> {
		return await this.userService.deleteMe(userID);
	}

	//USERS
	@ApiOperation({
		summary: 'Get Quantity Users Statistic',
		// description: `Get quantity users of system (exclude admin account).\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numberUsers: 1,
				},
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
	@Get('statics/quantity-users')
	// @Roles(UserRole.ADMIN)
	// @UseGuards(RolesGuard)
	async getQuantityUsersStats(): Promise<object> {
		return await this.userService.getQuantityUsersStats();
	}

	@ApiOperation({
		summary: 'Get Quantity Customers Statistic',
		// description: `Get quantity customers of system).\n\nRoles: ${UserRole.ADMIN}.`,
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				data: {
					numberCustomers: 1,
				},
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
	@Get('users/statics/quantity-customers')
	// @Roles(UserRole.ADMIN)
	// @UseGuards(RolesGuard)
	async getQuantityCustomersStats(): Promise<object> {
		return await this.userService.getQuantityCustomersStats();
	}
}
