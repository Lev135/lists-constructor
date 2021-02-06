export interface GetUserNoteQuery {
    id : number
}

export interface SendUserNote {
    note ?: string
}

export interface PostUserNoteQuery {
    id : number
}

export interface PostUserNoteBody {
    note : string
}