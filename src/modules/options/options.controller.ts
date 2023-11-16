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
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ListOptions } from 'src/shared/response/common-response';
import { Public } from '../auth/decorators/public.decorator';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { OptionsService } from './options.service';
import { Option } from './schemas/options.schema';

@ApiTags('options')
@Controller('options')
export class OptionsController {
	constructor(private readonly optionService: OptionsService) {}
	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Option ID' })
	@ApiOkResponse({ type: Option, status: 200 })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Option not found!',
	})
	findById(@Param('id') id) {
		return this.optionService.findOne({
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
	findAll(@Query() filter: ListOptions<Option>) {
		return this.optionService.findAll(filter);
	}

	@Public()
	@Post()
	create(@Body() createOptionDto: CreateOptionDto) {
		return this.optionService.create(createOptionDto);
	}

	@Public()
	@Patch(':id')
	@ApiParam({ name: 'id', type: String, description: 'Option ID' })
	update(@Param('id') id, @Body() updateOptionDto: UpdateOptionDto) {
		return this.optionService.updateOne(updateOptionDto, id);
	}

	@Public()
	@Delete(':id')
	remove(@Param('id') id) {
		return this.optionService.deleteOne(id);
	}

	@Public()
	@Delete()
	removeAll() {
		return this.optionService.deleteMany();
	}
}
