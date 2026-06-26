import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import ApiResponse from "./utils/ApiResponse.js";
import ApiError from "./utils/ApiError.js";
import categoryRouter from "./routes/category.routes.js";
import videoRouter from "./routes/video.routes.js";
import progressRouter from "./routes/progress.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import historyRouter from "./routes/history.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

const app = express();

app.use(cookieParser());

const allowedOrigin = [process.env.CORS_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"];

app.use(cors({
    origin : function(origin, callback){
        if(!origin) {
            return callback(null, true);
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

app.use(express.json({limit: "1mb"}));
app.use(express.urlencoded({extended:true, limit:"16mb"}));
app.use(express.static("public"))

//USER ROUTER
app.use("/api/v1/user", userRouter);
//COURSE ROUTER
app.use("/api/v1/course", courseRouter);
//CATEGORY ROUTER
app.use("/api/v1/category", categoryRouter);
//VIDEO ROUTER
app.use("/api/v1/video", videoRouter);
//PROGREESS ROUTER
app.use("/api/v1/progress", progressRouter);
//ENROLLMENT ROUTER
app.use("/api/v1/enrollment", enrollmentRouter);
//REVIEW ROUTER
app.use("/api/v1/review", reviewRouter);
//HISTORY ROUTER
app.use("/api/v1/history", historyRouter);
//DASHBOARD
app.use("/api/v1/dashboard", dashboardRouter);

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode, err.message, err.success));
})

export default app;