const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const ejs=require('ejs')
const session = require('express-session');
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'sourav',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}));


const multer=require('multer')
app.use('/upload',express.static(path.join(__dirname,'upload')))
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.includes('png') ||
    file.mimetype.includes('jpg') ||
    file.mimetype.includes('jpeg')){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}
app.use(multer({storage:fileStorage,fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('post_image'))


const userAuth = require("./middleware/userAuth");
const adminAuth = require("./middleware/adminAuth");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

const dbDriver="mongodb+srv://souravklizos:Sourav@mongo12@cluster0.9k2fahb.mongodb.net/nodeblog"

const userRoute = require("./route/userRoute");
const adminRoute=require('./route/adminRoute')

app.use(userAuth.authJwt);
app.use(adminAuth.authJwt);

app.use(userRoute);
app.use('/admin',adminRoute);

// port = process.env.PORT || 10874;

// mongoose.connect(dbDriver, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(res => {
//     app.listen(port, () => {
//         console.log("Database Connected...");
//         console.log(`Server Running At http://localhost:${port}`);
//     })
// }).catch(err => {
//     console.log(err);
// })

mongoose.set("strictQuery", false);


mongoose.connect(process.env.MONGODB_URL_LOCAL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB!"))
	.catch((err) => console.log(err));

const port = process.env.PORT || 3002

app.listen(port, () => {
	console.log(`App running on port ${port} !`)
})