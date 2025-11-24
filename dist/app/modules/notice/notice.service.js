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
exports.NoticeService = void 0;
const QueryBuilder_1 = require("./../../utils/QueryBuilder");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const notice_models_1 = require("./notice.models");
const notice_constant_1 = require("./notice.constant");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createNotice = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNotice = yield notice_models_1.Notice.findOne({ title: payload.title });
    if (existingNotice) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A notice with this title already exists.", "");
    }
    const notice = yield notice_models_1.Notice.create(payload);
    return notice;
});
const getAllNotices = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(notice_models_1.Notice.find(), query);
    const notices = queryBuilder
        .search(notice_constant_1.noticeSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        notices.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleNotice = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notice_models_1.Notice.findOne({ slug });
    return {
        data: result
    };
});
const updateNotice = (noticeId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNotice = yield notice_models_1.Notice.findById(noticeId);
    if (!existingNotice) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Notice Id not found", "");
    }
    if (payload.images && payload.images.length > 0 && existingNotice.images && existingNotice.images.length > 0) {
        payload.images = [...payload.images, ...existingNotice.images];
    }
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingNotice.images && existingNotice.images.length > 0) {
        const restDBImages = existingNotice.images.filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatePayloadImages = (payload.images || [])
            .filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter(imageUrl => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatePayloadImages];
    }
    const updateNotice = yield notice_models_1.Notice.findByIdAndUpdate(noticeId, payload, { new: true, runValidators: true });
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingNotice.images && existingNotice.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updateNotice;
});
const deleteNotice = (noticeId) => __awaiter(void 0, void 0, void 0, function* () {
    yield notice_models_1.Notice.findByIdAndDelete(noticeId);
    return null;
});
const createNoticeType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNoticeType = yield notice_models_1.NoticeType.findOne({ name: payload.name });
    if (existingNoticeType) {
        throw new Error("Notice type already exists.");
    }
    const name = payload;
    return yield notice_models_1.NoticeType.create({ name });
});
const getAllNoticeTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield notice_models_1.NoticeType.find();
});
const updateNoticeType = (noticeTypesId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNoticeType = yield notice_models_1.NoticeType.findById(noticeTypesId);
    if (!existingNoticeType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Notice Types ID not found", "");
    }
    const updateNoticeType = yield notice_models_1.NoticeType.findByIdAndUpdate(noticeTypesId, payload, { new: true, runValidators: true });
    return updateNoticeType;
});
const deleteNoticeType = (noticeTypesId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingNoticeType = yield notice_models_1.NoticeType.findById(noticeTypesId);
    if (!existingNoticeType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Notice Types ID not found", "");
    }
    yield notice_models_1.NoticeType.findByIdAndDelete(noticeTypesId);
    return null;
});
exports.NoticeService = {
    createNotice,
    getAllNotices,
    getSingleNotice,
    updateNotice,
    deleteNotice,
    createNoticeType,
    getAllNoticeTypes,
    updateNoticeType,
    deleteNoticeType
};
