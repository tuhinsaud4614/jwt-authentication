import { RequestHandler } from "express";
import { ISuccessResponse } from "../../utility";

const protectedHome: RequestHandler = async (_, res, __) => {
  return res.status(201).json({
    code: 201,
    data: { info: "You are protected" },
    success: true,
    timeStamp: new Date().toISOString(),
  } as ISuccessResponse);
};

export default protectedHome;
