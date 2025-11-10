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
exports.TourController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tour_service_1 = require("./tour.service");
const createTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const result = yield tour_service_1.TourService.createTour(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Tour create successfully!!",
        statusCode: http_status_codes_1.default.CREATED,
        data: result,
        // data: {},
    });
}));
const getAllTours = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield tour_service_1.TourService.getAllTours(query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tours retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield tour_service_1.TourService.getSingleTour(slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Single Tour get successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result.data
    });
}));
const updateTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const result = yield tour_service_1.TourService.updateTour(tourId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Tour updated successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result
    });
}));
const deleteTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = req.params.id;
    const result = yield tour_service_1.TourService.deleteTour(tourId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Tour deleted successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result
    });
}));
const getAllTourTypes = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.getAllTourTypes();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "All Tour Types get successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result,
    });
}));
const createTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield tour_service_1.TourService.createTourType(name);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Tour Types create successfully!!",
        statusCode: http_status_codes_1.default.CREATED,
        data: result
    });
}));
const updateTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypesId = req.params.id;
    const payload = req.body;
    const result = yield tour_service_1.TourService.updateTourType(tourTypesId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Tour Type updated successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result
    });
}));
const deleteTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypesId = req.params.id;
    const result = yield tour_service_1.TourService.deleteTourType(tourTypesId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Tour Type deleted successfully!!",
        statusCode: http_status_codes_1.default.OK,
        data: result
    });
}));
exports.TourController = {
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType
};
