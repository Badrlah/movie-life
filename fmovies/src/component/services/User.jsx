import { axiosClient } from '../api/axios'
export const UserApi={
    getCsrf: async()=>{
        return await axiosClient.get('/sanctum/csrf-cookie',{
            baseURL:"http://localhost:8000"
        })
    },
    login:async(data)=>{
        return await axiosClient.post('/login',data)
    },
    getUser:async()=>{
        return await axiosClient.get('/user')
    },
    logout:async()=>{
        return await axiosClient.post('/logout')
    },  
    register:async(data)=>{
        return await axiosClient.post('/register',data)
    },
    sendMovie:async(data)=>{
        return await axiosClient.post('/watchlist',data)
    }
}
