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
exports.resolver = void 0;
const db_1 = require("../../client/db");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const accessKeyId = process.env.AWS_S3_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_S3_ACCESS_SECRET || "";
const s3ClientConfig = {
    region: "ap-south-1",
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
};
const s3Client = new client_s3_1.S3Client(s3ClientConfig);
const queries = {
    getAllTweets: () => db_1.prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
    getSignedURLForTweet: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { imageType, imageName }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthorized");
        const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", 'image/webp'];
        if (!allowedImageTypes.includes(imageType))
            throw new Error("Unsupported Image Type");
        const extension = imageType.split("/")[1];
        const key = `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}.${extension}`;
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: "krushna-twitter-dev",
            Key: key,
            ContentType: imageType,
        });
        const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
        return signedURL;
    })
};
const mutations = {
    createTweet: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        if (!ctx.user) {
            throw new Error("You are not authorized");
        }
        const tweet = yield db_1.prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } }
            }
        });
        return tweet;
    })
};
const extraResolvers = {
    Tweet: {
        author: (parent) => db_1.prismaClient.user.findUnique({ where: { id: parent.authorId } })
    }
};
exports.resolver = { mutations, extraResolvers, queries };
