import { UserProfile, UserRegistration } from "../services/user-service";

// user/login (_, body) => send
export interface PostLoginBody {
    email : string,
    password : string
}
export interface PostLoginSend {
    id : number,
    token : string
}

// user/register (_, body) => send
export type PostRegisterBody = UserRegistration;
export interface PostRegisterSend {
    id : number,
    token : string
}

// user/profile (query, _) => send
export interface GetProfileQuery {
    id : number
}
export interface GetProfilePost {
    profile : UserProfile
}