import UserModel from '../models/UserModel.js'
import asyncHandler from 'express-async-handler'
import { verifyToken } from '../config/token.js'

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = verifyToken(token);
            req.user = await UserModel.findById(decoded.id).select("-password");
            next()
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if(!token){
        res.status(401);
        throw new Error("Not authorized, no token");
    }
})

export default protect;