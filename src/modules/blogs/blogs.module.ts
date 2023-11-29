import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoModule } from '../photos/photo.module';
import { RoomFurnituresModule } from '../room-furnitures/room-furnitures.module';
import { Blog, BlogSchema } from './schemas/blogs.schema';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { CategoriesModule } from '../categories/categories.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		PhotoModule,
		RoomFurnituresModule,
		CategoriesModule,
		CommentsModule,
	],
	providers: [BlogsService],
	exports: [BlogsService],
	controllers: [BlogsController],
})
export class BlogsModule {}
