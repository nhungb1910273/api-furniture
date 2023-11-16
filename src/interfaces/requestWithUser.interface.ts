import { User } from 'src/modules/users/schemas/user.schema';

interface RequestWithUser {
	user: User;
}

export default RequestWithUser;
