export const getUniqueArray = <T>(arr: T[], key: keyof T) => {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
};
/**
 *
 * @param data array data sis import
 * @returns
 */
export function convertArrayToCSV(data: unknown[]): string {
	if (!data.length) return '';
	//NOTE: get header csv by first element
	let result = Object.keys(data[0]).join(',') + '\n';
	data.forEach((val) => {
		result +=
			Object.values(val)
				.map((str) => {
					if (typeof str === 'string') {
						//NOTE: add double-quotes if fields contain comma
						str = str.includes(',') ? `"${str}"` : str;
						//NOTE: remove line break
						str = str.replace(/\r|\n|\t/gi, '').trim();
					}
					return str;
				})
				.join(',') + '\n';
	});
	return result;
}
export function isUniqueArray<T>(data: T[], key: keyof T): boolean {
	const uniqueValues = new Set(data.map((v) => v[key]));
	return uniqueValues.size === data.length;
}
