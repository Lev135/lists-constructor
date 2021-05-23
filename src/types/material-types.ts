// usernote (query, _) => send
export interface GetUserNoteQuery {
    id : number
}
export interface GetUserNoteSend {
    note ?: string
}

// usernote (query, body) => _
export interface PostUserNoteQuery {
    id : number
}
export interface PostUserNoteBody {
    note ?: string
}
