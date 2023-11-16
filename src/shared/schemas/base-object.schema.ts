import { Prop } from '@nestjs/mongoose';

export class BaseObject {
	_id: string;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}
