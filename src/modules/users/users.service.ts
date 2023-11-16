import {
	BadRequestException,
	ForbiddenException,
	// BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model, isValidObjectId } from 'mongoose';
import { appConfig } from 'src/app.config';
import { ESortOrder } from 'src/shared/enum/sort.enum';
import { ListOptions, ListResponse } from 'src/shared/response/common-response';
import { Encrypt } from 'src/shared/utils/encrypt';
import { SignupDto } from '../auth/dto/signup-dto';
import { CartsService } from '../carts/carts.service';
import { PhotoService } from '../photos/photo.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateLoggedUserDataDto } from './dto/update-logged-user-data-dto';
import { UpdateLoggedUserPasswordDto } from './dto/update-logged-user-password-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { UserAddressDto } from './dto/user-address.dto';
import {
	User,
	UserDocument,
	UserStatus,
	UserType,
} from './schemas/user.schema';
// import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
// import paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class UsersService {
	private stripe: any;
	private paypalModel: any;
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,
		private roleService: RolesService,
		private photoService: PhotoService,
		private cartService: CartsService,
	) {
		this.stripe = new Stripe(`${appConfig.stripeSecretKey}`, {
			apiVersion: '2022-11-15',
		});
		// this.paypalModel = new paypal.orders.OrdersCreateRequest();
	}

	async getCurrentUser(userID: string): Promise<User> {
		const user = await this.userModel.findById(userID);

		if (!user) throw new NotFoundException('Logged User no longer exists');

		user.password = undefined;
		user.refreshToken = undefined;
		console.log(user);
		return user;
	}

	async updateAvatar(
		userID: string,
		file: Express.Multer.File,
		req: any,
	): Promise<boolean> {
		if (userID != req.user.sub) {
			throw new ForbiddenException(
				'You do not have permission to update avatar',
			);
		}
		if (isValidObjectId(userID) && file) {
			const user = await this.userModel.findById(userID);
			await this.photoService.delete(user.avatar?._id);
			const avatar = await this.photoService.uploadOneFile(file, userID);
			user.avatar = avatar;
			if (!(await user.save())) {
				throw new BadRequestException("User's not update ");
			}
			return true;
		}
		throw new BadRequestException('[Input] invalid');
	}

	async findOneAndUpdate(userId: string, updateUserDto: UpdateUserDto) {
		const findUser = await this.userModel.findOne({
			_id: userId,
		});
		if (findUser) {
			if (updateUserDto.address && updateUserDto.address.length > 0) {
				const data = updateUserDto.address.filter(
					(item) => item.isDefault === true,
				);
				if (!data.length) {
					updateUserDto.address[0].isDefault = true;
				}
			}
			const user = await this.userModel.findByIdAndUpdate(
				findUser._id,
				updateUserDto,
				{
					new: true,
					runValidators: true,
				},
			);

			if (!user) throw new NotFoundException('User not found');
			return user;
		}

		// const stripeCustomer = await this.stripe.customers.search({
		// 	query: `email:\'${user.email}\'`,
		// });

		// if (stripeCustomer.data.length !== 0) {
		// 	let addressDefault = {} as UserAddressDto;
		// 	for (const val of updateUserDto.address) {
		// 		if (val.isDefault === true) {
		// 			addressDefault = val;
		// 			await this.stripe.customers.update(stripeCustomer.data[0].id, {
		// 				email: user.email,
		// 				name: user.username,
		// 				address: {
		// 					city: addressDefault?.province,
		// 					district: addressDefault?.district,
		// 					commune: addressDefault?.commune,
		// 					detail: addressDefault?.addressDetail,
		// 				},
		// 				phone: updateUserDto?.phoneNumber,
		// 				metadata: {
		// 					gender: updateUserDto?.gender,
		// 					firstName: updateUserDto?.firstName,
		// 					lastName: updateUserDto?.lastName,
		// 				},
		// 			});
		// 		}
		// 	}
		// }
	}

	async findOneByID(userID: string): Promise<User> {
		const user = await this.userModel.findById(userID);

		if (!user) throw new NotFoundException('Not found user with that ID');

		return user;
	}

	async findOneByIDAndUpdate(
		userID: string,
		updateUserDto: UpdateUserDto,
	): Promise<User> {
		if (updateUserDto.password) {
			updateUserDto.password = await Encrypt.hashData(updateUserDto.password);
		}

		const user = await this.userModel.findByIdAndUpdate(userID, updateUserDto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		return user;
	}

	async findOneByEmail(email: string): Promise<User> {
		const user = await this.userModel.findOne({ email });

		if (!user) throw new NotFoundException('Email not exists');

		return user;
	}

	async findUserById(filter: ListOptions<User>): Promise<User> {
		try {
			const objectID = new mongoose.Types.ObjectId(filter._id);
			const user = await this.userModel.aggregate([
				{ $match: { _id: objectID } },
				{
					$lookup: {
						from: 'roles',
						localField: 'roles',
						foreignField: '_id',
						as: 'roles',
					},
				},
				{ $unwind: '$role' },
			]);
			return user[0];
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving users');
		}
	}
	async findMany(filter: ListOptions<User>): Promise<ListResponse<User>> {
		const sortQuery = {};
		sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
		const limit = filter.limit || 10;
		const offset = filter.offset || 0;

		let input = {} as any;
		const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

		if (filter.search) {
			input = {
				...filter,
				provinceApply: { $regex: rgx(filter.search), $options: 'i' },
			};
		} else {
			input = filter;
		}
		console.log(input);

		const result = await this.userModel
			.find(input)
			.sort(sortQuery)
			.skip(offset)
			.limit(limit)
			.populate('roles');

		return {
			items: result,
			total: result?.length,
			options: filter,
		};
	}

	async createUser(dto: CreateUserDto | SignupDto): Promise<User> {
		try {
			const isExist = await this.checkExist({
				email: dto.email,
				username: dto.username,
			});
			console.log(dto);
			if (!isExist.value) {
				dto.password = await Encrypt.hashData(dto.password);

				if (
					dto.roles &&
					dto.roles.length &&
					dto.userType === UserType.Personnel
				) {
					const roleIds = [] as string[];
					for (const roleId of dto.roles) {
						const findRole = await this.roleService.findOne({ _id: roleId });
						if (!findRole) {
							throw new BadRequestException('Role not found');
						}
						roleIds.push(findRole._id);
					}
					dto.roles = roleIds;
				} else {
					dto.roles = [];
				}
				const createUser = await this.userModel.create(dto);

				createUser.refreshToken = undefined;
				if (createUser.userType === UserType.Customer) {
					await this.cartService.create({
						user: createUser._id,
						totalPrice: 0,
					});
					if (createUser.address) {
						let addressDefault = {} as UserAddressDto;
						for (const val of createUser.address) {
							if (val.isDefault === true) {
								addressDefault = val;
								await this.stripe.customers.create({
									email: createUser.email,
									name: createUser.username,
									address: {
										city: addressDefault?.province,
										district: addressDefault?.district,
										commune: addressDefault?.commune,
										detail: addressDefault?.addressDetail,
									},
									phone: dto?.phoneNumber,
									metadata: {
										gender: dto?.gender,
										firstName: dto?.firstName,
										lastName: dto?.lastName,
										status: UserStatus.Active,
									},
								});
							}
						}
					}
				}
				return await createUser.save();
			}
			throw new BadRequestException(isExist.message);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}

	async updateMyData(
		userID: string,
		dto: UpdateLoggedUserDataDto,
	): Promise<User> {
		const user = await this.userModel.findByIdAndUpdate(userID, dto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length !== 0) {
			let addressDefault = {} as UserAddressDto;
			for (const val of dto.address) {
				if (val.isDefault === true) {
					addressDefault = val;
					await this.stripe.customers.update(stripeCustomer.data[0].id, {
						email: user.email,
						name: user.username,
						address: {
							city: addressDefault?.province,
							district: addressDefault?.district,
							commune: addressDefault?.commune,
							detail: addressDefault?.addressDetail,
						},
						phone: dto?.phoneNumber,
						metadata: {
							gender: dto?.gender,
							firstName: dto?.firstName,
							lastName: dto?.lastName,
						},
					});
				}
			}
		}

		user.password = undefined;
		user.refreshToken = undefined;

		return user;
	}

	async updateMyPassword(
		userID: string,
		dto: UpdateLoggedUserPasswordDto,
	): Promise<boolean> {
		dto.password = await Encrypt.hashData(dto.password);

		const user = await this.userModel.findByIdAndUpdate(userID, dto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		return true;
	}

	async updateMyRoles(
		userID: string,
		dto: UpdateUserRolesDto,
	): Promise<boolean> {
		const roleIds = [] as string[];
		if (dto.roles && dto.roles.length > 0) {
			for (const val of dto.roles) {
				const findRole = await this.roleService.findOne({
					_id: val,
				});
				if (findRole) {
					roleIds.push(findRole._id);
				}
			}
			dto.roles = roleIds;
		}
		const user = await this.userModel.findByIdAndUpdate(userID, dto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		return true;
	}

	async updateMyAddress(
		userID: string,
		dto: UpdateUserAddressDto,
	): Promise<boolean> {
		const user = await this.userModel.findByIdAndUpdate(userID, dto, {
			new: true,
			runValidators: true,
		});

		if (!user) throw new NotFoundException('Not found user with that ID');

		return true;
	}

	async deleteMe(userID: string): Promise<boolean> {
		const user = await this.userModel.findByIdAndUpdate(
			userID,
			{ status: UserStatus.Inactive },
			{
				new: true,
				runValidators: true,
			},
		);

		if (!user) throw new NotFoundException('Not found user with that ID');

		const stripeCustomer = await this.stripe.customers.search({
			query: `email:\'${user.email}\'`,
		});

		if (stripeCustomer.data.length !== 0) {
			await this.stripe.customers.update(stripeCustomer.data[0].id, {
				metadata: {
					status: UserStatus.Inactive,
				},
			});
		}

		return true;
	}

	async checkExist(uniqueFieldObj: {
		username: string;
		email: string;
	}): Promise<{ value: boolean; message: string }> {
		const isEmailExisted =
			(await this.userModel.exists({ email: uniqueFieldObj.email })) === null
				? false
				: true;
		if (isEmailExisted)
			return {
				value: true,
				message: 'Email already exists',
			};
		const isUsernameExisted =
			(await this.userModel.exists({ username: uniqueFieldObj.username })) ===
			null
				? false
				: true;
		if (isUsernameExisted)
			return {
				value: true,
				message: 'Username already exists',
			};
		return {
			value: false,
			message: null,
		};
	}
}
