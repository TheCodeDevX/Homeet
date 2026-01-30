import { Router } from "express";
import { getIncomingNotifications, markNotifsAsRead, archiveNotifs, deleteArchivedNotifications } from "../controllers/notfication.controller";
import { protect } from "../middlewares/auth.middlewares";

const router = Router();
router.get("/", protect, getIncomingNotifications);
router.put("/read-notifs", protect, markNotifsAsRead);
router.post("/archive-notifs", protect, archiveNotifs);

export default router;