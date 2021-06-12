import { NonOwnerAccessType } from "../services/access-service";

export interface UserQuery  {
    uuid : string,
    userId : number
}

export interface RenameQuery {
    uuid : string,
    newName : string
}

export interface SetAccessLevelBody { 
    userId : number, 
    type : NonOwnerAccessType 
}