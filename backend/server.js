import express, { json, urlencoded } from 'express';
import authRoutes from './routes/auth.routes.js' 
import subRoutes from './routes/subscription.routes.js'
import listingRoutes from './routes/listings.routes.js'
import ratingRoutes from "./routes/rating.routes.js"
import messageRoutes from "./routes/messages.routes.js"
import audioRoutes from "./routes/audio.route.js"
import followReqRoutes from "./routes/followReq.routes.js"
import userRoutes from "./routes/user.routes.js"
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.middlewares.js';
import { notFound } from './middlewares/notFound.middlewares.js';
import cookieParser from 'cookie-parser';
import './lib/passportSetup.js'
import cors from 'cors'
import passport from "passport";
import { app, server } from './socket.js';

const port = process.env.PORT || 5000;
app.use(cors({
    origin : "http://localhost:3000",
    credentials:true
}))

app.use(json({limit:"10mb"}));
app.use(urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize())
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subRoutes)
app.use("/api", listingRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/message", messageRoutes )
app.use("/api/uploading", audioRoutes )
app.use("/api/requests", followReqRoutes )
app.use("/api/users", userRoutes )

app.use(notFound)
app.use(errorHandler)

server.listen(port, async() => { 
 try {
await connectDB();
console.log(`server running on ${port}`)
 } catch (error) {
    console.log("failed to connect to db")
 }
});