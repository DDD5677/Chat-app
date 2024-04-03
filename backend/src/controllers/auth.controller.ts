import { NextFunction, Request, Response } from "express";
import prisma from "../db/db.server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
class AuthController {
   async register(req: Request, res: Response, next: NextFunction) {
      try {
         if (req.body.password.length < 6) {
            return res.status(400).json({
               password: "password length must be at least 6 characters",
            });
         }
         const salt = await bcrypt.genSalt();
         const user = await prisma.user.create({
            data: {
               name: req.body.name,
               username: req.body.username,
               phone: req.body.phone,
               password: bcrypt.hashSync(req.body.password, salt),
               image: req.body.image,
            },
         });

         if (!user) {
            return res.status(404).send("the user cannot be created");
         }

         res.status(200).send({
            success: true,
            message: "User is registered successufully",
         });
      } catch (error) {
         console.log("register", error);
         next(error);
      }
   }
   async login(req: Request, res: Response, next: NextFunction) {
      try {
         const user = await prisma.user.findUnique({
            where: {
               username: req.body.username,
            },
            include: {
               conversations: {
                  include: {
                     users: true,
                  },
               },
            },
         });
         const ACCESS_SECRET = process.env.ACCESS_SECRET;
         const REFRESH_SECRET = process.env.REFRESH_SECRET;
         if (!ACCESS_SECRET || !REFRESH_SECRET) {
            return res.status(404).send({
               error: "The access secret or refresh secret is not found",
            });
         }
         const err = {
            username: "",
            password: "",
         };
         if (!user) {
            err.username = "the user not found";
            return res.status(400).send(err);
         }

         if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const accessToken = jwt.sign(
               {
                  id: user.id,
               },
               ACCESS_SECRET,
               {
                  expiresIn: "1h",
               }
            );
            const refreshToken = jwt.sign(
               {
                  id: user.id,
               },
               REFRESH_SECRET,
               {
                  expiresIn: "1d",
               }
            );
            res.cookie("refreshToken", refreshToken, {
               httpOnly: true,
               maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
               secure: process.env.NODE_ENV === "production",
               //sameSite: "none",
            });
            res.status(200).send({
               user: {
                  id: user.id,
                  username: user.username,
                  name: user.name,
                  image: user.image,
                  phone: user.phone,
                  conversations: user.conversations,
               },
               token: accessToken,
            });
         } else {
            err.password = "the password is wrong";
            res.status(400).send(err);
         }
      } catch (error) {
         console.log("login", error);
         next(error);
      }
   }
   async refresh(req: Request, res: Response, next: NextFunction) {
      try {
         const ACCESS_SECRET = process.env.ACCESS_SECRET;
         const REFRESH_SECRET = process.env.REFRESH_SECRET;
         if (!ACCESS_SECRET || !REFRESH_SECRET) {
            return res.status(404).send({
               error: "The access secret or refresh secret is not found",
            });
         }
         const refreshToken = req.cookies["refreshToken"];
         let payload: any;
         jwt.verify(refreshToken, REFRESH_SECRET, (err: any, decoded: any) => {
            if (err) {
               return res.status(401).send({
                  err: err,
                  auth: "The user is not authorized, please sign in",
               });
            }
            payload = decoded;
         });
         console.log("payload", payload);
         if (!payload) {
            return res.status(401).send({
               auth: "The user is not authorized, please sign in",
            });
         }
         const accessToken = jwt.sign(
            {
               id: payload.id,
            },
            ACCESS_SECRET,
            {
               expiresIn: "1h",
            }
         );
         res.status(200).send({ token: accessToken });
      } catch (error) {
         console.log("refresh", error);
         next(error);
      }
   }
   async logout(req: Request, res: Response, next: NextFunction) {
      try {
         res.cookie("refreshToken", "", { maxAge: 0 });
         res.status(200).send({
            success: true,
            message: "User successfully logged out",
         });
      } catch (error) {
         next(error);
      }
   }
   async getAuthorizedUser(req: Request, res: Response, next: NextFunction) {
      try {
         let token;
         let currentUser: any;
         const ACCESS_SECRET = process.env.ACCESS_SECRET;
         if (!ACCESS_SECRET) {
            return res.status(500).json({
               message: "The ACCESS_SECRET is not found",
            });
         }
         if (
            req.headers["authorization"] &&
            req.headers["authorization"].split(" ")[0] === "Bearer"
         ) {
            token = req.headers["authorization"].split(" ")[1];
         } else {
            console.log("token is not found");
         }
         if (!token) {
            return res.status(500).json({
               message: "The token is not found",
            });
         }
         jwt.verify(token, ACCESS_SECRET, function (err, decoded) {
            if (err) {
               console.log("Error jwt users/refresh: ", err);
            }
            currentUser = decoded;
         });
         if (!currentUser) {
            return res.status(401).json({
               message: "The authorized user  was not found",
            });
         }
         const user = await prisma.user.findUnique({
            where: {
               id: currentUser.id,
            },
            include: {
               conversations: {
                  include: {
                     users: true,
                  },
               },
            },
         });

         if (!user) {
            return res.status(500).json({
               message: "The user with givven Id was not found",
            });
         }
         res.status(200).send({
            user: {
               id: user.id,
               username: user.username,
               name: user.name,
               image: user.image,
               phone: user.phone,
               conversations: user.conversations,
            },
         });
      } catch (error) {
         next(error);
      }
   }
}
export default new AuthController();
