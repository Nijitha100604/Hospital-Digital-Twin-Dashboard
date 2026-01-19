import jwt from 'jsonwebtoken';

// authentication middleware

const authUser = async(req, res, next)=>{
    try {
        
        const {token} = req.headers
        if(!token){
            return res.json({success: false, message: "Not Authorized Login again"})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        if(token_decode.email !== process.env.ADMIN_EMAIL ||  token_decode.password !== process.env.ADMIN_PASSWORD){
            return res.json({success: false, message: "Not Authorized Login again"})
        }

        next()

    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message});
    }
}

export default authUser;