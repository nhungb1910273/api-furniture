import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiDocsPagination(entity: string) {
	return applyDecorators(
		ApiQuery({
			name: 'limit',
			type: Number,
			required: false,
			description: 'Number of items limited',
			examples: {
				'10': {
					value: 10,
					description: `Get 10 ${entity}s`,
				},
				'50': {
					value: 50,
					description: `Get 50 ${entity}s`,
				},
			},
		}),
		ApiQuery({
			name: 'offset',
			type: Number,
			required: false,
			description: 'Number of items skipped',
			examples: {
				'0': {
					value: 0,
					description: 'Start from 0',
				},
				'10': {
					value: 10,
					description: `Skip 10 ${entity}s`,
				},
			},
		}),
		ApiQuery({
			name: 'search',
			type: String,
			required: false,
			description: 'Search value for the expected result',
		}),
		ApiQuery({
			name: 'sortBy',
			type: String,
			required: false,
			description: `Sort by field of ${entity}`,
			examples: {
				CREATED_AT: {
					value: 'createdAt',
				},
				ID: {
					value: '_id',
				},
			},
		}),
		ApiQuery({
			name: 'sortOrder',
			enum: ['asc', 'desc'],
			required: false,
			description: 'Sort ascending or descending',
			example: 'asc',
		}),
	);
}
