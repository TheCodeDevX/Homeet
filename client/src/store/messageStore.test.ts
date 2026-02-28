import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

  vi.mock("../lib/axios.config", () => {
     return {
         MessageApi : {
             post : vi.fn(),
             put : vi.fn(),
             get : vi.fn()
         },
         AudioApi : {
             post : vi.fn(),
             put : vi.fn(),
             get : vi.fn()
         },
          authApi : {
             post : vi.fn(),
             put : vi.fn(),
             get : vi.fn()
         }
     };
  });

  const mockSocket = {
      on : vi.fn(),
      off : vi.fn(),
      connect : vi.fn(),
      connected : false,
      disconnect : vi.fn(),
      emit : vi.fn(),
      id: 'mock-socket-id',
   }


    vi.mock("socket.io-client", () => ({
      io : vi.fn(() => mockSocket)
   }));

import "@testing-library/jest-dom/vitest"
import { AxiosError, isAxiosError, type AxiosInstance } from "axios";
import type { Mock, MockedFunctionDeep } from "@vitest/spy";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AudioApi, authApi, MessageApi } from "../lib/axios.config";
import * as helpers from "./helpers/errorHelper";
import type { ErrorHandlerParameters } from "../types/types";
import { useMessageStore } from "./messageStore";
import { useAuthStore } from "./authStore";


describe("messageStore", () => {
    let mockAxios : MockedFunctionDeep<AxiosInstance>
    let spy :Mock<({ error, defaultErr }: ErrorHandlerParameters) => string>

    beforeEach(() => {
        useMessageStore.setState({
        users : [],
        selectedUser: null,
        messages : [],
        error:null,
        isUsersLoading:false,
        isMessagesLoading:false,
        isMessagesSending : false,
        });
        spy = vi.spyOn(helpers, 'errorHandler').mockImplementation(({error, defaultErr}) => {
            if(isAxiosError(error)) return error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || defaultErr;
            if(error instanceof Error ) return (error as Error)?.message || defaultErr
    });
    })

    afterEach(() => {
        spy.mockRestore();
        vi.resetAllMocks()
    });
    describe("Text & Image messages", () => {
    beforeEach(() => mockAxios = vi.mocked(MessageApi, true))
    afterEach(() => vi.resetAllMocks())
    describe("getUsers", () => {
    it("retrieves users displayed in the sidebar successfully", async () => {
     mockAxios.get.mockResolvedValueOnce({data : [ {_id : '123', email : 'user@gmail.com'} ]});
     const {result} = renderHook(() => useMessageStore());
     await act(async () => {
        await result.current.getUsers({shouldLoad: true});
     })

     expect(mockAxios.get).toHaveBeenCalled()
     expect(mockAxios.get).toHaveBeenCalledWith('/users')
     expect(mockAxios.get).toHaveBeenCalledTimes(1)
     expect(result.current.isUsersLoading).toBe(false)
     expect(result.current.users).toEqual([ {_id : '123', email : 'user@gmail.com'} ])
     expect(result.current.error).toBeNull()
    })

    it("sets an error message returned by errHandler", async () => {

        const Err = new Error("something went wrong")
        mockAxios.get.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act(async() => {
        try {
        await result.current.getUsers({shouldLoad: true})
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'USERS_FETCHING_FAILED'})
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.users).toEqual([])

    })


     it("sets a default error message when the original error message is not found", async () => {
        
        const Err = new Error(undefined)
        mockAxios.get.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act( async() => {
        try {
        await result.current.getUsers({shouldLoad: true})
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'USERS_FETCHING_FAILED'})
        expect(result.current.error).toBe("USERS_FETCHING_FAILED")
        expect(result.current.users).toEqual([])

    })
    })

    describe("getMessages", () => {
    it("retrieves messages for involved users", async () => {
     mockAxios.get.mockResolvedValueOnce({data : { messages : [ 
     {senderId : 'sender-id', receiverId : 'receiver-id', text : 'hello' }
     ]} });
     
     const {result} = renderHook(() => useMessageStore());
     await act(async () => {
        await result.current.getMessages("123")
     })

     expect(mockAxios.get).toHaveBeenCalled()
     expect(mockAxios.get).toHaveBeenCalledWith(`/messages/123`)
     expect(mockAxios.get).toHaveBeenCalledTimes(1)
     expect(result.current.isMessagesLoading).toBe(false)
     expect(result.current.messages).toEqual([ 
     {senderId : 'sender-id', receiverId : 'receiver-id', text : 'hello' }
     ])
     expect(result.current.error).toBeNull()
    })

     it("returns empty array when no array messages exist", async () => {
     mockAxios.get.mockResolvedValueOnce({data : { messages : []} });
     
     const {result} = renderHook(() => useMessageStore());
     await act(async () => {
        await result.current.getMessages("123")
     })

     expect(mockAxios.get).toHaveBeenCalled()
     expect(mockAxios.get).toHaveBeenCalledWith(`/messages/123`)
     expect(mockAxios.get).toHaveBeenCalledTimes(1)
     expect(result.current.isMessagesLoading).toBe(false)
     expect(result.current.messages).toEqual([])
     expect(result.current.error).toBeNull()
    })

    it("retrieves multiple messages in order", async () => {
    const mockMessages = [
    { senderId: 'user1', receiverId: 'user2', text: 'Hello', createdAt: '2024-01-01' },
    { senderId: 'user2', receiverId: 'user1', text: 'Hi!', createdAt: '2024-01-02' },
    { senderId: 'user1', receiverId: 'user2', text: 'How are you?', createdAt: '2024-01-03' }
    ];

    mockAxios.get.mockResolvedValueOnce({
    data: { messages: mockMessages }
    });

    const {result} = renderHook(() => useMessageStore());

    await act(async () => {
    await result.current.getMessages("123");
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages).toEqual(mockMessages);
    });

     it("sets an error message returned by errHandler", async () => {

        const Err = new Error("something went wrong")
        mockAxios.get.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act(async() => {
        try {
        await result.current.getMessages('123')
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : "MESSAGES_FETCHING_FAILED"})
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.messages).toEqual([])

    })


     it("sets a default error message when the original error message is not found", async () => {
        
        const Err = new Error(undefined)
        mockAxios.get.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act( async() => {
        try {
        await result.current.getMessages('123')
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : "MESSAGES_FETCHING_FAILED"})
        expect(result.current.error).toBe("MESSAGES_FETCHING_FAILED")
        expect(result.current.messages).toEqual([])

    })

    it("handles Axios error with response data", async () => {
    const axiosError = new AxiosError(
    'Request failed with status code 404',
    'ERR_BAD_REQUEST',
    { headers: {} } as any,
    {},
    {
    status: 404,
    statusText: 'Not Found',
    data: { message: 'Conversation not found' },
    headers: {},
    config: { headers: {} } as any
    }
    );

    mockAxios.get.mockRejectedValueOnce(axiosError);

    const {result} = renderHook(() => useMessageStore());

    await act(async () => {
    try {
    await result.current.getMessages('999');
    } catch (error) {
    expect(error).toBe(axiosError);
    }
    });

    expect(spy).toHaveBeenCalledWith({
    error: axiosError,
    defaultErr: "MESSAGES_FETCHING_FAILED"
    });
    expect(result.current.error).toBe('Conversation not found');
    expect(result.current.messages).toEqual([]);
    });

    it("handles invalid user ID gracefully", async () => {
    const axiosError = new AxiosError(
    'Request failed with status code 404',
    'ERR_BAD_REQUEST',
    { headers: {} } as any,
    {},
    {
    status: 404,
    statusText: 'Not Found',
    data: { message: 'Invalid receiverId' },
    headers: {},
    config: { headers: {} } as any
    }
    );

    mockAxios.get.mockRejectedValueOnce(axiosError);

    const {result} = renderHook(() => useMessageStore());

    await act(async () => {
    try {
    await result.current.getMessages('invalid-ID');
    } catch (error) {
    expect(error).toBe(axiosError);
    }
    });

    expect(spy).toHaveBeenCalledWith({
    error: axiosError,
    defaultErr: "MESSAGES_FETCHING_FAILED"
    });
    expect(result.current.error).toBe('Invalid receiverId');
    expect(result.current.messages).toEqual([]);
    });
 
    it("sets loading state during fetch", async() => {
     mockAxios.post.mockImplementationOnce(() => 
        new Promise((resolve) => {
            setTimeout(() => resolve({data : []}), 100)
        })
     );
     const {result} = renderHook(() => useMessageStore())
     const fetchPromise = await act(async() => {
        return result.current.getMessages('999')
     })

     waitFor(() => expect(result.current.isMessagesSending).toBe(true) );
     await fetchPromise;
     expect(result.current.isMessagesLoading).toBe(false)
    })

   

    })
    
   describe("sendMessages", () => {
    it("sends a message successfully", async () => {
     mockAxios.post.mockResolvedValueOnce({data : { message : 
     {senderId : 'sender-id', receiverId : 'receiver-id', text : 'hello' }
     } });
     
     const {result} = renderHook(() => useMessageStore());
     await act(async () => {
        await result.current.sendMessages('111', {text : "hello"} as any)
     })

     expect(mockAxios.post).toHaveBeenCalled()
     expect(mockAxios.post).toHaveBeenCalledWith(`/send-messages/111`, {text : "hello"})
     expect(mockAxios.post).toHaveBeenCalledTimes(1)
     expect(result.current.isMessagesLoading).toBe(false)
     expect(result.current.messages).toEqual([ 
     {senderId : 'sender-id', receiverId : 'receiver-id', text : 'hello' }
     ])
     expect(result.current.error).toBeNull()
    })

     it("returns empty array when no array messages exist", async () => {
     mockAxios.post.mockResolvedValueOnce({data : { message : { text : 'msg' } } });
     
     const {result} = renderHook(() => useMessageStore());
     await act(async () => {
        await result.current.sendMessages('111', {text : "hello"} as any)
     })

     expect(mockAxios.post).toHaveBeenCalled()
     expect(mockAxios.post).toHaveBeenCalledWith(`/send-messages/111`, {text : "hello"})
     expect(mockAxios.post).toHaveBeenCalledTimes(1)
     expect(result.current.isMessagesLoading).toBe(false)
     expect(result.current.messages).toContainEqual({text : 'msg'})
     expect(result.current.error).toBeNull()

     
    })


     it("sets an error message returned by errHandler", async () => {

        const Err = new Error("something went wrong")
        mockAxios.post.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act(async() => {
        try {
        await result.current.sendMessages('999', {text : 'hi'} as any)
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : "MESSAGES_SENDING_FAILED"})
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.messages).toEqual([])

    })


     it("sets a default error message when the original error message is not found", async () => {
        
        const Err = new Error(undefined)
        mockAxios.post.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act( async() => {
        try {
        await result.current.sendMessages('999', {text : 'hi'} as any)
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : "MESSAGES_SENDING_FAILED"})
        expect(result.current.error).toBe("MESSAGES_SENDING_FAILED")
        expect(result.current.messages).toEqual([])

    })

    it("handles Axios error with response data", async () => {
    const axiosError = new AxiosError(
    'Request failed with status code 404',
    'ERR_BAD_REQUEST',
    { headers: {} } as any,
    {},
    {
    status: 404,
    statusText: 'Not Found',
    data: { message: 'Conversation not found' },
    headers: {},
    config: { headers: {} } as any
    }
    );

    mockAxios.post.mockRejectedValueOnce(axiosError);

    const {result} = renderHook(() => useMessageStore());

    await act(async () => {
    try {
    await result.current.sendMessages('999', {text : 'hi'} as any)
    } catch (error) {
    expect(error).toBe(axiosError);
    }
    });

    expect(spy).toHaveBeenCalledWith({
    error: axiosError,
    defaultErr: "MESSAGES_SENDING_FAILED"
    });
    expect(result.current.error).toBe('Conversation not found');
    expect(result.current.messages).toEqual([]);
    });

    it("handles invalid user ID gracefully", async () => {
    const axiosError = new AxiosError(
    'Request failed with status code 404',
    'ERR_BAD_REQUEST',
    { headers: {} } as any,
    {},
    {
    status: 404,
    statusText: 'Not Found',
    data: { message: 'Invalid receiverId' },
    headers: {},
    config: { headers: {} } as any
    }
    );

    mockAxios.post.mockRejectedValueOnce(axiosError);

    const {result} = renderHook(() => useMessageStore());

    await act(async () => {
    try {
    await result.current.sendMessages('999', {text : "hi"} as any)
    } catch (error) {
    expect(error).toBe(axiosError);
    }
    });

    expect(spy).toHaveBeenCalledWith({
    error: axiosError,
    defaultErr: "MESSAGES_SENDING_FAILED"
    });
    expect(result.current.error).toBe('Invalid receiverId');
    expect(result.current.messages).toEqual([]);
    });
 
    it("sets loading state during fetch", async() => {
     mockAxios.post.mockImplementationOnce(() => 
        new Promise((resolve) => {
            setTimeout(() => resolve({data : []}), 100)
        })
     );
     const {result} = renderHook(() => useMessageStore())
     const fetchPromise = await act(async() => {
        return result.current.sendMessages('999', {text : 'hi'} as any)
     })

     waitFor(() => expect(result.current.isMessagesSending).toBe(true) );
     await fetchPromise;
     expect(result.current.isMessagesSending).toBe(false)
    })

    })

   describe("registerMessages", () => {
      afterEach(() => {
         vi.resetAllMocks();
      })
      it('registers a new message successfully', async() => {
        vi.mocked(authApi, true).post.mockResolvedValueOnce({data : {success : true, user : {_id : '123'}}})
        const {result : authResult} = renderHook(() => useAuthStore());
        await act(async () => {
         await authResult.current.signup({email : 'user@gmail.com'} as any) // authenticate a user first

        })
        const messageMock = { senderId : '123', receiverId : 'xyz', text : 'hello' }
        const {result} = renderHook(() => useMessageStore())
        act(() => {
          result.current.setSelectedUser({_id : 'xyz'} as any)
        })

        console.log(result.current.selectedUser, authResult.current.user)

        act(() => result.current.registerMessage(messageMock))
        expect(result.current.messages).toContainEqual(messageMock)
      })

      it('rejects users who are not found', async() => {
        vi.mocked(authApi, true).post.mockResolvedValueOnce({data : {success : false, user : null}})
        const {result : authResult} = renderHook(() => useAuthStore());
        await act(async () => {
         try {
             await authResult.current.signup(null as any)
         } catch (error) {
            expect(error).toBeDefined()
         }

        })
        const messageMock = { senderId : '123', receiverId : 'xwz', text : 'hello' }
        const {result} = renderHook(() => useMessageStore())
        act(() => {
          try {
            result.current.setSelectedUser(null)
          } catch (error) {
            expect(error).toBeDefined()
          }
        })

        console.log(result.current.selectedUser, authResult.current.user)

        act(() => 
      {
         try {
            result.current.registerMessage(messageMock)
         } catch (error) {
            expect(error).toEqual(new Error("INVOLVED_USERS_NOT_FOUND"))
         }
      })
        expect(result.current.messages).toEqual([])
      })

      it('rejects users who are not relevant to the sent message', async() => {
        vi.mocked(authApi, true).post.mockResolvedValueOnce({data : {success : false, user : {_id : '123'}}})
        const {result : authResult} = renderHook(() => useAuthStore());
        await act(async () => {
         try {
             await authResult.current.signup({email : '...'} as any)
         } catch (error) {
            expect(error).toBeDefined()
         }

        })
        const messageMock = { senderId : 'abc', receiverId : 'xwz', text : 'hello' }
        const {result} = renderHook(() => useMessageStore())
        act(() => {
          try {
            result.current.setSelectedUser({_id : 'xwz' } as any)
          } catch (error) {
            expect(error).toBeDefined()
          }
        })

        console.log(result.current.selectedUser, authResult.current.user)

        act(() => 
      {
         try {
            result.current.registerMessage(messageMock)
         } catch (error) {
            expect(error).toEqual(new Error("IRRELEVANT_USERS"))
         }
      })
        expect(result.current.messages).toEqual([])
      })

       it("sets an error message returned by errorHandler", async () => {
            vi.mocked(authApi, true).post.mockResolvedValueOnce({data : {success : true, user : {_id : '123'}}})
        const {result : authResult} = renderHook(() => useAuthStore());
        await act(async () => {
         await authResult.current.signup({email : 'user@gmail.com'} as any) // authenticate a user first

        })
        const messageMock = { senderId : '123', receiverId : 'xz', text : 'hello' }
        const {result} = renderHook(() => useMessageStore())
        act(() => {
          result.current.setSelectedUser({_id : 'xyz'} as any)
        })

        act(() => {
         try {
            result.current.registerMessage(messageMock)
         } catch (error) {
            expect((error as Error).message).toBe("IRRELEVANT_USERS")
         }
        })
        expect(result.current.messages).toEqual([]);
        expect(result.current.error).toBe("IRRELEVANT_USERS")
          
        })


      

   }) 

   describe("handles socket messages", () => {
    beforeEach(() => {
           useAuthStore.setState({socket : null, onlineUsers : []})
           mockSocket.connected = false
           vi.resetAllMocks();
       })
   afterEach(() => vi.resetAllMocks())

   it("subscribes to messages", async () => {
       vi.mocked(authApi, true).post.mockResolvedValueOnce({
        data :
         {
            user : {firstName : 'omar', email : 'omar@gmail.com', _id : '123'},
            success : true
         }
    });

    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
         await result.current.login({firstName : "omar", email : 'omar@gmail.com'} as any)
    })
    

    act(() => {
        result.current.connectSocket();
    })

    expect(result.current.socket).toEqual(mockSocket)

    const {result : msgResult} = renderHook(() => useMessageStore())

    act(() => {
     msgResult.current.setSelectedUser({_id : 'xyz'} as any)
      msgResult.current.subToMessages()
    })

        expect(mockSocket.on).toHaveBeenCalled()
       expect(mockSocket.on).toHaveBeenCalledWith("newMessage", expect.any(Function))

       const newMsg = {senderId : '123', receiverId : 'xyz'};
           const newMsgCallback = mockSocket.on.mock.calls.find((call) => call[0] === "newMessage")?.[1]; 
           // this returned the callback function as the second argument the event callback fn accepts.
           act(() => {
               newMsgCallback(newMsg)
           }) 
           expect(msgResult.current.messages).toContainEqual(newMsg)

   })

  
   it("unsubscribes from messages", async () => {
      const listenerSpy = vi.spyOn(useMessageStore.getState(), "registerMessage")
       vi.mocked(authApi, true).post.mockResolvedValueOnce({
        data :
         {
            user : {firstName : 'omar', email : 'omar@gmail.com', _id : '123'},
            success : true
         }
    });

    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
         await result.current.login({firstName : "omar", email : 'omar@gmail.com'} as any)
    })
    

    act(() => {
        result.current.connectSocket();
    })

    expect(result.current.socket).toEqual(mockSocket)

    const {result : msgResult} = renderHook(() => useMessageStore())

    act(() => {
     msgResult.current.setSelectedUser({_id : 'xyz'} as any)
      msgResult.current.unsubFromMessages()
    })

       expect(mockSocket.off).toHaveBeenCalled()
       expect(mockSocket.off).toHaveBeenCalledWith("newMessage", expect.any(Function))

       const newMsg = {senderId : '123', receiverId : 'xyz'};
           const newMsgCallback = mockSocket.off.mock.calls.find((call) => call[0] === "newMessage")?.[1]; 
           // this returned the callback function as the second argument the event callback fn accepts.
           act(() => {
               newMsgCallback(newMsg)
           }) 
         expect(mockSocket.off).toHaveBeenCalledWith('newMessage', listenerSpy)

   })

   })
    })

   describe("Audio messages", () => {
    beforeEach(() => {
      mockAxios = vi.mocked(AudioApi, true);
    })


    describe("uploadAudioFiles", () => {
      it("uploads an audio file successfully", async () => {
         const messageData = {data : { message :  { audio : '123', audioDuration : 2 }, success : true }}
         mockAxios.post.mockResolvedValueOnce(messageData);
         const {result} = renderHook(() => useMessageStore());
         const blob = new Blob(["audio-file"], {type : "audio/"})
         console.log(blob, {}, {});

         await act(async () => {
         await result.current.uploadAudio(blob, "receiver-id", "sender-id")
         })

         expect(result.current.messages).toContainEqual({ audio : '123', audioDuration : 2 });
      })

       it("sets an error message returned by errHandler", async () => {

        const Err = new Error("something went wrong")
        mockAxios.post.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act(async() => {
        try {
        await result.current.uploadAudio(new Blob(['test-message'], {type : "audio/"}), 'receiver-id', 'sender-id')
        } catch (error) {
        expect(error).toBe(Err)
        }
        });
        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'FAILED_UPLOADING_AUDIO'})
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.users).toEqual([])

    })

     it("sets a default error message when the original error message is not found", async () => {
        
        const Err = new Error(undefined)
        mockAxios.post.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useMessageStore())
        await act( async() => {
        try {
        await result.current.uploadAudio(new Blob(['test-message']), 'receiver-id', 'sender-id')
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'FAILED_UPLOADING_AUDIO'})
        expect(result.current.error).toBe("FAILED_UPLOADING_AUDIO")
        expect(result.current.users).toEqual([])
    })

   it("throws when blob is empty", async () => {
   const {result} = renderHook(() => useMessageStore())
   await act(async () => {
      try {
      await result.current.uploadAudio(new Blob([]), 'receiver-id', 'sender-id')
      } catch (error) {
         expect(error).toEqual(new Error('EMPTY_AUDIO_RECORDING'))
      }
   });
   expect(result.current.messages).toEqual([])
   })

    it("throws when blob is invalid", async () => {
   const {result} = renderHook(() => useMessageStore())
   await act(async () => {
      try {
      await result.current.uploadAudio(undefined as any, 'receiver-id', 'sender-id')
      } catch (error) {
         expect(error).toEqual(new Error('INVALID_AUDIO_RECORDING'))
      }
   });
   expect(result.current.messages).toEqual([])
   })


   it("does not update messages when response has no message field", async () => {
      mockAxios.post.mockResolvedValueOnce({ data: {  } })
      const {result} = renderHook(() => useMessageStore())
      await act(async () => {
         await result.current.uploadAudio(new Blob(['test']), 'receiver-id', 'sender-id')
      });
      expect(result.current.messages).toEqual([])
   })

   })
   })

    
})


 