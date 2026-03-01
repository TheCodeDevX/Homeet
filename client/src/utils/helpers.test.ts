import {describe, it, expect, vi, afterEach} from "vitest"
import "@testing-library/jest-dom/vitest"
import { handleFollowReq, handleNavigation } from "./helpers";
import type { UserData } from "../types/types";

 describe("handleNavigation", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  

  it("navigates user to the chat page when user exists", () => {
    const mockUser : UserData = {firstName : 'Omar', lastName : 'Ri',
        email : 'omar@gmail.com', password : 'xwz', 
        gender: "male", phoneNumber:"555-5555", role : "tenant"
    };
    const setSelectedUser = vi.fn();
    const navigate = vi.fn();
    handleNavigation({listingUser:mockUser, navigate, setSelectedUser})

    const values = [{ arg : '/chat', fn : navigate}, {arg : mockUser, fn : setSelectedUser}]

    values.forEach(({arg, fn}) => {
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(arg)
    expect(fn).toHaveBeenCalledTimes(1)
    })
   

  })


  it("does nothing when listingUser is undefined", () => {
    const setSelectedUser = vi.fn();
    const navigate = vi.fn();
    handleNavigation({listingUser:undefined, navigate, setSelectedUser})
    
    
    const values = [{ arg : '/chat', fn : navigate}, {arg : undefined, fn : setSelectedUser}]

    values.forEach(({arg, fn}) => {
    expect(fn).not.toHaveBeenCalled();
    expect(fn).not.toHaveBeenCalledWith(arg)
    expect(fn).not.toHaveBeenCalledTimes(1)
    })
  })


 })

 

 
 describe("handleFollowRequest", () => {
  afterEach(() => {
    vi.resetAllMocks() 
  })

  const mockSender : UserData = {
    firstName : '@', lastName : 'Sender',
    email : 'sender@gmail.com', password : 'xwz', 
    gender: "male", phoneNumber:"555-5555", role : "tenant",
    _id : '123'
  };

    const mockRecipient : UserData = {
    firstName : '@', lastName : 'Recipient',
    email : 'recipient@gmail.com', password : 'xwz', 
    gender: "male", phoneNumber:"555-5555", role : "seller", _id : 'xwz'
  };
  

  it("sends follow request", async () => {

    const senderId = mockSender._id?.toString()
    const recipientId =  mockRecipient._id?.toString()

    const sendFollowReq = vi.fn();
    const setIsFollowing = vi.fn();

    await handleFollowReq({
    userId:senderId,
    recipientId,
    notifId: 'xwz123',
    sendFollowReq,
    setIsFollowing,
  })

  expect(sendFollowReq).toHaveBeenCalled();
  expect(sendFollowReq).toHaveBeenCalledTimes(1);
  expect(sendFollowReq).toHaveBeenCalledWith('xwz', 'xwz123', '123')

  expect(setIsFollowing).toHaveBeenCalled();
  expect(setIsFollowing).toHaveBeenCalledTimes(1);


  })

  it("does nothing when the recipient ID or sender ID is undefined", async () => {

    const senderId = mockSender._id?.toString();
    const recipientId = mockRecipient._id?.toString();

    const sendFollowReq = vi.fn();
    const setIsFollowing = vi.fn();

   const ids = [
    {senderId, recipientId:undefined},
    {senderId:undefined, recipientId},
    {senderId:undefined, recipientId:undefined}
    ]; 

  for( const {senderId, recipientId} of ids)  
  await handleFollowReq({
    userId:senderId,
    recipientId,
    notifId: 'xwz123',
    sendFollowReq,
    setIsFollowing,
  })
  expect(sendFollowReq).not.toHaveBeenCalled();
  expect(setIsFollowing).not.toHaveBeenCalled();
  })

  it("doesn't invoke setIsFollowing when it is undefined", async () => {

  const senderId = mockSender._id?.toString();
  const recipientId = mockRecipient._id?.toString();

  const sendFollowReq = vi.fn();
  const setIsFollowing = vi.fn();
     
  await handleFollowReq({
  userId:senderId,
  recipientId,
  notifId: 'xwz123',
  sendFollowReq,
  setIsFollowing : undefined,
  })
  
  expect(sendFollowReq).toHaveBeenCalled();
  expect(setIsFollowing).not.toHaveBeenCalled();

  })


  it("calls sendFollowReq with undefined as the second argument when notifId is undefined", async () => {

  const senderId = mockSender._id?.toString();
  const recipientId = mockRecipient._id?.toString();

  const sendFollowReq = vi.fn();
  const setIsFollowing = vi.fn();

  await handleFollowReq({
  userId:senderId,
  recipientId,
  notifId: undefined,
  sendFollowReq,
  setIsFollowing : setIsFollowing,
  })

  expect(sendFollowReq).toHaveBeenCalled();
  expect(sendFollowReq).toHaveBeenCalledTimes(1);
  expect(sendFollowReq).toHaveBeenCalledWith('xwz', undefined, '123') // in followReqStore we use notifId only for
  // the notification page to update the states in the client optimistically, so it has nothing to do with it 
  // in the backend

  expect(setIsFollowing).toHaveBeenCalled();
  expect(setIsFollowing).toHaveBeenCalledTimes(1);

  })




 })


