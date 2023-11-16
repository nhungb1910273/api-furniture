import { PartialType } from '@nestjs/swagger';
import { CreateBillItemDto } from './create-bill-item.dto';

export class UpdateBillItemDto extends PartialType(CreateBillItemDto) {}
