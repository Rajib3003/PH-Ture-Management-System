import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandlar } from "./app/middleware/globalErrorHandlar";
import notFound from './app/middleware/notFound';
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

const app = express();

app.use(expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/v1", router)

app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
});


app.use(globalErrorHandlar)
app.use(notFound)

export default app;