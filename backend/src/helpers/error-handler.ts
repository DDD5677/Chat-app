import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

function errorHandler(
   err: any,
   req: Request,
   res: Response,
   next: NextFunction
) {
   let errors: any = {};
   if (err.code === "P2002") {
      errors.email = "that username is already registered";
      return res.status(400).json(errors);
   }

   return res
      .status(500)
      .json({ error: err, message: "Internal server error in error handler" });
}

export default errorHandler;
