import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createNoticeTypesZodSchema, createNoticeZodSchema, updateNoticeTypesZodSchema, updateNoticeZodSchema } from "./notice.validation";
import { NoticeController } from "./notice.controllers";
import { multerUpload } from "../../config/multer.config";





const router = Router();

router.get("/notice-types",
    NoticeController.getAllNoticeTypes
);
router.post("/create-notice-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    validateRequest(createNoticeTypesZodSchema),
    NoticeController.createNoticeType
);
router.patch(
    "/notice-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    validateRequest(updateNoticeTypesZodSchema), 
    NoticeController.updateNoticeType
);
router.delete(
    "/notice-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    NoticeController.deleteNoticeType
);

router.get(
    "/", 
    NoticeController.getAllNotices
);


router.post(
    "/create",
    checkAuth(...Object.values(Role)),
    multerUpload.array("files"),
    validateRequest(createNoticeZodSchema) ,
    NoticeController.createNotice
);

router.get(
    "/:slug", 
    NoticeController.getSingleNotice
);
router.patch(
    "/:id", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    multerUpload.array("files"),
    validateRequest(updateNoticeZodSchema),
    NoticeController.updateNotice
);

router.delete(
    "/:id", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    NoticeController.deleteNotice
);

export const NoticeRoutes = router