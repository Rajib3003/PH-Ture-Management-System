import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createNoticeZodSchema } from "./notice.validation";
import { NoticeController } from "./notice.controllers";





const router = Router();

router.post(
    "/create",
    checkAuth(...Object.values(Role)),
    // multerUpload.single("file"),
    validateRequest(createNoticeZodSchema) ,
    NoticeController.createNotice
);

export const NoticeRoutes = router