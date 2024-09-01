// Imported Global Variables
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userAuthRouter = require('./Routers/userAuthRouter.js');
const userFileUpload = require('./Routers/userFileUpload.js');
const UserDetailsRouter = require('./Routers/userDetailsRouter.js');
require('dotenv').config();
// PORT Variable
const PORT = process.env.PORT || 8080;
// Imported Middlewares
app.use(cors());
app.use(express.json());
app.use('/Uploads', express.static('Uploads'));
// Custom Middlewares
// 
// MongoDB Connection
connectDB();
async function connectDB() {
    try {
        const DB_Connection_Response = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING) || undefined;
        // 
        if (DB_Connection_Response) {
            console.log('DB Connected!');
        }
    } catch (error) {
        console.log(error)
    }
}
// Routes
app.use('/', userAuthRouter);
app.use('/', userFileUpload);
app.use('/ProfileDetails', UserDetailsRouter);
// Server Listening
app.listen(PORT, () => {
    console.log(`Server is Running on PORT No: ${PORT}`)
})