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
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ListOptions } from 'src/shared/response/common-response';
import { SuccessResponse } from 'src/shared/response/success-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateOptionValueDto } from './dto/create-option-value.dto';
import { UpdateOptionValueDto } from './dto/update-option-value.dto';
import { OptionValuesService } from './option-values.service';
import { OptionValue } from './schemas/option-values.schemas';

@ApiTags('option-values')
@Controller('option-values')
export class OptionValuesController {
	constructor(private readonly optionValueService: OptionValuesService) {}
	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Option value ID' })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Option value not found!',
	})
	findById(@Param('id') id) {
		return this.optionValueService.findOne({
			_id: id,
		});
	}

	@Public()
	@Get()
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	findAll(@Query() filter: ListOptions<OptionValue>) {
		return this.optionValueService.findAll(filter);
	}

	@Public()
	@Post()
	@ApiOperation({
		summary: 'Create a new option value',
	})
	@ApiBadRequestResponse({
		type: BadRequestException,
		status: 400,
		description: '[Input] invalid!',
	})
	@UseInterceptors(FileInterceptor('photo'))
	@ApiConsumes('multipart/form-data')
	create(
		@Body() input: CreateOptionValueDto,
		@UploadedFile()
		photo?: Express.Multer.File,
	) {
		if (photo) {
			return this.optionValueService.create(input, photo);
		}
	}
	@Public()
	@Patch(':id')
	@ApiParam({ name: 'id', type: String, description: 'Option value ID' })
	@UseInterceptors(FileInterceptor('photo'))
	@ApiConsumes('multipart/form-data')
	update(
		@Param('id') id,
		@Body() updateOptionDto: UpdateOptionValueDto,
		@UploadedFile()
		photo?: Express.Multer.File,
	) {
		return this.optionValueService.updateOne(updateOptionDto, id, photo);
	}

	@Public()
	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a option value',
	})
	remove(@Param('id') id) {
		return this.optionValueService.deleteOne(id);
	}

	@Public()
	@Delete()
	@ApiOperation({
		summary: 'Delete a Option Value',
	})
	@ApiResponse({
		schema: {
			example: {
				code: 200,
				message: 'Success',
			} as SuccessResponse<null>,
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
		description: 'Option Value not found!',
	})
	deleteMany() {
		return this.optionValueService.deleteMany();
	}
}
