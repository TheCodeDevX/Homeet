import express, { json, urlencoded } from 'express';
import authRoutes from './routes/auth.routes' 
import subRoutes from './routes/subscription.routes'
import listingRoutes from './routes/listings.routes'
import ratingRoutes from "./routes/rating.routes"
import messageRoutes from "./routes/messages.routes"
import audioRoutes from "./routes/audio.routes"
import followReqRoutes from "./routes/followReq.routes"
import userRoutes from "./routes/user.routes"
import notifRoutes from "./routes/notifs.routes"
import bookingRoutes from "./routes/booking.routes"
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler.middlewares';
import { notFound } from './middlewares/notFound.middlewares';
import cookieParser from 'cookie-parser';
import './lib/passportSetup'
import cors from 'cors'
import passport from "passport";
import { app, server } from "./socket";
import { deleteArchivedNotifications } from './controllers/notfication.controller';
import { warmUp } from './controllers/auth.controller';

const port = process.env.PORT || 5000;
app.use(cors({
    origin : `${process.env.CLIENT_URL}`,
    credentials:true
}))



app.use(json({limit:"10mb"}));
app.use(urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize())
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subRoutes)
app.use("/api", listingRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/message", messageRoutes )
app.use("/api/uploading", audioRoutes )
app.use("/api/requests", followReqRoutes )
app.use("/api/users", userRoutes )
app.use("/api/notifications", notifRoutes )
app.use("/api/bookings", bookingRoutes )
app.get("/api/warm-up", warmUp)
app.use(notFound)
app.use(errorHandler)

server.listen(port, async() => { 
 try {
await connectDB();

await deleteArchivedNotifications();
console.log(`server running on ${port}`)
 } catch (error) {
    console.log("failed to connect to db")
 }
});