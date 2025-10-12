"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_scrert = "kehfrqez20732x4r29843yr";
class JWTService {
    static generateTokenForUser(user) {
        const payload = {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email
        };
        const token = jsonwebtoken_1.default.sign(payload, jwt_scrert);
        return token;
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, jwt_scrert);
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = JWTService;
