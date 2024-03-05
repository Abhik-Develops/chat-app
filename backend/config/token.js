import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const generateToken = (id, time, verification=false) =>{
    const secret = (verification ? id : '') + process.env.JWT_SECRET;
    return jwt.sign({id}, secret, {
        expiresIn: time,
    })
}

const verifyToken = (token, id='') => {
    const new_secret = id + process.env.JWT_SECRET;
    return jwt.verify(token, new_secret);
}

export { generateToken, verifyToken };