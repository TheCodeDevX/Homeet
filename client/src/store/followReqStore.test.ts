import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

  vi.mock("../lib/axios.config", () => {
     return {
         FollowReqApi : {
             post : vi.fn(),
             put : vi.fn(),
             get : vi.fn()
         }
     };
  });

  import "@testing-library/jest-dom/vitest"
import { AxiosError, type AxiosInstance } from "axios";
import { type Mock, type MockedFunctionDeep } from "@vitest/spy";
import { act, renderHook } from "@testing-library/react";
import { FollowReqApi } from "../lib/axios.config";
import { useFollowRequestStore } from "./followReqStore";
import { useNotificationStore } from "./notificationStore";
import * as helpers from "./helpers/errorHelper";
import type { ErrorHandlerParameters } from "../types/types";


 const notificationMock = [{
                    sender : {  firstName : 'Sender1', email : 'sender1@gmail.com',
                         followers : ["follower-1", 'follower-2', 'follower-3'] },
                    recipient : { firstName : 'Recipient1', email : 'recipient1@gmail.com',
                        followers : ["notif-sender1-ID"] // the notification sender's ID
                     },
                    _id : 'notif-1'
                },
                {
                    sender : { firstName : 'Sender2', email : 'sender2@gmail.com' },
                    recipient : { firstName : 'Recipient2', email : 'recipient2@gmail.com',
                     followers : ["notif-sender2-ID"]
                     },
                    _id : 'notif-2'
                },
                {
                    sender : { firstName : 'Sender3', email : 'sender3@gmail.com', 
                         followers : ["follower-1", 'follower-2', 'follower-3']
                     },
                    recipient : { firstName : 'Recipient3', email : 'recipient3@gmail.com',
                         followers : ["notif-sender3-ID"] },
                    _id : 'notif-3'
                }
            ] 

 describe("followReqStore", () => {
  let mockAxios : MockedFunctionDeep<AxiosInstance>;
  let spy :  Mock<({ error, defaultErr }: ErrorHandlerParameters) => string>;
  beforeEach(() => {
    mockAxios = vi.mocked(FollowReqApi, true);
    spy = vi.spyOn(helpers, 'errorHandler').mockImplementation(({error, defaultErr}) => {
        return (error as Error)?.message || defaultErr
    })
    useFollowRequestStore.setState({ 
    isReqLoading : false,
    isLoading:false,
    message: "",
    error: null,
    followReq: null,
    followReqs : [],
    hasPendingFollowReq : true
    });
   })

   afterEach(() => {
    vi.resetAllMocks()
    spy.mockRestore()
})

   it('sends a follow request on success', async() => {  
        const mockFollowReqkData = { existingFollowReq : false, followReq :
             {  sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
             }, message : 'successful-follow-req'}
    
        const mockResponse = {data : mockFollowReqkData}
        mockAxios.post.mockResolvedValueOnce(mockResponse);
        const {result} = renderHook(() => useFollowRequestStore());
        await act(async () => {
        await result.current.sendFollowReq('123')
        });
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isReqLoading).toBe(false);
        expect(result.current.followReq).toEqual(mockResponse.data.followReq);
        expect(result.current.error).toBeNull()
        expect(result.current.message).toBe(mockResponse.data.message)
        expect(mockAxios.post).toHaveBeenCalled()
        expect(mockAxios.post).toHaveBeenCalledTimes(1)
        expect(mockAxios.post).toHaveBeenCalledWith('/follow-request/123')
   })

    it('handles network errors', async () => {
           const error = new Error('Network Error');
   
           mockAxios.post.mockRejectedValueOnce(error);
           
           const {result} = renderHook(() => useFollowRequestStore());
   
           await act(async() => {
            try {
               await result.current.sendFollowReq('123');
            } catch (e) {
               expect(e).toBe(error)
            }
           })
           expect(result.current.isLoading).toBe(false);
           expect(result.current.message).toBe('');
           expect(result.current.error).toBe(error.message)
   
       }),

        
            it('adds follower optimistically when sending follow request', async() => {
                const mockFollowReqkData = { existingFollowReq : false, followReq :
                {
                sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
                }, message : 'successful-follow-req'}

                const {result : notificationResult} = renderHook(() => useNotificationStore())
                act(() => {
                notificationResult.current.setNotifications(notificationMock as any)
                })
                const mockResponse = {data : mockFollowReqkData}
                mockAxios.post.mockResolvedValueOnce(mockResponse);
                const {result} = renderHook(() => useFollowRequestStore());
                await act(async () => {
                await result.current
                .sendFollowReq('authenticated-user-ID', "notif-1", 'new-follower')
              });
              const expectedNotifs = notificationMock.map((n) => n._id === "notif-1"
              ? {...n, sender : {...n.sender, followers : [...n?.sender?.followers ?? [], "new-follower" ] }}
              : n)

              expect(notificationResult.current.notifications).toEqual(expectedNotifs);
            

            }),

              it('removes a follow request when unfollowing',
                 async() => {
                const mockFollowReqkData = { existingFollowReq : false, followReq :
                {
                sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
                }, message : 'successful-follow-req'}

                const {result : notificationResult} = renderHook(() => useNotificationStore())
                act(() => {
                notificationResult.current.setNotifications(notificationMock as any)
                })
                const mockResponse = {data : mockFollowReqkData}
                mockAxios.post.mockResolvedValueOnce(mockResponse);
                const {result} = renderHook(() => useFollowRequestStore());
                await act(async () => {
                await result.current
                .sendFollowReq('authenticated-user-ID', "notif-1", 'follower-1')
              });
              const expectedNotifs = notificationMock.map((n) => n._id === "notif-1"
              ? {...n, sender : {...n.sender, followers : n.sender.followers?.slice(1) }}
              : n)

              expect(notificationResult.current.notifications).toEqual(expectedNotifs);
            })


             it('does not update followers optimistically when notification ID is not found', async() => {
                const mockFollowReqkData = { existingFollowReq : false, followReq :
                {
                sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
                }, message : 'successful-follow-req'}

                const {result : notificationResult} = renderHook(() => useNotificationStore())
                act(() => {
                    notificationResult.current.setNotifications(notificationMock as any)
                })
                const mockResponse = {data : mockFollowReqkData}
                mockAxios.post.mockResolvedValueOnce(mockResponse);
                const {result} = renderHook(() => useFollowRequestStore());
                await act(async () => {
                await result.current
                .sendFollowReq('authenticated-user-ID', undefined, 'follower-1')
              });

              expect(notificationResult.current.notifications[0].sender.followers).toEqual(["follower-1", "follower-2", "follower-3"]);
            })

             it('handles undefined followers array gracefully', async() => {
                const mockFollowReqkData = { existingFollowReq : false, followReq :
                {
                sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
                }, message : 'successful-follow-req'}

                const {result : notificationResult} = renderHook(() => useNotificationStore())
                const notifsWithoutFollowers =  notificationMock.map((n) => 
                    ({...n, sender : {...n.sender, followers : undefined} }) )
                act(() => notificationResult.current.setNotifications(notifsWithoutFollowers as any))
                
                const mockResponse = {data : mockFollowReqkData}
                mockAxios.post.mockResolvedValueOnce(mockResponse);
                const {result} = renderHook(() => useFollowRequestStore());
                await act(async () => {
                await result.current
                .sendFollowReq('authenticated-user-ID', "notif-1", 'new-follower')
              });

              expect(notificationResult.current.notifications[0].sender.followers).toEqual(["new-follower"]);
            })

             it('only updates the specific notification', async() => {
                const mockFollowReqkData = { existingFollowReq : false, followReq :
                {
                sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
                }, message : 'successful-follow-req'}

                const {result : notificationResult} = renderHook(() => useNotificationStore())
                act(() => notificationResult.current.setNotifications(notificationMock as any))
                const mockResponse = {data : mockFollowReqkData}
                mockAxios.post.mockResolvedValueOnce(mockResponse);
                const {result} = renderHook(() => useFollowRequestStore());
                await act(async () => {
                await result.current
                .sendFollowReq('notif-sender-ID', "notif-2", 'new-follower')
                //              the notif sender              the user who received the notif
              });

              expect(notificationResult.current.notifications[1].sender.followers).toEqual(["new-follower"]);
              // when you follow again in the notif page, the notif recipient's ID must exists in the
              // sender followers, which means the sender already follows the recipient 
              expect(notificationResult.current.notifications[1].recipient.followers).toEqual(["notif-sender2-ID"]);
              expect(notificationResult.current.notifications[0].sender.followers).toEqual(notificationMock[0].sender.followers);
              expect(notificationResult.current.notifications[2].sender.followers).toEqual(notificationMock[2].sender.followers);
            })



            it("gets incoming follow requests successfully", async() => {
                const {result} = renderHook(() => useFollowRequestStore());
                mockAxios.get.mockResolvedValueOnce({data : [{
                sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
                }]})
                await act(async() => {
                    await result.current.getIncomingRequests()
                })

                expect(mockAxios.get).toHaveBeenCalled()
                expect(mockAxios.get).toHaveBeenCalledWith('/follow-request')
                expect(result.current.followReqs).toEqual([{
                sender : { _id : 'sender-id', email : 'sender@gmail.com', firstName : 'sender'}, 
                recipient : { _id : 'recipient-id', email : 'recipient@gmail.com', firstName : 'sender' }
                }])
            })

            it("sets an error message returned by errHandler", async () => {
             const Err = new Error("something went wrong")
             mockAxios.get.mockRejectedValueOnce(Err)
             const {result} = renderHook(() => useFollowRequestStore())
             await act(async() => {
                try {
                await result.current.getIncomingRequests()
                } catch (error) {
                expect(error).toBe(Err)
                }
             });

             expect(spy).toHaveBeenCalled()
             expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'FOLLOW_REQ_RECEIVING_FAILED'})
             expect(result.current.error).toBe("something went wrong")
            })

            it("sets an error message returned by errHandler", async () => {
             const Err = new Error(undefined)
             mockAxios.get.mockRejectedValueOnce(Err)
             const {result} = renderHook(() => useFollowRequestStore())
             await act(async() => {
                try {
                await result.current.getIncomingRequests()
                } catch (error) {
                expect(error).toBe(Err)
                }
             });

             expect(spy).toHaveBeenCalled()
             expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'FOLLOW_REQ_RECEIVING_FAILED'})
             expect(result.current.error).toBe("FOLLOW_REQ_RECEIVING_FAILED")
            })

          
 })

 