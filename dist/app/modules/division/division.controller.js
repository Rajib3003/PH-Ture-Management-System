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
exports.DivisionController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const division_service_1 = require("./division.service");
const createDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const result = yield division_service_1.DivisionService.createDivision(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Division create successfully!!",
        statusCode: http_status_codes_1.default.CREATED,
        data: result,
        // data: {},
    });
}));
const getAllDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield division_service_1.DivisionService.getAllDivision(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "All Division get successfully!!",
        statusCode: http_status_codes_1.default.OK,
        meta: result.meta,
        data: result.data
    });
}));
const getSingleDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield division_service_1.DivisionService.getSingleDivision(slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Single Division get successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result.data
    });
}));
const updateDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const divisionId = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const result = yield division_service_1.DivisionService.updateDivision(divisionId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Division updated successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result,
    });
}));
const deleteDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // delete logic will be implemented here
    const divisionId = req.params.id;
    const result = yield division_service_1.DivisionService.deleteDivision(divisionId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Division deleted successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result,
    });
}));
exports.DivisionController = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
};
