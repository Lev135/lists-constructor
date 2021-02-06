import { UserGetProfileModel, UserPostRegistrationModel } from "../services/user-service";

export interface PostLoginBody {
    email : string,
    password : string
}
export interface SendPostLogin {
    id : number,
    token : string
}

export type PostRegisterBody = UserPostRegistrationModel;
export interface SendPostRegister {
    id : number,
    token : string
}

export interface GetProfilePageQuery {
    id : number
}
export interface RenderProfilePage {
    profile : UserGetProfileModel
}