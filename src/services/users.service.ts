import { User } from '../models/user.model';
import logger from '../utils/logger';
import { hashPassword } from '../utils/utils';

export class UserService {

    constructor() { }

    async createUser(userDetails: User): Promise<[null | any, User | null]> {
        try {
            let user = userDetails;
            user.password = await hashPassword(user.password);
            const savedUser = await User.create(user);
            return [null, savedUser];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }

    async updateUser(userId: string, userDetails: User): Promise<[null | any, User | null]> {
        try {
            const { name, email, password, role, gender } = userDetails
            const [error, user] = await this.getUserById(userId);
            if (user) {
                user.name = name;
                user.email = email;
                user.password = password;
                user.role = role;
                user.gender = gender;
                const updatedUser = await user.save();
                return [null, updatedUser]
            }
            return [error, null]
        } catch (error) {
            logger.error('Error', error);
            return [error, null]
        }
    }

    async deleteUser(userId: string): Promise<[null | any, boolean | null]> {
        try {
            const [error, user] = await this.getUserById(userId);
            if (user) {
                await user.destroy();
                return [null, true];
            }
            return [error, null];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }

    async getUsers(filter?: Object): Promise<[null | any, Array<User> | null]> {
        try {
            let filters = {};
            if (filter) {
                filters = { ...filter };
            }
            const users = await User.findAll(filters);
            if (!users || users.length === 0) {
                return [null, []];
            }
            return [null, users];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }

    async getUserById(userId: string): Promise<[null | any, User | null]> {
        try {
            const user = await User.findByPk(userId);
            return [null, user];
        } catch (error) {
            logger.error('Error', error);
            return [error, null];
        }
    }
}
