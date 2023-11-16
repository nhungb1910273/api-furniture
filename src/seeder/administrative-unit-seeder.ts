import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Province } from 'src/modules/address/schemas/province.schema';
import { level1s } from 'dvhcvn';
import { District } from 'src/modules/address/schemas/district.schema';
import { Types } from 'mongoose';
import { Commune } from 'src/modules/address/schemas/commune.schema';

@Injectable()
export class AdministrativeUnitSeeder implements Seeder {
	constructor(
		@InjectModel(Province.name)
		private readonly provinceModel: Model<Province>,

		@InjectModel(District.name)
		private readonly districtModel: Model<District>,

		@InjectModel(Commune.name)
		private readonly communeModel: Model<Commune>,
	) {}

	async seed(): Promise<any> {
		const provinces: any[] = [];
		const districts: any[] = [];
		const communes: any[] = [];
		console.log('level1s', level1s);

		level1s.forEach((element) => {
			const objectProvinceID = new Types.ObjectId();
			provinces.push({
				_id: objectProvinceID,
				name: element.name,
				code: element.id,
			});

			element.children.forEach((el) => {
				const objectDistrictID = new Types.ObjectId();
				districts.push({
					_id: objectDistrictID,
					name: el.name,
					code: el.id,
					province: objectProvinceID,
				});

				el.children.forEach((key) => {
					const objectCommuneID = new Types.ObjectId();
					communes.push({
						_id: objectCommuneID,
						name: key.name,
						code: key.id,
						district: objectDistrictID,
					});
				});
			});
		});

		await this.provinceModel.insertMany(provinces);
		await this.districtModel.insertMany(districts);
		await this.communeModel.insertMany(communes);
	}

	async drop(): Promise<any> {
		await this.provinceModel.deleteMany({});
		await this.districtModel.deleteMany({});
		await this.communeModel.deleteMany({});
	}
}
