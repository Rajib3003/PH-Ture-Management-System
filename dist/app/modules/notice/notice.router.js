"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeRoutes = void 0;
const express_1 = require("express");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const notice_validation_1 = require("./notice.validation");
const notice_controllers_1 = require("./notice.controllers");
const router = (0, express_1.Router)();
router.post("/create", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), 
// multerUpload.single("file"),
(0, validateRequest_1.validateRequest)(notice_validation_1.createNoticeZodSchema), notice_controllers_1.NoticeController.createNotice);
exports.NoticeRoutes = router;
