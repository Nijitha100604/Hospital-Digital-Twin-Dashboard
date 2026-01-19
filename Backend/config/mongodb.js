import mongoose from 'mongoose';

const connectDB = async() =>{

    try{
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/twin_dashboard`)
    }catch(error){
        console.log("Error Connecting to Database :" , error);
        process.exit(1);
    }
}

export default connectDB;