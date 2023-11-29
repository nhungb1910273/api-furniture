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
import { CreateShippingDto } from './dto/create-shipping.dto';
import { Shipping } from './schemas/shippings.schema';
import { ShippingsService } from './shippings.service';
import { UpdateShippingDto } from './dto/update-shipping.dto';
@ApiTags('shippings')
@Controller('shippings')
export class ShippingsController {
	constructor(private readonly shippingService: ShippingsService) {}
	@Public()
	@Get(':id')
	@ApiParam({ name: 'id', type: String, description: 'Shipping ID' })
	@ApiOkResponse({ type: Shipping, status: 200 })
	@ApiNotFoundResponse({
		type: NotFoundException,
		status: 400,
		description: 'Shipping not found!',
	})
	findById(@Param('id') id) {
		return this.shippingService.findOne({
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
	findAll(@Query() filter: ListOptions<Shipping>) {
		return this.shippingService.findAll(filter);
	}

	@Public()
	@Post()
	create(@Body() input: CreateShippingDto) {
		return this.shippingService.create(input);
	}

	@Public()
	@Patch(':id')
	update(@Param('id') id, @Body() input: UpdateShippingDto) {
		return this.shippingService.updateOne(input, id);
	}
	@Public()
	@Delete(':id')
	remove(@Param('id') id) {
		return this.shippingService.deleteShipping(id);
	}
}
