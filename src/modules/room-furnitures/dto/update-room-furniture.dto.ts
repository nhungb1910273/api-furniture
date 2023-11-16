import { PartialType } from '@nestjs/swagger';
import { CreateRoomFurnitureDto } from './create-room-furniture.dto';

export class UpdateRoomFurnitureDto extends PartialType(
	CreateRoomFurnitureDto,
) {}
