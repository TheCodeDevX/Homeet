 import {createServer} from "http"
 import express from 'express';
import { Server } from "socket.io";
import { ID } from "./shared/types/types";

// TODO: ENSURE THAT EVERYTHING YOU'VE CODED WAS CORRECT

   const app = express();
   const server = createServer(app);
   const io = new Server(server, {
    cors : {
        origin : "http://localhost:3000",
        credentials : true
    }
  })

   let userSocketMap : Record<string, string> = {}; // {userId : socket.id (auto-generated id after each conn)}
    function getReceiverSocketId (userId: string) {
     if(!userId) return;
     return userSocketMap[userId] 
    }

  io.on("connection", (socket) => {
    const userId = socket.handshake?.query.userId as string; // the auth user id
    console.log("userId via socket.handshake.query", userId)

    if(userId){
    userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }

    socket.on("disconnect", () => {
      if(userId){
        delete userSocketMap[userId]
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

  })

  export {app, server, io, getReceiverSocketId}

  
  

