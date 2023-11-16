import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role, RoleSchema } from './schemas/roles.schema';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
		PermissionsModule,
	],
	providers: [RolesService],
	exports: [RolesService],
	controllers: [RolesController],
})
export class RolesModule {}
