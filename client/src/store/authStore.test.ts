import { afterEach, beforeEach, describe, expect, it, vi, type Mock} from "vitest";

 vi.mock("../lib/axios.config", () => {
    return {
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
    id: 'mock-socket-id',
 }

 vi.mock("socket.io-client", () => ({
    io : vi.fn(() => mockSocket)
 }));

 


import "@testing-library/jest-dom/vitest"
import { act, renderHook } from "@testing-library/react";
import type { ErrorHandlerParameters, LoginData, SignupData } from "../types/types";
import { authApi } from "../lib/axios.config";
import { useAuthStore } from "./authStore";
import { AxiosError, type AxiosInstance } from "axios";
import type { MockedFunctionDeep } from "@vitest/spy";
import * as helpers from "./helpers/errorHelper";


describe("useAuthStore", () => {
    let mockAxios : MockedFunctionDeep<AxiosInstance>;
    beforeEach(() => {
        useAuthStore.setState({isLoading : false, error: null, isAuthenticated : false, user : null, message : '', 
            socket : null, isUpdatingProfile : false
        });
        mockAxios = vi.mocked(authApi, true);
    })

    afterEach(() => {
        vi.resetAllMocks(); // Clear history + clear call arguments, implemntation, 
        // returned , resolved, rejected values 
    })
    

  describe("login", () => {
    it("logs in successfully", async () => {
    const mockUser : any = { _id : '1'};  
    const mockLoginData = {email : 'user@gmail.com', password : "xwz"} as LoginData;

    const mockResponse = {data : {user : mockUser, message : "logged in successfully", success : true}}
    mockAxios.post.mockResolvedValueOnce(mockResponse);
    const {result} = renderHook(() => useAuthStore());
    await act(async () => {
    await result.current.login(mockLoginData);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual(mockResponse.data.user);
    expect(result.current.isAuthenticated).toBeTruthy()
    expect(result.current.error).toBeNull()
    expect(result.current.message).toBe(mockResponse.data.message)
    expect(mockAxios.post).toHaveBeenCalled()
    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith('/login', mockLoginData)
    })


    it('handles network errors', async () => {
        const mockLoginData = {email : 'user@gmail.com', password : "xwz"} as LoginData;
        const error = new Error('Network Error');

        mockAxios.post.mockRejectedValueOnce(error);
        
        const {result} = renderHook(() => useAuthStore());

        await act(async() => {
         try {
            await result.current.login(mockLoginData);
         } catch (e) {
            expect(e).toBe(error)
         }
        })
        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.isAuthenticated).toBeFalsy();
        expect(result.current.message).toBe('');
        expect(result.current.error).toBe(error.message)

    })

    it('assigns a default error message when error.message is undefined', async() => {
         const mockLoginData = {email : 'user@gmail.com', password : "xwz"} as LoginData;
        const error = new Error(undefined);
        mockAxios.post.mockRejectedValueOnce(error);
        const {result} = renderHook(() => useAuthStore());

        await act(async () => {
            try {
            await result.current.login(mockLoginData);
            } catch (e) {
               expect(e).toEqual(error)
            }
        })
        expect(result.current.error).toBe('USER_LOGING_FAILED')

    })

    it("assigns an axios error when axios throws an error", async() => {

        const mockLoginData = {email : 'user@gmail.com', password : "xwz"} as LoginData;
        const axiosError = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Email not found' },
        headers: {},
        config: { headers: {} } as any 
        }
        );

        mockAxios.post.mockRejectedValueOnce(axiosError);
        const {result} = renderHook(() => useAuthStore());

        await act(async () => {
            try {
            await result.current.login(mockLoginData);
            } catch (e) {
               expect(e).toEqual(axiosError)
            }
        })
        expect(result.current.error).toBe(axiosError.response?.data.message)
        
    })

    it("assigns an axios error when a validation error occurs", async() => {

        const mockLoginData = {email : 'user@gmail.com', password : "xwz"} as LoginData;
        const axiosError = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        
        data: { errors : 
        [ 
         {msg : 'Email is required' }
        ]},
        headers: {},
        config: { headers: {} } as any 
        }
        );

        mockAxios.post.mockRejectedValueOnce(axiosError);
        const {result} = renderHook(() => useAuthStore());

        await act(async () => {
            try {
            await result.current.login(mockLoginData);
            } catch (e) {
               expect(e).toEqual(axiosError)
            }
        })
        expect(result.current.error).toBe(axiosError.response?.data.errors[0].msg)
        
    })
    
  })


  describe("signup", () => {
    it("signs in successfully", async () => {
    const mockUser = { _id : '1'};  
    const mockSignupData : SignupData = {email : 'john@gmail.com', password : "xwz", firstName : 'John', lastName: 'Doe'} 

    const mockResponse = {data : {user : mockUser, message : "SUCCESSFUL_SIGNUP"}}
    mockAxios.post.mockResolvedValueOnce(mockResponse);
    const {result} = renderHook(() => useAuthStore());
    await act(async () => {
    await result.current.signup(mockSignupData);
    });

    expect(result.current.message).toBe('SUCCESSFUL_SIGNUP');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual(mockResponse.data.user);
    expect(result.current.isAuthenticated).toBeTruthy()
    expect(result.current.error).toBeNull()
    expect(result.current.message).toBe(mockResponse.data.message)
    expect(mockAxios.post).toHaveBeenCalled()
    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith('/signup', mockSignupData)
    })


    it('handles network errors', async () => {
          const mockSignupData : SignupData = {email : 'john@gmail.com', password : "xwz", firstName : 'John', lastName: 'Doe'} 
        const error = new Error('Network Error');

        mockAxios.post.mockRejectedValueOnce(error);
        
        const {result} = renderHook(() => useAuthStore());

        await act(async() => {
         try {
            await result.current.signup(mockSignupData);
         } catch (e) {
            expect(e).toBe(error)
         }
        })
        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.isAuthenticated).toBeFalsy();
        expect(result.current.message).toBe('');
        expect(result.current.error).toBe(error.message)

    })

    it('assigns a default error message when error.message is undefined', async() => {
       const mockSignupData : SignupData = {email : 'john@gmail.com', password : "xwz", firstName : 'John', lastName: 'Doe'} 
        const error = new Error(undefined);
        mockAxios.post.mockRejectedValueOnce(error);
        const {result} = renderHook(() => useAuthStore());

        await act(async () => {
            try {
            await result.current.signup(mockSignupData);
            } catch (e) {
               expect(e).toEqual(error)
            }
        })
        expect(result.current.error).toBe('USER_SIGNUP_FAILED')

    })

    it("assigns an axios error when axios throws an error", async() => {

        const mockSignupData : SignupData = {email : 'john@gmail.com', password : "xwz", firstName : 'John', lastName: 'Doe'} 
        const axiosError = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Email not found' },
        headers: {},
        config: { headers: {} } as any 
        }
        );

        mockAxios.post.mockRejectedValueOnce(axiosError);
        const {result} = renderHook(() => useAuthStore());

        await act(async () => {
            try {
            await result.current.login(mockSignupData);
            } catch (e) {
               expect(e).toEqual(axiosError)
            }
        })
        expect(result.current.error).toBe(axiosError.response?.data.message)
        
    })

      it("assigns an axios error when a validation error occurs", async() => {

        const mockSignupData : SignupData = {email : 'john@gmail.com', password : "xwz", firstName : 'John', lastName: 'Doe'} 
        const axiosError = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        
        data: { errors : 
        [ 
         {msg : 'Email is required' }
        ]},
        headers: {},
        config: { headers: {} } as any 
        }
        );

        mockAxios.post.mockRejectedValueOnce(axiosError);
        const {result} = renderHook(() => useAuthStore());

        await act(async () => {
            try {
            await result.current.login(mockSignupData);
            } catch (e) {
               expect(e).toEqual(axiosError)
            }
        })
        expect(result.current.error).toBe(axiosError.response?.data.errors[0].msg)
        
    })
  })

  describe("logout", () => {
    let spy : Mock<() => void>;
    beforeEach(() => {
    spy = vi.spyOn(useAuthStore.getState(), "disconnectSocket");
    })
    afterEach(() => spy.mockRestore()) // restore the original function behavior
   it("logs out successfully", async () => {
     const mockLogoutResponse : any = {data : {message : "SUCCESSFUL_LOGOUT", success : true}};

     mockAxios.post.mockResolvedValueOnce(mockLogoutResponse);
     const {result} = renderHook(() => useAuthStore());
     await act(async () => {
      await result.current.logout();
     })

     expect(result.current.isLoading).toBe(false);
     expect(result.current.error).toBeNull()
     expect(result.current.isAuthenticated).toBe(false)
     expect(result.current.user).toBeNull()
     expect(mockAxios.post).toHaveBeenCalled()
     expect(mockAxios.post).toHaveBeenCalledWith('/logout')
     expect(mockAxios.post).toHaveBeenCalledTimes(1)
     expect(spy).toHaveBeenCalled();
   })

    it("rejects when an error occurs", async () => {
     const mockError = new Error('err');
     mockAxios.post.mockRejectedValueOnce(mockError);
     const {result} = renderHook(() => useAuthStore());

     await act(async () => {
      try {
        await result.current.logout();
      } catch (error) {
        expect(error).toBe(mockError);
      }
     })

     expect(result.current.isLoading).toBe(false);
     expect(result.current.error).toBe("USER_LOGOUT_FAILED")
     expect(result.current.isAuthenticated).toBe(false)
     expect(result.current.user).toBeNull()
     expect(result.current.message).toBe('')
     expect(spy).not.toHaveBeenCalled()
     
   })

   it("completes logout even if socket disconnect fails", async () => {
     
     const mockLogoutResponse : any = {data : {message : "SUCCESSFUL_LOGOUT", success : true}};
     mockAxios.post.mockResolvedValueOnce(mockLogoutResponse);
    
    spy.mockImplementation(async () => { 
        throw new Error('socket disconnect failed')
    })

     const {result} = renderHook(() => useAuthStore());

     await act(async () => {
      await result.current.logout();
     })

    expect(spy).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false) // user is logged out even though disconnectSocket failed!
   })
   
  });

    describe("checkAuth", () => {

    it('checks user authentication and sets user data', async() => {
    mockAxios.get.mockResolvedValueOnce({data : {user : {email : 'user@gmail.com', name : "user", _id: '123'}}});
    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
    await result.current.checkAuth();
    });

    expect(mockAxios.get).toHaveBeenCalled()
    expect(mockAxios.get).toHaveBeenCalledWith("/checkAuth");
    expect(result.current.user).toEqual({email : 'user@gmail.com', name : "user", _id: '123'})
    expect(result.current.isCheckingAuth).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBe(null)
    })

    it('should not assign an error message', async() => {
    mockAxios.get.mockRejectedValueOnce(new Error("error"))
    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
    try {
    await result.current.checkAuth();      
    } catch (error) {
      expect(error).toEqual(new Error('error'))      
    }
    });

    expect(mockAxios.get).toHaveBeenCalled()
    expect(result.current.user).toBeNull()
    expect(result.current.isCheckingAuth).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull()
    })
 })

  describe("forgotPassword", () => {
    let spy :Mock<({error, defaultErr} : ErrorHandlerParameters) => string>
    beforeEach(() => {
    spy = vi.spyOn(helpers, "errorHandler")
    })
    afterEach(() => {
     spy.mockRestore();
    })
    it("sends a password reset link on success", async() => {
        mockAxios.post.mockResolvedValueOnce({data : {success : true,
             message : 'a password reset link sent successfully!'}})
        const {result} = renderHook(() => useAuthStore());

        await act(async() => {
            await result.current.forgotPassword("user@gmail.com");
        })

        expect(mockAxios.post).toHaveBeenCalled()
        expect(mockAxios.post).toHaveBeenCalledWith("/forgot-password", {email : "user@gmail.com"}) 
        // this structure is important cuz it lets us extract the password value in the backend.
        expect(mockAxios.post).toHaveBeenCalledTimes(1)

        expect(result.current.isLoading).toBe(false);
        expect(result.current.message).toBe('a password reset link sent successfully!')
        expect(result.current.error).toBeNull()
        expect(result.current.isSubmitted).toBe(true);

 })

 it("returns an error message when email is not found or undefined!", async() => {

    mockAxios.post.mockRejectedValueOnce(new Error("Email is not found!"))
    const {result} = renderHook(() => useAuthStore());
    await act(async() => {
    try {
    await result.current.forgotPassword(""); 
    } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error).toEqual(new Error("Email is not found!"))     
    }
    })
    expect(mockAxios.post).toHaveBeenCalled()
    expect(mockAxios.post).toHaveBeenCalledWith("/forgot-password", { email : "" })
    expect(result.current.error).toBe("Email is not found!")
    expect(result.current.message).toBe("")
    expect(result.current.isLoading).toBe(false)
    expect(spy).toHaveBeenCalled();
    })
 
})

 describe("resetPassword", () => {
    let spy :Mock<({error, defaultErr} : ErrorHandlerParameters) => string>
    beforeEach(() => {
    spy = vi.spyOn(helpers, "errorHandler")
    })
    afterEach(() => {
     spy.mockRestore();
    })
    it("resets password successfully", async() => {
        mockAxios.put.mockResolvedValueOnce({data : {success : true, message : 'password reset successfully'}})
        const {result} = renderHook(() => useAuthStore());

        await act(async() => {
            await result.current.resetPassword("newPassword@xwz123", "my-token");
        })

        expect(mockAxios.put).toHaveBeenCalled()
        expect(mockAxios.put).toHaveBeenCalledWith("/reset-password/my-token", {password : "newPassword@xwz123"}) 
        // this structure is important cuz it lets us extract the password value in the backend.
        expect(mockAxios.put).toHaveBeenCalledTimes(1)

        expect(result.current.isLoading).toBe(false);
        expect(result.current.message).toBe('password reset successfully')
        expect(result.current.error).toBeNull()

 })


  it("sets an error message returned by errorHandler", async () => {
    const mockError = new Error('something went wrong!');
    const MockUndefinedError = new Error(undefined);

    spy = vi.spyOn(helpers, "errorHandler").mockImplementation(({error, defaultErr}) => {
        return (error as Error)?.message || defaultErr
    })

    const {result} = renderHook(() => useAuthStore());

    const inputs = [mockError, MockUndefinedError]

    for(const Err of inputs) {
    // returns a fallback message if error.message is undefined!
    vi.clearAllMocks()    
    mockAxios.put.mockRejectedValueOnce(Err)
    await act(async() => {    
    try {
    await result.current.resetPassword("newPassword@xwz123", "my-token");           
    } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect((error as Error)?.message).toBe(Err?.message)
    }    
    });
   
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'ERROR_RESETING_PASSWORD'});
    expect(spy(
    {error : Err , defaultErr : 'ERROR_RESETING_PASSWORD'}
    )).toBe(Err?.message || "ERROR_RESETING_PASSWORD" );
    expect(result.current.error).toBe(Err?.message || "ERROR_RESETING_PASSWORD" );
    expect(result.current.isLoading).toBe(false);

    }
    
    
  })
 
})

describe("tryToRefreshAccessToken", () => {

    let spy :Mock<({error, defaultErr} : ErrorHandlerParameters) => string>
   
    beforeEach(() => {
    spy = vi.spyOn(helpers, "errorHandler")
    });

    afterEach(() => {
     spy.mockRestore();
    });
    it("refreshes access token via refreshToken on success when the verificationToken is valid but expired", async() => {
         const code = '123456'
        mockAxios.post
        .mockResolvedValueOnce({data : { success : true, accessToken : code }})
        .mockResolvedValueOnce({data : {message : 'done', success : true}});

        const {result} = renderHook(() => useAuthStore());
 
        await act(async() => {
            await result.current.tryToRefreshAccessToken(code)
        })

        expect(mockAxios.post).toHaveBeenCalled()
        expect(mockAxios.post).toHaveBeenCalledTimes(2)
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, `/refresh-token?code=${code}`) 
        expect(mockAxios.post).toHaveBeenNthCalledWith(2, `/verify-email`, {accessToken : code}) 

        expect(result.current.isLoading).toBe(false);
        expect(result.current.accessToken).toBe(code);
        expect(result.current.error).toBeNull();
       
 })




  it("sets an error message returned by errorHandler", async () => {
    const mockError = new Error('something went wrong!');
    const MockUndefinedError = new Error(undefined);

    spy = vi.spyOn(helpers, "errorHandler").mockImplementation(({error, defaultErr}) => {
        return (error as Error)?.message || defaultErr
    })

    const {result} = renderHook(() => useAuthStore());

    const inputs = [mockError, MockUndefinedError]

    for(const Err of inputs) {
    // returns a fallback message if error.message is undefined!
    vi.clearAllMocks()    
    mockAxios.post.mockRejectedValueOnce(Err);
    await act(async() => {    
    try {
    await result.current.tryToRefreshAccessToken("12");  
     // the verificationToken is wrong so it will throw 'UNAUTH_USER'  
     // if the verificationToken was correct but the verificationToken was expired it will return the verification
     // token we sent and then it will make another request to '/verify-email'

    } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect((error as Error)?.message).toBe(Err?.message)
    }    
    });
   
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'ERR_REFRESHING_TOKEN'});
    expect(spy(
    {error : Err , defaultErr : 'ERR_REFRESHING_TOKEN'}
    )).toBe(Err?.message || "ERR_REFRESHING_TOKEN" );
    expect(result.current.error).toBe(Err?.message || "ERR_REFRESHING_TOKEN" );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false)

    }
    
    
  })


  


 
})



describe("verifyEmail", () => {

    let spy :Mock<({error, defaultErr} : ErrorHandlerParameters) => string>
    let tryToRefreshAccessToken : Mock<(code:string) => Promise<any>>
    beforeEach(() => {
    spy = vi.spyOn(helpers, "errorHandler")
    tryToRefreshAccessToken = vi.spyOn(useAuthStore.getState(), 'tryToRefreshAccessToken')
    });

    afterEach(() => {
     spy.mockRestore();
     tryToRefreshAccessToken.mockRestore()
    });
    it("verifies email successfully", async() => {
        const code = '123456'
        mockAxios.post
        .mockResolvedValueOnce({data : {message : 'done', success : true}});

        const {result} = renderHook(() => useAuthStore());
 
        await act(async() => {
            await result.current.verifyEmail(code)
        })

        expect(mockAxios.post).toHaveBeenCalled()
        expect(mockAxios.post).toHaveBeenCalledTimes(1)
        expect(mockAxios.post).toHaveBeenCalledWith(`/verify-email`, {code}) 

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.error).toBeNull();
       
 })


  it("sets an error message returned by errorHandler", async () => {
    const mockError = new Error('something went wrong!');
    const MockUndefinedError = new Error(undefined);

    spy = vi.spyOn(helpers, "errorHandler").mockImplementation(({error, defaultErr}) => {
        return (error as Error)?.message || defaultErr
    })

    const {result} = renderHook(() => useAuthStore());

    const inputs = [mockError, MockUndefinedError]

    for(const Err of inputs) {
    // returns a fallback message if error.message is undefined!
    vi.clearAllMocks()    
    mockAxios.post.mockRejectedValueOnce(Err);
    await act(async() => {    
    try {
    await result.current.verifyEmail('')
         
    } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect((error as Error)?.message).toBe(Err?.message)
    }    
    });
   
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'USER_VERIFICATION_FAILED'});
    expect(spy(
    {error : Err , defaultErr : 'USER_VERIFICATION_FAILED'}
    )).toBe(Err?.message || "USER_VERIFICATION_FAILED" );
    expect(result.current.error).toBe(Err?.message || "USER_VERIFICATION_FAILED" );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false)

    }
    
    
  })

  it("calls tryToRefreshAccessToken when the verification code is expired", async() => {
    mockAxios.post.mockResolvedValueOnce({data : {success : false , message : "EXPIRED_VERIFICATION_CODE"}})

    const {result} = renderHook(() => useAuthStore())
    await act(async() => {
        await result.current.verifyEmail('123456')
    })
    expect(tryToRefreshAccessToken).toHaveBeenCalled()

  })

    it("rejects refreshing access token when the verificationToken is wrong", async() => {
    mockAxios.post.mockResolvedValueOnce({data : {success : false , message : "EXPIRED_VERIFICATION_CODE"}})

    const {result} = renderHook(() => useAuthStore())
    await act(async() => {
        await result.current.verifyEmail('')
    })
    expect(tryToRefreshAccessToken).toHaveBeenCalled()
    expect(mockAxios.post).toHaveBeenCalled()
    expect(mockAxios.post).toHaveBeenNthCalledWith(1, '/verify-email', {code : ""})
    expect(mockAxios.post).toHaveBeenNthCalledWith(2, `/refresh-token?code=${""}`)
    expect(mockAxios.post).toHaveBeenNthCalledWith(3, '/verify-email', { accessToken : undefined})
    expect(result.current.isAuthenticated).toBe(false)

  })


 
})


  describe("updateProfile", () => {
    let spy :Mock<({error, defaultErr} : ErrorHandlerParameters) => string>
   
    beforeEach(() => {
    spy = vi.spyOn(helpers, "errorHandler")
    });

    afterEach(() => {
     spy.mockRestore();
    })

    it("updates user profile on success", async () => {
    const mockResponse = {data : {
        user : {firstName : "User", email : "user@gmail.com"},
        success : true, 
        message : ['update-profile', 'completed-onboarding']
    }}

    mockAxios.put.mockResolvedValueOnce(mockResponse);
    const {result} = renderHook(() => useAuthStore());
    await act(async () => {
    await result.current.updateProfile(mockResponse.data.user as any);
    });
    expect(result.current.isUpdatingProfile).toBe(false);
    expect(result.current.user).toEqual(mockResponse.data.user);
    expect(result.current.error).toBeNull();
    expect(mockAxios.put).toHaveBeenCalled();
    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put).toHaveBeenCalledWith('/update-profile', mockResponse.data.user);
    expect(result.current.isOnboarding).toBe(false)
    expect(result.current.message).toBe(mockResponse.data.message[0])

    })

    it("returns an onboarding message when a non-onboarded user updates their profile", async() => {
     const mockResponse = {data : {
        user : {firstName : "User", email : "user@gmail.com"},
        success : true, 
        message : ['update-profile', 'completed-onboarding']
    }}

    mockAxios.put.mockResolvedValueOnce(mockResponse);
    const {result} = renderHook(() => useAuthStore());
    await act(async () => {
    result.current.setIsOnBoarding(true)    
    await result.current.updateProfile(mockResponse.data.user as any);
    });
    expect(result.current.isUpdatingProfile).toBe(false);
    expect(result.current.user).toEqual(mockResponse.data.user);
    expect(result.current.error).toBeNull();
    expect(mockAxios.put).toHaveBeenCalled();
    expect(mockAxios.put).toHaveBeenCalledTimes(1);
    expect(mockAxios.put).toHaveBeenCalledWith('/update-profile', mockResponse.data.user);
    expect(result.current.isOnboarding).toBe(true)
    expect(result.current.message).toBe(mockResponse.data.message[1])
    })

    
  it("sets an error message returned by errorHandler", async () => {
    const mockError = new Error('something went wrong!');
    const MockUndefinedError = new Error(undefined);

    spy = vi.spyOn(helpers, "errorHandler").mockImplementation(({error, defaultErr}) => {
      return (error as Error)?.message || defaultErr
    })

    const {result} = renderHook(() => useAuthStore());

    const inputs = [mockError, MockUndefinedError]

    for(const Err of inputs) {
    // returns a fallback message if error.message is undefined!
    vi.clearAllMocks()    
    mockAxios.put.mockRejectedValueOnce(Err)
    await act(async() => {    
    try {
    await result.current.updateProfile({user : {firstName : null, email : null}} as any)         
    } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect((error as Error)?.message).toBe(Err?.message)
    }    
    });
 
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'PROFILE_UPDATING_FAILED'});
    expect(spy(
    {error : Err , defaultErr : 'PROFILE_UPDATING_FAILED'}
    )).toBe(Err?.message || "PROFILE_UPDATING_FAILED" );
    expect(result.current.error).toBe(Err?.message || "PROFILE_UPDATING_FAILED" );
    expect(result.current.isUpdatingProfile).toBe(false);

    }
    
    
  })

    
  })



 describe("connectSocket", () => {
      beforeEach(() => {
        useAuthStore.setState({socket : null, onlineUsers : []})
        mockSocket.connected = false
        vi.clearAllMocks();
    })
   
   it("initializes socket connection when a user is authenticated!", async() => {

    mockAxios.post.mockResolvedValueOnce({
        data :
         {
            user : {firstName : 'omar', email : 'omar@gmail.com'},
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
    expect(result.current.user).toEqual({firstName : 'omar', email : 'omar@gmail.com'})
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.socket).toBe(mockSocket)
    expect(mockSocket.on).toHaveBeenCalled()
    expect(mockSocket.on).toHaveBeenCalledTimes(3)
    expect(mockSocket.on).toHaveBeenNthCalledWith(1, 'connect', expect.any(Function))
    expect(mockSocket.on).toHaveBeenNthCalledWith(2, 'getOnlineUsers', expect.any(Function))
    expect(mockSocket.on).toHaveBeenNthCalledWith(3, 'disconnect', expect.any(Function))

    // test the event callback fn
    const userIds = ['1234', '3939', '9393'];
    const userIdCallback = mockSocket.on.mock.calls.find((call) => call[0] === "getOnlineUsers")?.[1]; 
    // this returned the callback function as the second argument the event callback fn accepts.
    act(() => {
        userIdCallback(userIds);
    }) 
    expect(result.current.onlineUsers).toEqual(userIds)
    
  })

  it("does nothing when a user is unauthenticated", async() => {

    mockAxios.post.mockRejectedValueOnce(new Error('email not found'));

    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
        try {
             await result.current.login(null as any)
        } catch (error) {
            expect(error).toEqual(new Error("email not found"))
        }
    });

    act(() => {
        result.current.connectSocket();
    });

    expect(result.current.user).toEqual(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.socket).toBe(null);
    expect(mockSocket.on).not.toHaveBeenCalled();
    
  })

  
   it("does nothing when the socket is already connected", async() => {
    mockSocket.connected = false; // socket is disconnected
    mockAxios.post.mockResolvedValueOnce({
        data :
         {
            user : {firstName : 'omar', email : 'omar@gmail.com'},
            success : true
         }
    });

    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
      await result.current.login({firstName : "omar", email : 'omar@gmail.com'} as any)
    });


    act(() => {
    result.current.connectSocket();
    })
    expect(result.current.socket).toBe(mockSocket);
    expect(result?.current?.socket?.connected).toBe(false);
    expect(mockSocket.on).toHaveBeenCalled();

    mockSocket.connected = true;
    vi.clearAllMocks();

    act(() => result.current.connectSocket())

    expect(result.current.socket?.connected).toBe(true)
    expect(mockSocket.on).not.toHaveBeenCalled();
    expect(mockSocket.disconnect).not.toHaveBeenCalled();

  })

  })

  describe("disconnectSocket", () => {
    beforeEach(() => {
        useAuthStore.setState({socket : null, onlineUsers : []})
        mockSocket.connected = false
        vi.clearAllMocks();
    })
    
    it("disconnects the socket on success when the user is connected", async() => {
    mockSocket.connected = true;
    mockAxios.post.mockResolvedValueOnce({
        data :
         {
            user : {firstName : 'omar', email : 'omar@gmail.com'},
            success : true
         }
    });

    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
        await result.current.login({firstName : "omar", email : 'omar@gmail.com'} as any)
    });    

    act(() => {
     result.current.connectSocket()   
     result.current.disconnectSocket()    
    });

    expect(result.current.socket).toEqual(mockSocket)
    expect(mockSocket.disconnect).toHaveBeenCalled()

    })

    it("does nothing when a socket is disconnected", async() => {
    mockSocket.connected = false;
    const {result} = renderHook(() => useAuthStore());

    await act(async() => {
        await result.current.login({firstName : "omar", email : 'omar@gmail.com'} as any)
    });    

    act(() => {
     result.current.connectSocket()   
     result.current.disconnectSocket()    
    });

    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });

  })

})
