import mongoose from 'mongoose'

const connectDB = async (DB_URL) =>{
    const DB_OPTIONS = {
        dbname: process.env.DB_NAME,
    }
    try{
        await mongoose.connect(DB_URL, DB_OPTIONS)
        console.log("Database connected successfully...")
    }
    catch(error){
        console.log(error)
    }
}

export default connectDB