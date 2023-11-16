import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomFurnituresService } from './room-furnitures.service';
import {
	RoomFurniture,
	RoomFurnitureSchema,
} from './schemas/room-furnitures.schema';
import { RoomFurnituresController } from './room-furnitures.controller';
import { PhotoModule } from '../photos/photo.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: RoomFurniture.name, schema: RoomFurnitureSchema },
		]),
		PhotoModule,
	],
	providers: [RoomFurnituresService],
	exports: [RoomFurnituresService],
	controllers: [RoomFurnituresController],
})
export class RoomFurnituresModule {}
