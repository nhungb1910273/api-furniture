import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permissions.schema';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { GroupPermissionsModule } from '../group-permissions/group-permissions.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Permission.name, schema: PermissionSchema },
		]),
		GroupPermissionsModule,
	],
	providers: [PermissionsService],
	exports: [PermissionsService],
	controllers: [PermissionsController],
})
export class PermissionsModule {}
