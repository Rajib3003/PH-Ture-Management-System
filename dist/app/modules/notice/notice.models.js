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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notice = exports.NoticeType = void 0;
const mongoose_1 = require("mongoose");
const noticeTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true }
}, {
    timestamps: true,
    versionKey: false
});
exports.NoticeType = (0, mongoose_1.model)("TourType", noticeTypeSchema);
const noticeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    date: { type: Date, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    noticeType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "NoticeType",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
});
noticeSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("title")) {
            const baseSlug = this.title.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Notice.exists({ slug })) {
                slug = `${slug}-${counter++}`;
            }
            this.slug = slug;
        }
        next();
    });
});
noticeSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const notice = this.getUpdate();
        if (notice.title) {
            const baseSlug = notice.title.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Notice.exists({ slug })) {
                slug = `${slug}-${counter++}`;
            }
            notice.slug = slug;
        }
        this.setUpdate(notice);
        next();
    });
});
exports.Notice = (0, mongoose_1.model)('Notice', noticeSchema);
