"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const notice_service_1 = require("./notice.service");
const createNotice = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield notice_service_1.NoticeService.createNotice(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Notice created successfully!",
        statusCode: http_status_codes_1.default.CREATED,
        data: result,
    });
}));
exports.NoticeController = {
    createNotice
};
// noticeRouters.post("/", async (req: Request, res: Response) => {
//   try {
//     const { title, date, description, link, photo } = req.body;
//     if (!title || !date) {
//       return res.status(400).json({ message: "Title and date are required." });
//     }
//     const existingNotice = await Notice.findOne({ title });
//     if (existingNotice) {
//       return res.status(400).json({
//         message: "This title already exists! Please use a different title.",
//       });
//     }
//     const newNotice = new Notice({title, date, description, link, photo,});
//     const savedNotice = await newNotice.save();
//     res.status(201).json({
//       message: "Notice created successfully",
//       data: savedNotice,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });
// noticeRouters.get("/", async (req: Request, res: Response) => {
//   try {
//     const filterDate = req.query.date as string; 
//     const filterTitle = req.query.title as string; 
//     const filter: any = {};
//     if (filterDate) {
//       filter.date = new Date(filterDate);
//     }
//     if (filterTitle) {      
//       filter.title = { $regex: filterTitle, $options: "i" };
//     }
//     const sortOrder = req.query.sort === "asc" ? 1 : -1;
//     const limit = parseInt(req.query.limit as string) || 100;
//     const notices = await Notice.find(filter)
//       .sort({ updatedAt: sortOrder }) 
//       .limit(limit);
//     const totalNotices = await Notice.countDocuments(filter);
//     res.status(200).json({
//       success: true,
//       message: "Notices fetched successfully",
//       total: totalNotices,   
//       count: notices.length, 
//       data: notices,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error,
//     });
//   }
// });
// noticeRouters.get("/:noticeId", async (req: Request, res: Response) => {  
//   try {
//     const noticeId = req.params.noticeId;    
//     const result = await Notice.findById(noticeId);        
//     if (!result) {
//       return res.status(404).json({ message: "Notice not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Single Notice fetched successfully",
//       data: result, 
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });
// noticeRouters.patch("/:noticeId", async (req: Request, res: Response) => {
//   try {
//     const noticeId = req.params.noticeId;
//     const { title, ...restBody } = req.body;
//     if (title) {
//       const existingNotice = await Notice.findOne({
//         title: title,
//         _id: { $ne: noticeId },   
//       });
//       if (existingNotice) {
//         return res.status(400).json({
//           success: false,
//           message: "Title already exists. Please use a different title.",
//         });
//       }
//     }
//     const updatedNotice = await Notice.findByIdAndUpdate(noticeId,{ title, ...restBody }, {
//       new: true,
//     });
//     if (!updatedNotice) {
//       return res.status(404).json({
//         success: false,
//         message: "Notice not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Notice updated successfully",
//       data: updatedNotice,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error,
//     });
//   }
// });
// noticeRouters.delete("/:noticeId", async (req: Request, res: Response) => {
//   try {
//     const noticeId = req.params.noticeId; 
//     const deletedNotice = await Notice.findByIdAndDelete(noticeId);
//     if (!deletedNotice) {
//       return res.status(404).json({ message: "Notice not found" });
//     }
//     res.status(200).json({ message: "Notice deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });
