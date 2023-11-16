import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { User } from '../schemas/user.schema';
import { userData } from './data/user-data';

@Injectable()
export class UserSeeder implements Seeder {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
	) {}

	async seed(): Promise<any> {
		await this.userModel.insertMany(userData);
	}
	async drop(): Promise<any> {
		await this.userModel.deleteMany({});
	}
}
