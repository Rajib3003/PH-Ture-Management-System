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
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const result = yield notice_service_1.NoticeService.createNotice(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Notice created successfully!",
        statusCode: http_status_codes_1.default.CREATED,
        data: result,
    });
}));
const getAllNotices = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield notice_service_1.NoticeService.getAllNotices(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Notice retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleNotice = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield notice_service_1.NoticeService.getSingleNotice(slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Single Notice get successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result.data
    });
}));
const updateNotice = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noticeId = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const result = yield notice_service_1.NoticeService.updateNotice(noticeId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Notice updated successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result
    });
}));
const deleteNotice = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noticeId = req.params.id;
    const result = yield notice_service_1.NoticeService.deleteNotice(noticeId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Notice delete successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result
    });
}));
const getAllNoticeTypes = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notice_service_1.NoticeService.getAllNoticeTypes();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "All Notice Types get successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result,
    });
}));
const createNoticeType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield notice_service_1.NoticeService.createNoticeType(name);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Notice Types successfully!!",
        statusCode: http_status_codes_1.default.CREATED,
        data: result,
    });
}));
const updateNoticeType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noticeTypesId = req.params.id;
    const payload = req.body;
    const result = yield notice_service_1.NoticeService.updateNoticeType(noticeTypesId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Notice Type updated successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result,
    });
}));
const deleteNoticeType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const noticeTypesId = req.params.id;
    const result = yield notice_service_1.NoticeService.deleteNoticeType(noticeTypesId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Notice Type deleted successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result,
    });
}));
exports.NoticeController = {
    createNotice,
    getAllNotices,
    getSingleNotice,
    updateNotice,
    deleteNotice,
    getAllNoticeTypes,
    createNoticeType,
    updateNoticeType,
    deleteNoticeType,
};
