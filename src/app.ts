import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandlar } from "./app/middleware/globalErrorHandlar";
import notFound from './app/middleware/notFound';


const app = express();
app.use(express.json());
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