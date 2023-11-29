import {
	BadRequestException,
	ForbiddenException,
	// BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model, isValidObjectId } from 'mongoose';
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
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { UpdateProductFavoriteDto } from './dto/update-product-favorite.dto';
// import paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class UsersService {
	private stripe: any;
	// private paypalModel: any;
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,
		private roleService: RolesService,
		private photoService: PhotoService,
		private cartService: CartsService,
	) {}
	async getQuantityUsersStats(): Promise<object> {
		const numberUsers = await this.userModel
			.find({ role: { $ne: UserType.Personnel } })
			.count();

		return { numberUsers };
	}

	async getQuantityCustomersStats(): Promise<object> {
		const numberCustomers = await this.userModel
			.find({ role: UserType.Customer })
			.count();

		return { numberCustomers };
	}

	async getCurrentUser(userID: string): Promise<User> {
		try {
			return await this.userModel
				.findOne({
					_id: userID,
				})
				.populate([
					{
						path: 'roles',
						populate: 'permissions',
					},
					{
						path: 'products',
						populate: {
							path: 'productSkus',
							populate: { path: 'optionValues', populate: 'optionSku' },
						},
					},
				]);
		} catch (error) {
			throw new BadRequestException(
				'An error occurred while retrieving Products',
			);
		}
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
		const findUser = await this.getCurrentUser(userId);
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
		} else {
			throw new NotFoundException('User not found');
		}
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
			return await this.userModel.findOne({
				_id: filter._id,
			});
		} catch (error) {
			throw new BadRequestException('An error occurred while retrieving users');
		}
	}
	async findMany(filter: ListOptions<User>): Promise<ListResponse<User>> {
		const sortQuery = {};
		sortQuery[filter.sortBy] = filter.sortOrder === ESortOrder.ASC ? 1 : -1;
		const limit = filter.limit || 10;
		const offset = filter.offset || 0;

		const rgx = (pattern) => new RegExp(`.*${pattern}.*`);

		const query: any = filter.search ? { ...filter, provinceApply: rgx(filter.search) } : { ...filter };


		if(filter.roles && filter.roles.length){
			query['roles']={ $in: filter.roles } 
		}

		const result = await this.userModel
			.find(query)
			.sort(sortQuery)
			.skip(offset)
			.limit(limit)
			.populate([
				{
					path: 'roles',
					populate: 'permissions',
				},
			]);

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

	async updateProductFavorite(
		userID: string,
		dto: UpdateProductFavoriteDto,
	): Promise<User> {
		console.log('dto', dto);
		const findUser = await this.getCurrentUser(userID);
		if (findUser && findUser.products && findUser.products.length) {
			const findProduct = findUser.products.filter(
				(item) => item._id !== dto.product,
			);
			const findProductExits = findUser.products.filter(
				(item) => item._id === dto.product,
			);
			console.log('findProduct in User', findProductExits);
			// kiem tra san pham ton tai trong san pham o user khong?
			if (findProductExits && findProductExits.length) {
				// cap nhat lai san pham, bo san pham co id giong voi dto
				const user = await this.userModel.findByIdAndUpdate(
					userID,
					{
						products: findProduct.map((item) => item._id),
					},
					{
						new: true,
						runValidators: true,
					},
				);
				if (!user) throw new NotFoundException('Not found user with that ID');
				return user;
			} else {
				const user = await this.userModel.findByIdAndUpdate(
					userID,
					{
						products: [
							...findUser.products.map((item) => item._id),
							dto.product,
						],
					},
					{
						new: true,
						runValidators: true,
					},
				);
				if (!user) throw new NotFoundException('Not found user with that ID');

				return user;
			}
		} else {
			console.log([dto]);
			const user = await this.userModel.findByIdAndUpdate(
				userID,
				{
					products: [dto.product],
				},
				{
					new: true,
					runValidators: true,
				},
			);
			if (!user) throw new NotFoundException('Not found user with that ID');

			return user;
		}
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
