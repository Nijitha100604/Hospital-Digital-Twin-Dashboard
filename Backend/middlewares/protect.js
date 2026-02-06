import jwt from 'jsonwebtoken';

const protect = (req, res, next) =>{
    try {
        const {token} = req.headers;
        if(!token){
            return res.json({success: false, message: "Not Authorized Login again"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export default protect;