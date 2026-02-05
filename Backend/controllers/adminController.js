import jwt from 'jsonwebtoken';
import validator from "validator";
import staffModel from './../models/staffModel.js';
import bcrypt from 'bcrypt';

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

        const staff = await staffModel.findOne({email});

        if(!staff){
            return res.json({success: false, message: "staff not found"});
        }

        const isMatch = await bcrypt.compare(password, staff.password);

        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {
                id: staff._id,
                role: staff.role
            },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        res.json({success: true, 
            token,
            staff: {
                id: staff._id,
                fullName: staff.fullName,
                email: staff.email,
                profilePhoto: staff.profilePhoto,
                designation: staff.designation
            }
        });
    } catch(error){
        console.log(error);
        res.json({success: false, message:error.message});
    }
}

// change password

const changePassword = async(req, res) =>{
    try{
        
       const {email, newPassword} = req.body;
       if(!email || !newPassword){
        return res.json({success: false, message: "Email and new password are required"});
       }

       const staff = await staffModel.findOne({email});
       if(!staff){
        return res.json({success: false, message: "Staff not found"});
       }

       if(newPassword.length < 8){
        return res.json({success: false, message: "Password must be at least 8 characters"});
       }

       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(newPassword, salt);
       staff.password = hashedPassword;

       await staff.save();

       res.json({success: true, message: "Password reset successfully"});

    }catch(error){
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}


export {
    login,
    changePassword,
}