"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_handler_1 = __importDefault(require("./_middleware/error-handler"));
const accounts_controller_1 = __importDefault(require("./accounts/accounts.controller"));
const swagger_1 = __importDefault(require("./_helpers/swagger"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// allow cors requests from any origin and with credentials
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.CORS_ORIGIN];
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use('/accounts', accounts_controller_1.default);
app.use('/api-docs', swagger_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
