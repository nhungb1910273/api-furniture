export interface QueryObject {
	sort?: string;
	fields?: string;
	limit?: number;
	page?: number;
	[key: string]: any; // key[gte|gt|lte|lt|regex|search]=value
}

export interface ListResponseV2<T> {
	total: number;
	queryOptions: QueryObject;
	items: T[];
}

export class QueryAPI {
	public queryOptions: QueryObject;

	/**
	 * @param queryModel is query from mongoose
	 *  @param queryObj is query from request
	 */
	constructor(public queryModel: any, public queryObj: QueryObject) {}

	filter() {
		const queryObj = { ...this.queryObj };

		const excludedFields = ['sort', 'fields', 'limit', 'page'];
		excludedFields.forEach((el) => delete queryObj[el]);

		this.queryOptions = queryObj;

		let queryStr = JSON.stringify(queryObj);

		queryStr = queryStr
			.replace(/%2C/g, ',')
			.replace(/\b(search)\b/g, `regex`)
			.replace(/\b(gte|gt|lte|lt|regex)\b/g, (match) => `$${match}`)
			.replace(/(?<="\$regex":)"(.*?)"/g, (match) => `${match},"$options":"i"`);

		this.queryModel = this.queryModel.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		if (this.queryObj.sort) {
			const sortBy = this.queryObj.sort.split(',').join(' ');

			this.queryModel = this.queryModel.sort(sortBy);
			this.queryOptions.sort = sortBy;
		} else {
			this.queryModel = this.queryModel.sort('createdAt');
			this.queryOptions.sort = 'createdAt';
		}

		return this;
	}

	limitfields() {
		const queryStr = JSON.stringify(this.queryObj).replace(/%2C/g, ',');
		const queryStrObj = JSON.parse(queryStr);

		if (queryStrObj.fields) {
			const fields = queryStrObj.fields.split(',').join(' ');

			this.queryModel = this.queryModel.select(fields);
			this.queryOptions.fields = fields;
		} else {
			this.queryModel = this.queryModel.select('-__v');
		}

		return this;
	}

	paginate() {
		const queryStr = JSON.stringify(this.queryObj).replace(/%2C/g, ',');
		const queryStrObj = JSON.parse(queryStr);

		const page = queryStrObj.page * 1 || 1;
		const limit = queryStrObj.limit * 1 || Number.POSITIVE_INFINITY;

		const skip = (page - 1) * limit;

		this.queryModel = this.queryModel.skip(skip).limit(limit);
		this.queryOptions.page = page;
		this.queryOptions.limit = limit === Number.POSITIVE_INFINITY ? null : limit;

		return this;
	}
}
