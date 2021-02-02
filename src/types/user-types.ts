import { UserGetProfileModel, UserPostRegistrationModel } from "../services/user-service";

export interface PostLogin {
    email : string,
    password : string
}
export interface SendPostLogin {
    id : number,
    token : string
}

export type PostRegister = UserPostRegistrationModel;
export interface SendPostRegister {
    id : number,
    token : string
}

export interface GetProfilePage {
    id : number
}
export interface RenderProfilePage {
    profile : UserGetProfileModel
}