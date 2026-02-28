import type { FollowReqProps, NavigationProps } from "../types/types";

export const handleNavigation = ({listingUser, setSelectedUser, navigate} : NavigationProps) => {
  if(!listingUser) return;
  setSelectedUser(listingUser);
  navigate("/chat");
}
/**
 * Sends a follow request for the notification page
 * @param userId - The authenticated user's ID
 * @param recipientId - The senderID of the notification page 
*/

export const handleFollowReq = async({userId, recipientId, notifId,
  sendFollowReq, setIsFollowing} : FollowReqProps) => {
  if(!recipientId || !userId) return;
  // recipientId in notificationPage is the sender ID.
  // userId in notificationPage is the recipient ID
  try {
  await sendFollowReq(recipientId.toString(), notifId, userId?.toString());
  setIsFollowing && setIsFollowing(prev => !prev)
  } catch (error) {
  console.log(error)
  }
}