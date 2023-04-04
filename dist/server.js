"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongo_1 = __importDefault(require("./config/mongo"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const routes_1 = __importDefault(require("./routes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
//// cors
app.use((0, cors_1.default)({ origin: "*" }));
//// limit
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 2 * 60 * 1000,
    max: 10000,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 40 * 1024 * 1024 },
    abortOnLimit: true,
}));
(0, mongo_1.default)()
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err));
app.use("/api/v1", routes_1.default);
app.use("/*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Url topilmadi !"
    });
});
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
