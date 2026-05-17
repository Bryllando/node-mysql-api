"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config.json"));
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
const account_model_1 = __importDefault(require("../accounts/account.model"));
const refresh_token_model_1 = __importDefault(require("../accounts/refresh-token.model"));
const db = {};
exports.default = db;
initialize();
async function initialize() {
    const { DB_HOST: host = config_json_1.default.database.host, DB_PORT: port = config_json_1.default.database.port, DB_USER: user = config_json_1.default.database.user, DB_PASSWORD: password = config_json_1.default.database.password, DB_NAME: database = config_json_1.default.database.database, DB_SSL, NODE_ENV } = process.env;
    const isProduction = NODE_ENV === 'production';
    if (!isProduction) {
        const connection = await promise_1.default.createConnection({ host, port: Number(port), user, password });
        // Create DB if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
    }
    const dialectOptions = {};
    if (DB_SSL === 'true') {
        dialectOptions.ssl = { require: true, rejectUnauthorized: false };
    }
    // Connect to DB
    const sequelize = new sequelize_1.Sequelize(database, user, password, {
        dialect: 'mysql',
        host,
        port: Number(port),
        dialectOptions
    });
    // Init models
    db.Account = (0, account_model_1.default)(sequelize);
    db.RefreshToken = (0, refresh_token_model_1.default)(sequelize);
    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);
    // Sync models with database
    await sequelize.sync();
}
