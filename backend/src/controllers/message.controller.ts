import { NextFunction, Request, Response } from "express";
import prisma from "../db/db.server";

class MessageController {
   async createMessage(req: Request, res: Response, next: NextFunction) {
      try {
         await req.body.receivers.forEach(async (receiverId: number) => {
            let messageBody: any = {
               text: req.body.text,
               senderId: req.body.senderId,
            };
            const conversation = await prisma.conversation.findFirst({
               where: {
                  AND: [
                     {
                        users: {
                           some: {
                              id: req.body.senderId,
                           },
                        },
                     },
                     {
                        users: {
                           some: {
                              id: +receiverId,
                           },
                        },
                     },
                  ],
               },
            });
            if (!conversation) {
               const newConversation = await prisma.conversation.create({
                  data: {
                     users: {
                        connect: [
                           {
                              id: req.body.senderId,
                           },
                           {
                              id: +receiverId,
                           },
                        ],
                     },
                  },
               });
               messageBody.conversationId = newConversation.id;
            } else {
               messageBody.conversationId = conversation.id;
            }
            const message = await prisma.message.create({
               data: messageBody,
            });
            if (!message) {
               return res.status(400).send({
                  success: false,
                  message: "Message is not created",
               });
            }
         });
         res.status(200).send({
            success: true,
            message: "Message is created successfully",
         });
      } catch (error) {
         console.log("create message", error);
         next(error);
      }
   }
}

export default new MessageController();
