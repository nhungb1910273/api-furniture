import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiDocsPaginationVer2(entity: string) {
	return applyDecorators(
		ApiQuery({
			name: 'sort',
			type: String,
			required: false,
			description: `Usage: enter fields to sort by them\n\nPattern: sort=field1,field2`,
			examples: {
				'No sort (default)': {
					value: '',
					description: 'Default: sort = createdAt',
				},
				'Sort by multiple fields': {
					value: 'name,createdAt',
					description: `Explain: list of ${entity}s sort by name, if name is the same will sort by createdAt`,
				},
			},
		}),
		ApiQuery({
			name: 'fields',
			type: String,
			required: false,
			description: `Usage: enter fields want to repsonse\n\nPattern: fields=field1,field2`,
			examples: {
				'No field (default)': {
					value: '',
					description: 'Default: fields = undefined (choose all fields)',
				},
				'Choose fields to response': {
					value: 'name,createdAt',
					description: `Explain: Reponse name, createdAt fields of list ${entity}s`,
				},
			},
		}),
		ApiQuery({
			name: 'limit',
			type: Number,
			required: false,
			description: 'Usage: enter a number to limit items',
			examples: {
				'No limit (default)': {
					value: '',
					description: `Default: limit = infinity number`,
				},
				'Limit with value': {
					value: '1',
					description: `limit = 1`,
				},
			},
		}),
		ApiQuery({
			name: 'page',
			type: Number,
			required: false,
			description: 'Usage: enter a page number to list items base on limit',
			examples: {
				'No page (default)': {
					value: '',
					description: 'Default: page = 1',
				},
				'Page with value': {
					value: '1',
					description: 'page = 1',
				},
			},
		}),
		ApiQuery({
			name: 'properties condition',
			required: false,
			description: `Usage: enter fields with condition\n\nUse case 1: /field=value (list ${entity}s have {field} equal {value})\n\nUse case 2: /field[gte]=value (list ${entity}s have {field} greater than or equal {value})\n\nUse case 3: /field[gt]=value (list ${entity}s have {field} greater than {value})\n\nUse case 4: /field[lte]=value (list ${entity}s have {field} less than or equal {value})\n\nUse case 5: /field[lt]=value (list ${entity}s have {field} less than {value})\n\nUse case 6: /field[regex]=value (list ${entity}s have {field} contain {value})\n\nUse case 7: /field[search]=value (list ${entity}s have {field} contain {value})`,
			schema: {
				type: 'object',
				additionalProperties: {
					type: 'string',
				},
			},
			style: 'form',
			explode: true,
			examples: {
				'No field condition (default)': {
					value: '',
					description: 'No condition',
				},
				'Use case 1': {
					value: {
						field: 'value',
					},
					description: `Explain: URL /field=value . List ${entity}s have {field} equal {value}`,
				},
				'Use case 2': {
					value: {
						field: {
							gte: 'value',
						},
					},
					description: `Explain: URL /field[gte]=value. List ${entity}s have {field} greater than or equal {value}`,
				},
				'Use case 3': {
					value: {
						field: {
							gt: 'value',
						},
					},
					description: `Explain: URL /field[gt]=value. List ${entity}s have {field} greater than {value}`,
				},
				'Use case 4': {
					value: {
						field: {
							lte: 'value',
						},
					},
					description: `Explain: URL /field[lte]=value. List ${entity}s have {field} less than or equal {value}`,
				},
				'Use case 5': {
					value: {
						field: {
							lt: 'value',
						},
					},
					description: `Explain: URL /field[lt]=value. List ${entity}s have  {field} less than {value}`,
				},
				'Use case 6': {
					value: {
						field: {
							regex: 'value',
						},
					},
					description: `Explain: URL /field[regex]=value. List ${entity}s have {field} contain {value}`,
				},
				'Use case 7': {
					value: {
						field: {
							search: 'value',
						},
					},
					description: `Explain: URL /field[search]=value. List ${entity}s have {field} contain {value}`,
				},
			},
		}),
	);
}
