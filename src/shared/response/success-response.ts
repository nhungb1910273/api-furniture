import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T, F = unknown> {
	@ApiProperty({ type: Number, description: 'Total data in a list resp' })
	total?: number;

	@ApiProperty({ type: Object, description: 'The filter apply' })
	filter?: F | unknown;

	@ApiProperty({ type: Object, isArray: true, description: 'Data returned' })
	data?: T | unknown;
}
