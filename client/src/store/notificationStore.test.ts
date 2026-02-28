import { afterEach, beforeEach, describe, expect, it, vi, type Mock} from "vitest";

 vi.mock("../lib/axios.config", () => {
    return {
        NotifsApi : {
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
import { NotifsApi } from "../lib/axios.config";
import { isAxiosError, type AxiosInstance } from "axios";
import type { MockedFunctionDeep } from "@vitest/spy";
import * as helpers from "./helpers/errorHelper";
import { useNotificationStore } from "./notificationStore";









 describe("useNotificationStore", () => {
   let mockAxios : MockedFunctionDeep<AxiosInstance>;
    let spy :Mock<({error, defaultErr} : ErrorHandlerParameters) => string>
   beforeEach(() => {
    useNotificationStore.setState({
    notification: null,
    notifications: [],
    newNotificationIds : [],
    isLoading: false,
    isNotifLoading : false,
    currentPage : 1,
    notifIds : [],
    error: null
    });
       mockAxios = vi.mocked(NotifsApi, true);
       spy = vi.spyOn(helpers, 'errorHandler').mockImplementation(({error, defaultErr}) => {
                   if(isAxiosError(error)) return error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || defaultErr;
                   if(error instanceof Error ) return (error as Error)?.message || defaultErr
           });
       })
   
       afterEach(() => {
           vi.resetAllMocks(); 
           spy.mockRestore()
       })

describe("getIncomingNotifs", () => {

    it("fetches notifications successfully on page 1", async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: { incomingNotifs: [{ _id: "notif-1" }, { _id: "notif-2" }] }
        })
        useNotificationStore.setState({ currentPage: 1, notifications: [] })
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            await result.current.getIncomingNotifs()
        })

        expect(mockAxios.get).toHaveBeenCalledWith('/?page=1&limit=5')
        expect(result.current.notifications).toEqual([{ _id: "notif-1" }, { _id: "notif-2" }])
        expect(result.current.isLoading).toBe(false)
    })

    it("appends notifications when on page > 1", async () => {
        mockAxios.get.mockResolvedValueOnce({
            data: { incomingNotifs: [{ _id: "notif-2" }] }
        })
        useNotificationStore.setState({ currentPage: 2, notifications: [{ _id: "notif-1" } as any] })
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            await result.current.getIncomingNotifs()
        })

        expect(result.current.notifications).toEqual([{ _id: "notif-1" }, { _id: "notif-2" }])
    })

    it("sets error and rethrows when fetching fails", async () => {
        const Err = new Error("something went wrong")
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.getIncomingNotifs()
            } catch (error) {
                expect(error).toBe(Err)
                expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_FETCH_INCOMING_NOTIFICATIONS" })
                expect(result.current.error).toBe("something went wrong")
                expect(result.current.isLoading).toBe(false)
            }
        })
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.get.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.getIncomingNotifs()
            } catch (error) {
                expect(error).toBe(Err)
                expect(result.current.error).toBe("FAILED_TO_FETCH_INCOMING_NOTIFICATIONS")
                expect(result.current.isLoading).toBe(false)
            }
        })
    })
})
describe("markAsRead", () => {

    it("marks notifications as read successfully", async () => {
        mockAxios.put.mockResolvedValueOnce({
            data: { notifIds: ["notif-1", "notif-2"] }
        })
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            await result.current.markAsRead(["notif-1", "notif-2"])
        })

        expect(mockAxios.put).toHaveBeenCalledWith('/read-notifs', { notifIds: ["notif-1", "notif-2"] })
        expect(result.current.notifIds).toEqual(["notif-1", "notif-2"])
        expect(result.current.isNotifLoading).toBe(false)
    })

    it("sets error and rethrows when marking as read fails", async () => {
        const Err = new Error("something went wrong")
        mockAxios.put.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.markAsRead(["notif-1"])
            } catch (error) {
                expect(error).toBe(Err)
                expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_READ_NOTIFICATION" })
                expect(result.current.error).toBe("something went wrong")
                expect(result.current.isNotifLoading).toBe(false)
            }
        })
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.put.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.markAsRead(["notif-1"])
            } catch (error) {
                expect(error).toBe(Err)
                expect(result.current.error).toBe("FAILED_TO_READ_NOTIFICATION")
                expect(result.current.isNotifLoading).toBe(false)
            }
        })
    })
})

describe("markAsArchived", () => {

    it("archives notifications successfully", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: {} })
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            await result.current.markAsArchived(["notif-1", "notif-2"])
        })

        expect(mockAxios.post).toHaveBeenCalledWith('/archive-notifs', { notifIds: ["notif-1", "notif-2"] })
    })

    it("sets error and rethrows when archiving fails", async () => {
        const Err = new Error("something went wrong")
        mockAxios.post.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.markAsArchived(["notif-1"])
            } catch (error) {
                expect(error).toBe(Err)
                expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_ARCHIVE_NOTIFICATION" })
                expect(result.current.error).toBe("something went wrong")
                expect(result.current.isNotifLoading).toBe(false)
            }
        })
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.post.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.markAsArchived(["notif-1"])
            } catch (error) {
                expect(error).toBe(Err)
                expect(result.current.error).toBe("FAILED_TO_ARCHIVE_NOTIFICATION")
            }
        })
    })
})

describe("deleteArchivedNotifs", () => {

    it("deletes archived notifications successfully", async () => {
        mockAxios.post.mockResolvedValueOnce({ data: {} })
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            await result.current.deleteArchivedNotifs(["notif-1", "notif-2"])
        })

        expect(mockAxios.post).toHaveBeenCalledWith('/delete-archived-notifs', { ids: ["notif-1", "notif-2"] })
    })

    it("sets error and rethrows when deleting fails", async () => {
        const Err = new Error("something went wrong")
        mockAxios.post.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.deleteArchivedNotifs(["notif-1"])
            } catch (error) {
                expect(error).toBe(Err)
                expect(spy).toHaveBeenCalledWith({ error: Err, defaultErr: "FAILED_TO_DELETE_ARCHIVED_NOTIFICATIONS" })
                expect(result.current.error).toBe("something went wrong")
                expect(result.current.isNotifLoading).toBe(false)
            }
        })
    })

    it("sets default error when original error message is not found", async () => {
        const Err = new Error(undefined)
        mockAxios.post.mockRejectedValueOnce(Err)
        const { result } = renderHook(() => useNotificationStore())

        await act(async () => {
            try {
                await result.current.deleteArchivedNotifs(["notif-1"])
            } catch (error) {
                expect(error).toBe(Err)
                expect(result.current.error).toBe("FAILED_TO_DELETE_ARCHIVED_NOTIFICATIONS")
            }
        })
    })
})
 })