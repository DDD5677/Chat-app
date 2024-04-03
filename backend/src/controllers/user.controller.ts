import { NextFunction, Request, Response, query } from "express";
import prisma from "../db/db.server";

class UserController {
   async getUsers(req: Request, res: Response, next: NextFunction) {
      try {
         console.log(req.query);
         let filter: any = {};
         if (req.query.userId) {
            filter = {
               NOT: {
                  id: +req.query.userId,
               },
            };
         }
         if (req.query.search) {
            filter.name = {
               contains: req.query.search,
               mode: "insensitive",
            };
         }
         const users = await prisma.user.findMany({
            where: filter,
         });
         if (!users) {
            return res.status(404).send({
               success: false,
               message: "Users is not found",
            });
         }
         res.status(200).send(users);
      } catch (error) {
         console.log("getUsers", error);
         next(error);
      }
   }
   async getOneUser(req: Request, res: Response, next: NextFunction) {
      try {
         const filter: any = {};
         if (req.params.id) {
            filter.id = +req.params.id;
         }
         const user = await prisma.user.findUnique({
            where: filter,
            include: {
               conversations: true,
            },
         });
         if (!user) {
            return res.status(404).send({
               success: false,
               message: "User is not found",
            });
         }
         res.status(200).send(user);
      } catch (error) {
         console.log("getOneUser", error);
         next(error);
      }
   }
}

export default new UserController();
