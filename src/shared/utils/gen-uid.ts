export function generateUniqueId(): string {
	const timestamp = new Date().getTime().toString();
	const randomString = Math.random().toString(36).substring(2);
	return timestamp + randomString;
}
