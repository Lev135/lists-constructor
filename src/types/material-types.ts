import { AccessMax, NonOwnerAccessType } from "../services/access-service";

// material/usernote (query, _) => send
export interface GetUserNoteQuery {
    id : number
}
export interface GetUserNoteSend {
    note ?: string
}

// material/usernote (query, body) => _
export interface PostUserNoteQuery {
    id : number
}
export interface PostUserNoteBody {
    note ?: string
}

// material/accessrules (query, _) => send
export interface GetAccessRulesQuery {
    id : number
}
export type GetAccessRulesSend = AccessMax;

// material/accessrules (query, body) => _
export interface PutAccessRulesQuery {
    id : number
}
export interface PutAccessRulesBody {
    userId : number,
    type : NonOwnerAccessType
}

// material/confirmVersion (query, _) => _
export interface PutConfirmVersionQuery {
    uuid : string
}
