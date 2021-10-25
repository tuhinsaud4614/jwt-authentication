import { RequestHandler } from "express";
import logger from "../../logger";
import { HttpError } from "../../models/utility.model";
import redisClient, { asyncRedisGet } from "../../redis-connect";
import { ISuccessResponse } from "../../utility";

const logout: RequestHandler = async (req, res, next) => {
  try {
    // @ts-ignore
    const token = req.body.token;
    // @ts-ignore
    const { id } = req.user as {
      id: string;
    };

    const redisToken = await asyncRedisGet(id);

    if (!redisToken || token !== JSON.parse(redisToken)) {
      return next(new HttpError("Something went wrong.", 500));
    }

    redisClient.del(id, (err, _) => {
      if (err) {
        logger.error(err);
        throw err;
      }
      return res.status(200).json({
        code: 204,
        data: { message: "Logout successfully." },
        success: true,
        timeStamp: new Date().toISOString(),
      } as ISuccessResponse);
    });
  } catch (error) {
    logger.error(error);
    return next(new HttpError("Something went wrong.", 500));
  }
};

export default logout;
