import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";

export function zod({ body, headers, query, params }: { body?: z.ZodObject<any, any>, headers?: z.ZodObject<any, any>, query?: z.ZodObject<any, any>, params?: z.ZodObject<any, any> }) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            body?.parse(req.body);
            headers?.parse(req.headers);
            query?.parse(req.query);
            params?.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid data', details: errorMessages });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error' });
            }
        }
    };
}