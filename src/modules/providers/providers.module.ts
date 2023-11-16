import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Provider, ProviderSchema } from './schemas/providers.schema';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Provider.name, schema: ProviderSchema },
		]),
	],
	providers: [ProvidersService],
	exports: [ProvidersService],
	controllers: [ProvidersController],
})
export class ProvidersModule {}
