import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "./helpers/error-handler";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import messageRouter from "./routes/message.routes";
import conversationRouter from "./routes/conversation.routes";

const app = express();
const server = createServer(app);
const io = new Server(server, {
   cors: {
      origin: "http://localhost:5173",
   },
});
const PORT = process.env.PORT || 3000;
const api = process.env.API_URL;
//middlewares
app.use(express.json());
app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true,
   })
);
app.options("*", cors());
app.use(cookieParser());
app.use(morgan("tiny"));

//routes
app.use(`${api}/users`, userRouter);
app.use(`${api}/auth`, authRouter);
app.use(`${api}/messages`, messageRouter);
app.use(`${api}/conversations`, conversationRouter);

//! Error Handler
app.use(errorHandler);
let onlineUsers: any = [];

//socet.io
const addUser = (user: any) => {
   !onlineUsers.some((u: any) => user.userId === u.userId) &&
      onlineUsers.push(user);
};
const removeUser = (socketId: string) => {
   onlineUsers = onlineUsers.filter((u: any) => u.socketId !== socketId);
};
const findUser = (userId: number) => {
   return onlineUsers.find((user: any) => user.userId === userId);
};

io.on("connection", (socket) => {
   //when connect
   console.log("a user connected");

   //take user and socketId
   socket.on("addUser", (id) => {
      addUser({
         userId: id,
         socketId: socket.id,
      });
      io.emit("getUsers", onlineUsers);
   });

   //send and get message
   socket.on("sendMessage", (data) => {
      data.receivers.forEach((receiverId: number) => {
         const receiver = findUser(receiverId);
         if (receiver) {
            io.to(receiver.socketId).emit("getMessage", {
               senderId: data.senderId,
               text: data.text,
            });
         }
      });
   });

   //when disconnect
   socket.on("disconnect", () => {
      console.log("user disconnected");
      removeUser(socket.id);
      io.emit("getUsers", onlineUsers);
   });
});

server.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});
