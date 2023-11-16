import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
	OptionValue,
	OptionValueSchema,
} from './schemas/option-values.schemas';
import { OptionValuesService } from './option-values.service';
import { OptionValuesController } from './option-values.controller';
import { PhotoModule } from '../photos/photo.module';
import { OptionsModule } from '../options/options.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: OptionValue.name, schema: OptionValueSchema },
		]),
		PhotoModule,
		OptionsModule,
	],
	providers: [OptionValuesService],
	exports: [OptionValuesService],
	controllers: [OptionValuesController],
})
export class OptionValuesModule {}
