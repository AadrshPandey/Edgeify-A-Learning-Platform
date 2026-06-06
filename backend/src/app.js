import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import ApiResponse from "./utils/ApiResponse.js";
import ApiError from "./utils/ApiError.js";

const app = express();

app.use(cookieParser());

const allowedOrigin = [process.env.CORS_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"];

app.use(cors({
    origin : function(origin, callback){
        if(!origin) {
            callback(null, true);
        }
        if(allowedOrigin.includes(origin)){
            callback(null, true);
        }
        else{
            callback(new ApiError(200, "Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"))

//USER REGISTER
app.use("/api/v1/user", userRouter);

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode, err.message, err.success));
})

export default app;