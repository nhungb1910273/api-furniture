import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Encrypt {
	static async hashData(password: string) {
		const salt = randomBytes(16).toString('hex');
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;
		return `${buf.toString('hex')}.${salt}`;
	}

	static async compareData(
		storedPassword: string,
		suppliedPassword: string,
	): Promise<boolean> {
		const [hashedPassword, salt] = storedPassword.split('.');
		const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
		const suppliedPasswordBuf = (await scryptAsync(
			suppliedPassword,
			salt,
			64,
		)) as Buffer;
		return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
	}
}
