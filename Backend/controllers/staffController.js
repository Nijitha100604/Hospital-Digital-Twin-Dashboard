import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import staffModel from "../models/staffModel.js";

// API for adding staff

const addStaff = async(req, res)=>{

    try{
        const {name, email, password, gender, role, phone} = req.body;
        const imageFile = req.file;

        // data check
        if(!name || !email || !password || !gender || !role || !phone || !imageFile){
            return res.json({success: false, message: "Missing Details"})
        }

        // validating email
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"});
        }

        // check existingStaff
        const existingStaff = await staffModel.findOne({ email });
        if (existingStaff) {
            return res.json({ success: false, message: "Staff already exists" });
        }

        // validating password
        if(password.length < 8){
            return res.json({success: false, message: "Password must be at least 8 characters long"});
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});
        const imageUrl = imageUpload.secure_url;

        const staffData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            gender,
            role,
            phone,
            date:Date.now()
        }

        const newStaff = new staffModel(staffData);
        await newStaff.save();

        res.json({success: true, message: "Staff Added Successfully!"});

    }catch(error){
        console.log(error);
        res.json({success: false, message:error.message});
    }

}

export {
    addStaff
}