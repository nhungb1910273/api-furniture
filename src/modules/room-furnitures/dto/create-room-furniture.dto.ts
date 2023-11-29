import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Photo } from 'src/modules/photos/schemas/photo.schema';
import { RoomFurnitureStatus } from '../schemas/room-furnitures.schema';

export class CreateRoomFurnitureDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty({ type: 'string', format: 'binary' })
	@IsOptional()
	photo: Photo;

	@ApiProperty({
		enum: RoomFurnitureStatus,
		default: RoomFurnitureStatus.Active,
	})
	@IsOptional()
	status: RoomFurnitureStatus;
}
