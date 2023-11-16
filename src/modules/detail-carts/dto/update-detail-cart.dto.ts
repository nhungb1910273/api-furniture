import { PartialType } from '@nestjs/swagger';
import { CreateDetailCartDto } from './create-detail-cart.dto';

export class UpdateDetailCartDto extends PartialType(CreateDetailCartDto) {}
