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
exports.DivisionService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const division_model_1 = require("./division.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_constant_1 = require("./division.constant");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'A division with this name already exists.', '');
    }
    // const baseSlug = payload.name.toLowerCase().split(' ').join('-');
    // let slug = `${baseSlug}-division`;
    // let counter = 0; 
    // while (await Division.exists({ slug})) {
    //     slug = `${slug}-${counter++}`;
    // }
    // payload.slug = slug;
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const getAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const divisions = queryBuilder
        .search(division_constant_1.divisionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        divisions.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug });
    return {
        data: division,
    };
});
const updateDivision = (divisionId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // update logic will be implemented here
    const existingDivision = yield division_model_1.Division.findById(divisionId);
    if (!existingDivision) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Division ID not found", "");
    }
    const duplicateDivision = yield division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: divisionId },
    });
    if (duplicateDivision) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A division with this name already exists.", "");
    }
    // if(payload.name){
    //     const baseSlug = payload.name.toLowerCase().split(' ').join('-');
    //     let slug = `${baseSlug}-division`;
    //     let counter = 0; 
    //     while (await Division.exists({ slug})) {
    //         slug = `${slug}-${counter++}`;
    //     }
    //     payload.slug = slug;
    // }
    const updateDivision = yield division_model_1.Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true });
    if (payload.thumbnail && existingDivision.thumbnail) {
        // delete the old thumbnail from cloudinary
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(existingDivision.thumbnail);
    }
    return updateDivision;
});
const deleteDivision = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    yield division_model_1.Division.findByIdAndDelete(divisionId);
    return null;
});
exports.DivisionService = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
};
// createDivision name function create korechi ja database ar sathe connect tai async use kora hoyeche, karon database theke data fetch korte somoy lage tai async await use kora hoyeche. 
// payload er moddhe Partial<IDivision> use kora hoyeche karon amra payload er maje sob data pabo are na. tai Partial use kora hoyeche. sathe type IDivision use kora hoyeche karon amra Division interface theke data nibo.
// payload theke name, slug, thumbnail, description ke destructure kora hoyeche.
// slug jodi na thake tahole name theke slug generate kora hoyeche. slug generate korar jonno name ke trim kore lower case e convert kora hoyeche. r jodi slug thake tahole seta ke trim kore lower case e convert kora hoyeche.
// name and slug er uniqueness check kora hoyeche. jodi name or slug already thake tahole error throw kora hoyeche.
// Division model theke findOne method use kore name and slug er uniqueness check kora hoyeche.
// jodi name and slug unique hoy tahole notun division create kora hoyeche. Division model theke create method use kore notun division create kora hoyeche.
// create method er moddhe name, slug, thumbnail, description pass kora hoyeche.
