import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkuValue, SkuValueSchema } from './schemas/sku-values.schemas';
import { SkuValuesService } from './sku-values.service';
import { OptionsModule } from '../options/options.module';
import { OptionValuesModule } from '../option-values/option-values.module';
import { SkuValuesController } from './sku-values.controller';
import { OptionNull, OptionNullSchema } from './schemas/option-null.schema';
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: SkuValue.name, schema: SkuValueSchema },
		]),
		MongooseModule.forFeature([
			{ name: OptionNull.name, schema: OptionNullSchema },
		]),
		OptionsModule,
		OptionValuesModule,
	],
	providers: [SkuValuesService],
	exports: [SkuValuesService],
	controllers: [SkuValuesController],
})
export class SkuValuesModule {}
