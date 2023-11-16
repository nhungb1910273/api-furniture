import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
	const authUrl = 'http://localhost:3000/api/auth';

	let accessToken;
	let refreshToken;

	const mockUser: any = {
		displayName: 'User test',
		email: 'email@test.com',
		password: 'password',
	};

	describe('/auth/register (POST)', () => {
		it('it should register a user', () => {
			return request(authUrl)
				.post('/register')
				.set('Accept', 'application/json')
				.send(mockUser)
				.expect(HttpStatus.CREATED);
		});
	});

	describe('/auth/login (POST)', () => {
		it('it should login with registered account', () => {
			return request(authUrl)
				.post('/login')
				.set('Accept', 'application/json')
				.send({
					email: mockUser.email,
					password: mockUser.password,
				})
				.expect((response: request.Response) => {
					const { access_token, refresh_token } = response.body;
					accessToken = access_token;
					refreshToken = refresh_token;

					expect(access_token).toBeTruthy();
					expect(refresh_token).toBeTruthy();
				});
		});
	});

	describe('/auth/refresh-token (POST)', () => {
		it('it should create new access and refresh token', () => {
			return request(authUrl)
				.post('/refresh-token')
				.set('Accept', 'application/json')
				.send({
					token: refreshToken,
				})
				.expect((response: request.Response) => {
					const { access_token, refresh_token } = response.body;
					accessToken = access_token;
					refreshToken = refresh_token;

					expect(access_token).toBeTruthy();
					expect(refresh_token).toBeTruthy();
				});
		});
	});

	describe('/auth/me (GET)', () => {
		it('it should return the new object user', () => {
			return request(authUrl)
				.get('/me')
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + accessToken)
				.expect((response: request.Response) => {
					const { name } = response.body;

					expect(name).toEqual(mockUser.displayName);
				});
		});
	});
});
