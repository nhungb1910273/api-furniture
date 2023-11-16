import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBadRequestResponse,
	ApiConsumes,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';
import { ListOptions } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateRoomFurnitureDto } from './dto/create-room-furniture.dto';
import { UpdateRoomFurnitureDto } from './dto/update-room-furniture.dto';
import { RoomFurnituresService } from './room-furnitures.service';
import { RoomFurniture } from './schemas/room-furnitures.schema';

@ApiTags('room-furnitures')
// @ApiBearerAuth()
@Controller('room-furnitures')
export class RoomFurnituresController {
	constructor(private readonly roomFurnitureService: RoomFurnituresService) {}

	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Room furniture ID' })
	@ApiOperation({
		summary: 'Get room furniture by ID',
	})
	@ApiOkResponse({ type: RoomFurniture, status: 200 })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Room furniture not found!',
	})
	getRoomFurnitureById(@Param('id') id) {
		console.log(id);
		return this.roomFurnitureService.findOne({ _id: id });
	}
	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get many room furniture with many fields',
	})
	@ApiDocsPagination('RoomFurniture')
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Room Furniture not found!',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	getAllRoomFurnitures(@Query() filter: ListOptions<RoomFurniture>) {
		return this.roomFurnitureService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new room furniture 1',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileInterceptor('photo'))
	@ApiConsumes('multipart/form-data')
	createRoomFurniture(
		@Body() input: CreateRoomFurnitureDto,
		@UploadedFile()
		photo: Express.Multer.File,
	) {
		if (photo) {
			return this.roomFurnitureService.createRoomFurniture(input, photo);
		}
	}

	@Public()
	@Patch(':id')
	@ApiOperation({
		summary: 'Update a room furniture',
	})
	@ApiParam({ name: 'id', type: String, description: 'Room furniture ID' })
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileInterceptor('photo'))
	@ApiConsumes('multipart/form-data')
	updateRoomFurniture(
		@Param('id') id,
		@Body() input: UpdateRoomFurnitureDto,
		@UploadedFile()
		photo?: Express.Multer.File,
	) {
		return this.roomFurnitureService.updateOne(input, id, photo);
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a room furniture',
	})
	@ApiParam({ name: 'id', type: String, description: 'Room furniture ID' })
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
			} as SuccessResponse<RoomFurniture>,
		},
		status: 200,
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 404,
		description: 'Room furniture not found!',
	})
	deleteRoomFurniture(@Param('id') id) {
		return this.roomFurnitureService.deleteOne(id);
	}
}
