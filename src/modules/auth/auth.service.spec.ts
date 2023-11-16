// import { HttpStatus } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PassportModule } from '@nestjs/passport';
// import { Test, TestingModule } from '@nestjs/testing';
// import { appConfig } from '../../app.config';
// import { User, UserSchema } from '../users/schemas/user.schema';
// import { UsersModule } from '../users/users.module';
// import { AuthService } from './auth.service';
// import { SignupDto } from './dto/signup-dto';
// import { JwtStrategy } from './jwt.strategy';

// describe('AuthService', () => {
// 	let service: AuthService;

// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			imports: [
// 				MongooseModule.forRoot(appConfig.mongoURI),
// 				MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
// 				UsersModule,
// 				PassportModule,
// 				JwtModule.register({
// 					secret: appConfig.jwtSecret,
// 					signOptions: {
// 						// expiresIn: appConfig.jwtExpiresIn,
// 					},
// 				}),
// 			],
// 			providers: [AuthService, JwtStrategy],
// 		}).compile();

// 		service = module.get<AuthService>(AuthService);
// 	});

// 	it('should be defined', () => {
// 		expect(service).toBeDefined();
// 	});

// 	it('should be register a new account', async () => {
// 		const input: SignupDto = {
// 			email: 'test1@test.com',
// 			password: '123123123',
// 			displayName: 'Test user',
// 		};

// 		const res = await service.signup(input);

// 		expect(res.statusCode).toEqual(HttpStatus.CREATED);
// 	});
// });
