import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupPermissionsService } from './group-permissions.service';
import {
	GroupPermission,
	GroupPermissionSchema,
} from './schemas/group-permissions.schema';
import { GroupPermissionsController } from './group-permissions.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: GroupPermission.name, schema: GroupPermissionSchema },
		]),
	],
	providers: [GroupPermissionsService],
	exports: [GroupPermissionsService],
	controllers: [GroupPermissionsController],
})
export class GroupPermissionsModule {}
