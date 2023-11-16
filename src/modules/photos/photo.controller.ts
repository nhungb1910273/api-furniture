import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	Query,
	UnsupportedMediaTypeException,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
	ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import {
	FileFieldsInterceptor,
	FileInterceptor,
} from '@nestjs/platform-express';
import {
	ErrorResponse,
	ListOptions,
	ListResponse,
} from 'src/shared/response/common-response';
import { Photo } from './schemas/photo.schema';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo-dto';
import { Public } from '../auth/decorators/public.decorator';
import { ApiDocsPagination } from 'src/decorators/swagger-form-data.decorator';

@ApiTags('photo')
@Controller('photos')
export class PhotoController {
	constructor(private readonly photoService: PhotoService) {}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Upload a image',
		description:
			'Note: ownerID is the ID of the object for which you want to upload the image',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
					description: 'accept: jpeg|png',
				},
				ownerID: {
					type: 'string',
					format: 'ObjectId',
				},
			},
		},
	})
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: {
					_id: '123456789',
					ownerID: 'ownerID',
					name: 'name-image',
					imageURL: 'http://localhost:8080/ownerID/name-image',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as Photo,
			},
		},
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: 'File size invalid!',
	})
	@ApiUnsupportedMediaTypeResponse({
		type: UnsupportedMediaTypeException,
		status: 415,
		description: 'File invalid!',
	})
	@UseInterceptors(FileInterceptor('file'))
	uploadOneFile(
		@Body() photoDto: CreatePhotoDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000 * 1000 }), // 1MB
					new FileTypeValidator({ fileType: /(?:jpeg|png)/i }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		return this.photoService.uploadOneFile(file, photoDto.ownerID);
	}

	@Post('bulk')
	@ApiOperation({
		summary: 'Upload many photos',
		description:
			'Note: ownerID is the ID of the object for which you want to upload the image',
	})
	@ApiConsumes('multipart/form-data')
	@ApiOkResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '123456789',
						ownerID: 'ownerID',
						name: 'name-image',
						imageURL: 'http://localhost:8080/ownerID/name-image',
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				],
				total: 1,
				options: {},
			} as ListResponse<Photo>,
		},
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				photos: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
						description: 'accept: jpeg|png',
					},
				},
				ownerID: {
					type: 'string',
					format: 'ObjectId',
				},
			},
		},
	})
	@UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
	uploadManyFile(
		@UploadedFiles(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000 * 1000 }), // 1MB
					new FileTypeValidator({ fileType: /(?:jpeg|png)/i }),
				],
			}),
		)
		files: {
			photos?: Express.Multer.File[];
		},
		@Body() photoDto: CreatePhotoDto,
	) {
		if (files.photos) {
			return this.photoService.uploadManyFile(files, photoDto.ownerID);
		}
		throw new BadRequestException('No files uploaded');
	}

	@Public()
	@Get()
	@ApiDocsPagination('PhotoSchema')
	@ApiOperation({
		summary: 'Get many photos with fields of photoschema',
	})
	findMany(@Query() filter: ListOptions<Photo>) {
		return this.photoService.findMany(filter);
	}

	@Delete(':photoID')
	@ApiOperation({
		summary: 'Delete image by id',
	})
	@ApiParam({ name: 'photoID', type: String, description: 'ID image' })
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				code: 200,
				message: 'Success',
				data: null,
			},
		},
	})
	@ApiBadRequestResponse({
		schema: {
			example: {
				code: '400',
				message: '[Input] invalid!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	@ApiNotFoundResponse({
		schema: {
			example: {
				code: '404',
				message: 'Photo not found!',
				details: null,
			} as ErrorResponse<null>,
		},
	})
	delete(@Param('photoID') id) {
		return this.photoService.delete(id);
	}

	@Public()
	@Get(':photoID')
	@ApiOperation({
		summary: 'Get image by id',
	})
	@ApiParam({ name: 'photoID', type: String, description: 'Image ID' })
	async findOneByID(@Param('photoID') id: string) {
		return this.photoService.findOneByID(id);
	}
}
