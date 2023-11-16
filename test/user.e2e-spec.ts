import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { UserRole } from '../src/modules/users/schemas/user.schema';

describe('UserController (e2e)', () => {
	const userUrl = 'http://localhost:3000/api/users';
	const authUrl = 'http://localhost:3000/api/auth';

	let accessToken;

	const mockUser: any = {
		displayName: 'test user',
		email: 'emailuser@test.com',
		password: 'password',
		role: UserRole.MEMBER,
		avatar: '',
	};
	let userId;

	describe('/auth/login (POST)', () => {
		it('it should login with registered account', () => {
			return request(authUrl)
				.post('/login')
				.set('Accept', 'application/json')
				.send({
					email: 'test1@test.com',
					password: '123123123',
				})
				.expect((response: request.Response) => {
					const { access_token } = response.body;
					accessToken = access_token;

					expect(access_token).toBeTruthy();
				});
		});
	});

	describe('/users (POST)', () => {
		it('it should create and return a new user', () => {
			return request(userUrl)
				.post('')
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + accessToken)
				.send(mockUser)
				.expect((response: request.Response) => {
					const { _id } = response.body;
					userId = _id;
					expect(_id).toBeTruthy();
				})
				.expect(HttpStatus.CREATED);
		});
	});

	describe('/users/{id} (GET)', () => {
		it('it should get a user by id', () => {
			return request(userUrl)
				.get(`/${userId}`)
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + accessToken)
				.expect((response: request.Response) => {
					console.log(response.body);
					const { name, _id } = response.body;

					expect(_id).toEqual(userId);
					expect(name).toEqual(mockUser.name);
				});
		});
	});

	describe('/users (GET)', () => {
		it('it should get the users', () => {
			return request(userUrl)
				.get('')
				.query({
					limit: 10,
					offset: 0,
				})
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + accessToken)
				.expect((response: request.Response) => {
					console.log(response.body);
					expect(response.body.data.length).toEqual(10);
				});
		});
	});

	describe('/users (PATCH)', () => {
		it('it should update and return new user', () => {
			const updateName = 'updated';
			return request(userUrl)
				.patch('')
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + accessToken)
				.send({
					id: userId,
					displayName: updateName,
				})
				.expect((response: request.Response) => {
					const { displayName } = response.body;

					expect(displayName).toEqual(updateName);
				});
		});
	});

	describe('/users/{id} (DELETE)', () => {
		it('it should update and return new user', () => {
			return request(userUrl)
				.delete(`/${userId}`)
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + accessToken)
				.expect(HttpStatus.OK);
		});
	});
});
