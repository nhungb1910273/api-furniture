import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import { appConfig } from './app.config';
import { User, UserSchema } from './modules/users/schemas/user.schema';

import {
	District,
	DistrictSchema,
} from './modules/address/schemas/district.schema';
import {
	Province,
	ProvinceSchema,
} from './modules/address/schemas/province.schema';
import {
	Commune,
	CommuneSchema,
} from './modules/address/schemas/commune.schema';
import { AdministrativeUnitSeeder } from './seeder/administrative-unit-seeder';

seeder({
	imports: [
		MongooseModule.forRoot(appConfig.mongoURI),

		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([
			{ name: District.name, schema: DistrictSchema },
		]),
		MongooseModule.forFeature([
			{ name: Province.name, schema: ProvinceSchema },
		]),
		MongooseModule.forFeature([{ name: Commune.name, schema: CommuneSchema }]),
	],
}).run([
	AdministrativeUnitSeeder,
	// FacilitySeeder,
	// CategorySeeder,
	// ReviewSeeder,
	// PhotoSeeder,
	// ScheduleSeeder,
	// CounterSeeder,
	// PackageSeeder,
	// PackageTypeSeeder,
	// UserSeeder,
]);
