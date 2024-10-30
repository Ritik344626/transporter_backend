import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { createResponse, formatUser } from "../utils/utils";
import { configDotenv } from "dotenv";
import { compare } from "bcrypt";
import { UserService } from "../services/users.service";
import { Sequelize, SequelizeScopeError } from "sequelize";
configDotenv();

export const generateToken = (user: User) => jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role,
},
    process.env.JWT_SECRET || 'check');

const AuthRouter = Router();

AuthRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as Partial<User>;
    try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return createResponse(res, { status: false, payload: { message: 'Invalid email or password' } });
        }
        const isValidPassword = await compare(password!, user.password);
        if (!isValidPassword) {
            return createResponse(res, { status: false, payload: { message: 'Incorrect password' } });
        }
        const userDetails = formatUser(user, generateToken(user));
        return createResponse(res, { status: true, payload: userDetails });
    } catch (error) {
        let errors = error;
        if (error instanceof SequelizeScopeError) errors = error.message;
        return createResponse(res, { status: false, payload: errors });
    }
});

AuthRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userDetails = req.body as User;
        const [error, savedUser] = await new UserService().createUser(userDetails);
        if (!savedUser || error) {
            let errors = error;
            if (error instanceof SequelizeScopeError) errors = error.message;
            return createResponse(res, { status: false, payload: errors });
        }
        const user = await User.findOne({ where: { email: userDetails.email } });
        const newUser = formatUser(user!, generateToken(user!))
        return createResponse(res, { status: true, payload: newUser });
    } catch (error) {
        let errors = error;
        if (error instanceof SequelizeScopeError) errors = error.message;
        return createResponse(res, { status: false, payload: errors });
    }
})

export default AuthRouter;
