import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Province, ProvinceDocument } from './schemas/province.schema';
import { District, DistrictDocument } from './schemas/district.schema';
import { ListResponse } from 'src/shared/response/common-response';
import { Commune, CommuneDocument } from './schemas/commune.schema';
@Injectable()
export class AddressService {
	constructor(
		@InjectModel(Province.name) private provinceModel: Model<ProvinceDocument>,
		@InjectModel(District.name) private districtModel: Model<DistrictDocument>,
		@InjectModel(Commune.name) private communeModel: Model<CommuneDocument>,
	) {}

	async findAllProvince(): Promise<ListResponse<Province>> {
		try {
			const provinces = await this.provinceModel.find();

			return {
				items: provinces,
				total: provinces.length,
				options: {},
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async findDistrictsByProvinceID(id: string): Promise<ListResponse<District>> {
		try {
			const districts = await this.districtModel.find({ province: id });
			if (districts.length === 0) {
				throw new NotFoundException('Districts of province not found!');
			}
			return {
				items: districts,
				total: districts.length,
				options: {},
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async findCommunesByDistrictID(id: string): Promise<ListResponse<Commune>> {
		try {
			const communes = await this.communeModel.find({ district: id });
			if (communes.length === 0) {
				throw new NotFoundException('Commune of district not found!');
			}
			return {
				items: communes,
				total: communes.length,
				options: {},
			};
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
	async findCommuneByName(name: string): Promise<Commune> {
		try {
			const commune = await this.communeModel.findOne({ name: name });
			if (commune) {
				return commune;
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async findDistrictByName(name: string): Promise<District> {
		try {
			const district = await this.districtModel.findOne({ name: name });
			if (district) {
				return district;
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}

	async findProvinceByName(name: string): Promise<Province> {
		try {
			const province = await this.provinceModel.findOne({ name: name });
			if (province) {
				return province;
			}
		} catch (err) {
			throw new BadRequestException(err);
		}
	}
}
