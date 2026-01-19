import jwt from 'jsonwebtoken';
import validator from "validator";

// API for login

const login = async(req, res) =>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({success: false, message: "Missing Details"});
        }

        // validating email
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"});
        }

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(
                {
                    email,
                    password
                },
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );
            res.json({success: true, token});

        }else{
            res.json({success: false, message: "Invalid credentials"})
        }
    } catch(error){
        console.log(error);
        res.json({success: false, message:error.message});
    }
}

export {
    login
}