import jwt from 'jsonwebtoken';
import staffModel from '../models/staffModel.js';

// authentication middleware

const authUser = async(req, res, next)=>{
    try {
        
        const {token} = req.headers
        if(!token){
            return res.json({success: false, message: "Not Authorized Login again"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const staff = await staffModel.findById(decoded.id).select("-password");

        if(!staff){
            return res.json({success: false, message: "User no longer exists"});
        }

        next();

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Not authorized login again"});
    }
}

export default authUser;