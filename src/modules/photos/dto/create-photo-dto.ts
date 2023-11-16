import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePhotoDto {
	@IsString()
	@IsNotEmpty()
	ownerID: string;

	@IsString()
	@IsOptional()
	name?: string;
}
