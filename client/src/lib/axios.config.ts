import axios from 'axios'

 export const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/auth`,
    withCredentials: true
 })

  export const listingApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
    withCredentials: true
 })

   export const ratingApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/ratings`,
    withCredentials: true
 })

   export const MessageApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/message`,
    withCredentials: true
 })

    export const FollowReqApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/requests`,
    withCredentials: true
 })

    export const NotifsApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/notifications`,
    withCredentials: true
 })

    export const UserApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/users`,
    withCredentials: true
 })

   export const BookingApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/bookings`,
    withCredentials: true
 })

 
   export const AudioApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/uploading`,
    withCredentials: true
 })


