import { afterEach, beforeEach, describe, expect, it, vi, type Mock} from "vitest";

 vi.mock("../lib/axios.config", () => {
    return {
        listingApi : {
            post : vi.fn(),
            put : vi.fn(),
            get : vi.fn(),
            delete : vi.fn()
        },
         ratingApi : {
            post : vi.fn(),
            put : vi.fn(),
            get : vi.fn(),
            delete : vi.fn()
        }
    };
 });


 


import "@testing-library/jest-dom/vitest"
import { act, renderHook } from "@testing-library/react";
import type { ErrorHandlerParameters } from "../types/types";
import { listingApi, ratingApi } from "../lib/axios.config";
import { useAuthStore } from "./authStore";
import { isAxiosError, type AxiosInstance } from "axios";
import type { MockedFunctionDeep } from "@vitest/spy";
import * as helpers from "./helpers/errorHelper";
import { useListingStore } from "./listingStore";


describe("useListingStore", () => {
 let mockAxios : MockedFunctionDeep<AxiosInstance>;
 let spy :Mock<({error, defaultErr} : ErrorHandlerParameters) => string>
    beforeEach(() => {
    useListingStore.setState({
    listing:null,
    listings: [],
    userListings:[],
    rating : null,
    ratings : [],
    isAlreadyLiked:false,
    isDashboardLoading:false,
    likes:0,
    likers : [],
    userHasLikedRating:false,
    isLoading:false,
    isListingsLoading : false,
    isCardLoading : false,
    isDeleting:false,
    error:null,
    message : "",
    currentPage:1,
    listingsLength:0
});
    mockAxios = vi.mocked(listingApi, true);
    spy = vi.spyOn(helpers, 'errorHandler').mockImplementation(({error, defaultErr}) => {
                if(isAxiosError(error)) return error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || defaultErr;
                if(error instanceof Error ) return (error as Error)?.message || defaultErr
        });
    })

    afterEach(() => {
        vi.resetAllMocks(); 
        spy.mockRestore()
    })
    

describe("createListing", () => {
    
    it("creates listing successfully", async() => {
    mockAxios.post.mockResolvedValueOnce({data : {listing : {title : "my-property"},
            success : true, message : 'listing created successfully'}})
    const {result} = renderHook(() => useListingStore())

    await act(async() => {
        await result.current.createListing({title : 'my-property'} as any)
    })

    expect(mockAxios.post).toHaveBeenCalledWith('/listings/post-listing', {title : 'my-property'})
    expect(result.current.listing).toEqual({title : 'my-property'});
    expect(result.current.isListingsLoading).toBe(false)
    expect(result.current.message).toBe('listing created successfully')
    })

        it("sets an error message returned by errHandler", async () => {
    
            const Err = new Error("something went wrong")
            mockAxios.post.mockRejectedValueOnce(Err)
            const {result} = renderHook(() => useListingStore())
            await act(async() => {
            try {
            await result.current.createListing({_id : '123'} as any)
            } catch (error) {
            expect(error).toBe(Err)
            }
            });
    
            expect(spy).toHaveBeenCalled()
            expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : "LISTING_CREATION_ERROR"})
            expect(result.current.error).toBe("something went wrong")
            expect(result.current.listing).toBeNull()

    
        })
    
    
            it("sets a default error message when the original error message is not found", async () => {
            
            const Err = new Error(undefined)
            mockAxios.post.mockRejectedValueOnce(Err)
            const {result} = renderHook(() => useListingStore())
            await act( async() => {
            try {
            await result.current.createListing({_id : '123'} as any)
            } catch (error) {
            expect(error).toBe(Err)
            }
            });
    
            expect(spy).toHaveBeenCalled()
            expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : "LISTING_CREATION_ERROR"})
            expect(result.current.error).toBe("LISTING_CREATION_ERROR")
            expect(result.current.listing).toBeNull()
    
        })

    


})

describe("getListings", () => {

    it("fetches listings successfully", async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: { listings: [{ title: "property-1" }], listingsLength: 1 }
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            await result.current.getListings()
        })

        expect(mockAxios.get).toHaveBeenCalledWith('/listings?limit=12&page=1')
        expect(result.current.listings).toEqual([{ title: "property-1" }])
        expect(result.current.listingsLength).toBe(1)
        expect(result.current.isLoading).toBe(false)
    })

    it("sets error message returned by errHandler", async () => {
        const Err = new Error("something went wrong")
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.getListings()
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(result.current.error).toBe("something went wrong")
        expect(result.current.listings).toEqual([])
        expect(result.current.isLoading).toBe(false)
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.getListings()
            } catch (error) {
                expect(error).toEqual(Err)
            }
        })

        expect(result.current.error).toBe("FAILED_TO_FETCH_LISTINGS")
        expect(result.current.listings).toEqual([])
        expect(result.current.isLoading).toBe(false)
    })
})

describe("getListing", () => {

    it("fetches a listing successfully", async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: { listing: { title: "my-property" } }
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
           try {
             await result.current.getListing("123")
           } catch (error) {
            expect(error).toBeDefined()
           }
        })
        expect(mockAxios.get).toHaveBeenCalledWith('/listings/123')
        expect(result.current.listing).toEqual({ title: "my-property" })
        expect(result.current.isCardLoading).toBe(false)
    })

    it("sets error message returned by errHandler", async () => {
        const Err = new Error("something went wrong")
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
           try {
             await result.current.getListing("123")
           } catch (error) {
            expect(error).toBeDefined()
           }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_FETCH_LISTING" })
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.isCardLoading).toBe(false)
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
           try {
             await result.current.getListing("123")
           } catch (error) {
            expect(error).toBeDefined()
           }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_FETCH_LISTING" })
        expect(result.current.error).toBe("FAILED_TO_FETCH_LISTING")
        expect(result.current.isCardLoading).toBe(false)
    })
})

describe("getUserListings", () => {

    it("fetches user listings successfully", async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: { listings: [{ title: "my-property" }] }
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
           try {
             await result.current.getUserListings()
           } catch (error) {
            expect(error).toBeDefined()
           }
        })

        expect(mockAxios.get).toHaveBeenCalledWith('/dashboard')
        expect(result.current.userListings).toEqual([{ title: "my-property" }])
        expect(result.current.isDashboardLoading).toBe(false)
    })

    it("sets error message returned by errHandler", async () => {
        const Err = new Error("something went wrong")
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
           try {
             await result.current.getUserListings()
           } catch (error) {
            expect(error).toBeDefined()
           }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_FETCH_USER_LISTINGS" })
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.isDashboardLoading).toBe(false)
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
           try {
             await result.current.getUserListings()
           } catch (error) {
            expect(error).toBeDefined()
           }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_FETCH_USER_LISTINGS" })
        expect(result.current.error).toBe("FAILED_TO_FETCH_USER_LISTINGS")
        expect(result.current.isDashboardLoading).toBe(false)
    })
})

describe("deleteListing", () => {

    it("deletes listing successfully", async () => {
        mockAxios.delete.mockResolvedValueOnce({
            data: { message: "listing deleted successfully" }
        })
        const { result } = renderHook(() => useListingStore())
        useListingStore.setState({ listings: [{ _id: "123", title: "my-property" } as any] })

        await act(async () => {
            await result.current.deleteListing("123")
        })

        expect(mockAxios.delete).toHaveBeenCalledWith('/dashboard/123')
        expect(result.current.listings).toEqual([])
        expect(result.current.message).toBe("listing deleted successfully")
        expect(result.current.isDeleting).toBe(false)
    })

    it("does not remove other listings when deleting", async () => {
        mockAxios.delete.mockResolvedValueOnce({ data: { message: "deleted" } })
        const { result } = renderHook(() => useListingStore())
        useListingStore.setState({ listings: [{ _id: "123" }, { _id: "456" }] as any })

        await act(async () => {
            await result.current.deleteListing("123")
        })

        expect(result.current.listings).toEqual([{ _id: "456" }])
    })

    it("sets error and rethrows when deletion fails", async () => {
        const Err = new Error("something went wrong")
        mockAxios.delete.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.deleteListing("123")
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_DELETE_LISTING" })
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.isDeleting).toBe(false)
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.delete.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.deleteListing("123")
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(result.current.error).toBe("FAILED_TO_DELETE_LISTING")
        expect(result.current.isDeleting).toBe(false)
    })
})

describe("updateListing", () => {

    it("updates listing successfully", async () => {
        mockAxios.put.mockResolvedValueOnce({
            data: { listing: { _id: "123", title: "updated-property" }, message: "listing updated successfully" }
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            await result.current.updateListing("123", { title: "updated-property" } as any)
        })

        expect(mockAxios.put).toHaveBeenCalledWith('/dashboard/123', { title: "updated-property" })
        expect(result.current.listing).toEqual({ _id: "123", title: "updated-property" })
        expect(result.current.message).toBe("listing updated successfully")
        expect(result.current.isLoading).toBe(false)
    })

    it("sets error and rethrows when update fails", async () => {
        const Err = new Error("something went wrong")
        mockAxios.put.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.updateListing("123", { title: "updated-property" } as any)
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_UPDATE_LISTING" })
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.isLoading).toBe(false)
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.put.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.updateListing("123", { title: "updated-property" } as any)
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_UPDATE_LISTING" })
        expect(result.current.error).toBe("FAILED_TO_UPDATE_LISTING")
        expect(result.current.isLoading).toBe(false)
    })
})

describe("rateListing", () => {
    let mockRatingApi: MockedFunctionDeep<AxiosInstance>

    beforeEach(() => {
        mockRatingApi = vi.mocked(ratingApi, true)
    })

    it("rates listing successfully", async () => {
        mockRatingApi.post.mockResolvedValueOnce({
            data: {
                rating: { value: 5 },
                message: "listing rated successfully",
                listing: { avgRating: 4.5, count: 10 }
            }
        })
        useListingStore.setState({ listings: [{ _id: "123", avgRating: 4, count: 9 } as any] })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            await result.current.rateListing("123", { value: 5 } as any)
        })

        expect(mockRatingApi.post).toHaveBeenCalledWith('/123', { value: 5 })
        expect(result.current.rating).toEqual({ value: 5 })
        expect(result.current.message).toBe("listing rated successfully")
        expect(result.current.listings[0]).toMatchObject({ avgRating: 4.5, count: 10 })
    })

    it("only updates the rated listing, not others", async () => {
        mockRatingApi.post.mockResolvedValueOnce({
            data: { rating: { value: 5 }, message: "rated", listing: { avgRating: 4.5, count: 10 } }
        })
        useListingStore.setState({ listings: [{ _id: "123" }, { _id: "456" }] as any })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            await result.current.rateListing("123", { value: 5 } as any)
        })

        expect(result.current.listings[1]).toEqual({ _id: "456" })
    })

    it("sets error and rethrows when rating fails", async () => {
        const Err = new Error("something went wrong")
        mockRatingApi.post.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.rateListing("123", { value: 5 } as any)
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_RATE_LISTING" })
        expect(result.current.error).toBe("something went wrong")
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockRatingApi.post.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.rateListing("123", { value: 5 } as any)
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(result.current.error).toBe("FAILED_TO_RATE_LISTING")
    })
})

describe("getRatings", () => {
    let mockRatingApi: MockedFunctionDeep<AxiosInstance>
 beforeEach(() => {
        mockRatingApi = vi.mocked(ratingApi, true)
    })
    it("fetches ratings successfully", async () => {
        mockRatingApi.get.mockResolvedValueOnce({
            data: [{ value: 5 }, { value: 4 }]
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            await result.current.getRatings("123")
        })

        expect(mockRatingApi.get).toHaveBeenCalledWith('/123')
        expect(result.current.ratings).toEqual([{ value: 5 }, { value: 4 }])
        expect(result.current.isLoading).toBe(false)
    })

    it("sets error and rethrows when fetching ratings fails", async () => {
        const Err = new Error("something went wrong")
        mockRatingApi.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.getRatings("123")
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_FETCH_RATINGS" })
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.isLoading).toBe(false)
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockRatingApi.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.getRatings("123")
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_FETCH_RATINGS" })
        expect(result.current.error).toBe("FAILED_TO_FETCH_RATINGS")
        expect(result.current.isLoading).toBe(false)
    })
})

describe("likeRating", () => {
 let mockRatingApi: MockedFunctionDeep<AxiosInstance>
 beforeEach(() => {
        mockRatingApi = vi.mocked(ratingApi, true)
         useAuthStore.setState({ user: { _id: "user-1" } as any })
    })

    it("optimistically adds like and confirms with server response", async () => {
        mockRatingApi.post.mockResolvedValueOnce({
            data: ["user-1", "user-2"]
        })
        useListingStore.setState({
            ratings: [{ _id: "rating-1", likers: ["user-2"] } as any],
            isAlreadyLiked: false
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            await result.current.likeRating("rating-1")
        })

        expect(mockRatingApi.post).toHaveBeenCalledWith('/likes/rating-1')
        expect(result.current.ratings[0].likers).toEqual(["user-1", "user-2"])
        expect(result.current.isLoading).toBe(false)
    })

    it("optimistically removes like when already liked", async () => {
        mockRatingApi.post.mockResolvedValueOnce({ data: [] })
        useListingStore.setState({
            ratings: [{ _id: "rating-1", likers: ["user-1"] } as any],
            isAlreadyLiked: true
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            await result.current.likeRating("rating-1")
        })

        expect(result.current.ratings[0].likers).toEqual([])
    })

    it("sets error and rethrows when liking fails", async () => {
        const Err = new Error("something went wrong")
        mockRatingApi.post.mockRejectedValueOnce(Err)
        useListingStore.setState({
            ratings: [{ _id: "rating-1", likers: [] } as any],
            isAlreadyLiked: false
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.likeRating("rating-1")
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_LIKE_RATING" })
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.isLoading).toBe(false)
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockRatingApi.post.mockRejectedValueOnce(Err)
        useListingStore.setState({
            ratings: [{ _id: "rating-1", likers: [] } as any],
            isAlreadyLiked: false
        })
        const { result } = renderHook(() => useListingStore())

        await act(async () => {
            try {
                await result.current.likeRating("rating-1")
            } catch (error) {
                expect(error).toBe(Err)
            }
        })

        expect(result.current.error).toBe("FAILED_TO_LIKE_RATING")
        expect(result.current.isLoading).toBe(false)
    })
})


// describe("searchListings", () => {

//     it("searches listings", async () => {
//         mockAxios.put.mockResolvedValueOnce({
//            data : {}
//         })
//         const { result } = renderHook(() => useListingStore())

//         await act(async () => {
//             await result.current.searchListings({})
//         })

//         expect(mockAxios.put).toHaveBeenCalledWith('/dashboard/123', { title: "updated-property" })
//         expect(result.current.listing).toEqual({ _id: "123", title: "updated-property" })
//         expect(result.current.message).toBe("listing updated successfully")
//         expect(result.current.isLoading).toBe(false)
//     })

//     it("sets error and rethrows when update fails", async () => {
//         const Err = new Error("something went wrong")
//         mockAxios.put.mockRejectedValueOnce(Err)
//         const { result } = renderHook(() => useListingStore())

//         await act(async () => {
//             try {
//                 await result.current.updateListing("123", { title: "updated-property" } as any)
//             } catch (error) {
//                 expect(error).toBe(Err)
//             }
//         })

//         expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_UPDATE_LISTING" })
//         expect(result.current.error).toBe("something went wrong")
//         expect(result.current.isLoading).toBe(false)
//     })

//     it("sets default error when original error message is not found", async () => {
//         const Err = new Error(undefined)
//         mockAxios.put.mockRejectedValueOnce(Err)
//         const { result } = renderHook(() => useListingStore())

//         await act(async () => {
//             try {
//                 await result.current.updateListing("123", { title: "updated-property" } as any)
//             } catch (error) {
//                 expect(error).toBe(Err)
//             }
//         })

//         expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_UPDATE_LISTING" })
//         expect(result.current.error).toBe("FAILED_TO_UPDATE_LISTING")
//         expect(result.current.isLoading).toBe(false)
//     })
// })



})