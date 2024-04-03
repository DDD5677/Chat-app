import { NextFunction, Request, Response } from "express";
import prisma from "../db/db.server";

class ConversationController {
   async getConversation(req: Request, res: Response, next: NextFunction) {
      try {
         const conversation = await prisma.conversation.findMany({
            include: {
               users: true,
               messages: {
                  include: {
                     sender: true,
                  },
               },
            },
         });
         if (!conversation) {
            return res.status(400).send({
               success: false,
               message: "Conversations are not found",
            });
         }
         res.status(200).send(conversation);
      } catch (error) {
         console.log("getConversations");
         next(error);
      }
   }
   async getOneConversation(req: Request, res: Response, next: NextFunction) {
      try {
         const conversation = await prisma.conversation.findUnique({
            where: {
               id: +req.params.id,
            },
            include: {
               users: true,
               messages: {
                  include: {
                     sender: true,
                  },
               },
            },
         });
         if (!conversation) {
            return res.status(400).send({
               success: false,
               message: "Conversation is not found",
            });
         }
         res.status(200).send(conversation);
      } catch (error) {
         console.log("getOneConversations");
         next(error);
      }
   }
   async createConversation(req: Request, res: Response, next: NextFunction) {
      try {
         const conversation = await prisma.conversation.create({
            data: {
               users: {
                  connect: [
                     {
                        id: req.body.senderId,
                     },
                     {
                        id: req.body.resieverId,
                     },
                  ],
               },
            },
         });
         if (!conversation) {
            return res.status(400).send({
               success: false,
               message: "Conversation is not created",
            });
         }
         res.status(200).send(conversation);
      } catch (error) {
         console.log("createConversation");
         next(error);
      }
   }
}

export default new ConversationController();
