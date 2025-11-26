import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandlar } from "./app/middleware/globalErrorHandlar";
import notFound from './app/middleware/notFound';
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { envVars } from "./app/config/env";

const app = express();
const allowedOrigins = [
    // envVars.FRONTEND_URL,    
    // envVars.BACKEND_URL,
    envVars.FRONTEND_URL_WEBSIDE,
    envVars.BACKEND_URL_VERCEL
];

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    // origin: envVars.FRONTEND_URL,
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use("/api/v1", router)
app.get("/test-cookie", (req, res) => {
    console.log("All cookies:", req.cookies);
    res.send({ cookies: req.cookies });
});

app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
});


app.use(globalErrorHandlar)
app.use(notFound)

export default app;