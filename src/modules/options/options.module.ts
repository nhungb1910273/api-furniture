import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OptionsController } from './options.controller';
import { OptionsService } from './options.service';
import { Option, OptionSchema } from './schemas/options.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Option.name, schema: OptionSchema }]),
	],
	providers: [OptionsService],
	exports: [OptionsService],
	controllers: [OptionsController],
})
export class OptionsModule {}
