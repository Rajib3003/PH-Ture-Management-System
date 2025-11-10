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
exports.TourService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("../tour/tour.model");
const tour_constant_1 = require("./tour.constant");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if division exists
    // const divisionExists = await Division.findById(payload.division);
    // if (!divisionExists) throw new Error("Division not found");
    // Check if tourType exists
    // const tourTypeExists = await TourType.findById(payload.tourType);
    // if (!tourTypeExists) throw new Error("Tour type not found");
    const existingTour = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = queryBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_model_1.Tour.findOne({ slug });
    return {
        data: result,
    };
});
const updateTour = (tourId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(tourId);
    if (!existingTour) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour ID not found", "");
    }
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatePayloadImages = (payload.images || [])
            .filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter(imageUrl => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatePayloadImages];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(tourId, payload, { new: true, runValidators: true });
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_model_1.Tour.findByIdAndDelete(tourId);
    return null;
});
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create logic here
    const existingTourType = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    const name = payload;
    return yield tour_model_1.TourType.create({ name });
});
const getAllTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield tour_model_1.TourType.find();
});
const updateTourType = (tourTypesId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // update logic will be implemented here
    const existingTourType = yield tour_model_1.TourType.findById(tourTypesId);
    if (!existingTourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Types ID not found", "");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(tourTypesId, payload, { new: true, runValidators: true });
    return updatedTourType;
});
const deleteTourType = (tourTypesId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(tourTypesId);
    if (!existingTourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour Types ID not found", "");
    }
    yield tour_model_1.TourType.findByIdAndDelete(tourTypesId);
    return null;
});
exports.TourService = {
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
