import axios from 'axios'

 export const authApi = axios.create({
    baseURL: "http://localhost:8000/api/auth",
    withCredentials: true
 })

  export const listingApi = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true
 })

   export const ratingApi = axios.create({
    baseURL: "http://localhost:8000/api/rating",
    withCredentials: true
 })

   export const MessageApi = axios.create({
    baseURL: "http://localhost:8000/api/message",
    withCredentials: true
 })

    export const FollowReqApi = axios.create({
    baseURL: "http://localhost:8000/api/requests",
    withCredentials: true
 })

    export const UserApi = axios.create({
    baseURL: "http://localhost:8000/api/users",
    withCredentials: true
 })


