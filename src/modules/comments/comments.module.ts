import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment, CommentSchema } from './schemas/comments.schemas';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
	],
	providers: [CommentsService],
	exports: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule {}
