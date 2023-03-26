import { Request } from "express";
import { IUser } from "../models/User.js";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface TypedRequestBody<T> extends Request {
	body: T;
}
export interface IDocUser extends IUser {
	_id: Types.ObjectId;
}
export interface TypedRequestBodyWithUser<T> extends Request {
	body: T;
}
