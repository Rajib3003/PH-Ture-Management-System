"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notice = void 0;
const mongoose_1 = require("mongoose");
const NoticeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    link: { type: String },
    photo: { type: String }
}, {
    timestamps: true,
    versionKey: false,
});
exports.Notice = (0, mongoose_1.model)('Notice', NoticeSchema);
