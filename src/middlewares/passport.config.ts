import { configDotenv } from "dotenv";
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from "passport-jwt";
import { User } from "../models/user.model";
import { createResponse } from "../utils/utils";
import { NextFunction, Request, Response } from "express";
configDotenv();

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const options: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || '',
};

const passportConfig = (passport: any) => {
    passport.use(new Strategy(options, async (jwtPayload, done) => {
        try {
            const user = await User.findByPk(jwtPayload.id);
            if (!user) {
                return done(null, false, { message: 'Unable to find user' });
            }
            return done(null, user);
        } catch (error) {
            console.error('Authentication error:', error);
            return done(error, false);
        }
    }));
};

export const isAuthorizedRole = (roles: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user: User | undefined = req.user as User;
        if (!user || !roles.includes(user.role)) {
            return createResponse(res, { status: false, code: 403, payload: { message: 'Insufficient permission' } })
        }
        next();
    }
}

export default passportConfig;