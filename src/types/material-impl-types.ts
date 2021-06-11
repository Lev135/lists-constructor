import { UserMin } from "../services/user-service";

export interface MaterialCreateImpl {
    themeIds : number[],
    userNote ?: string
}
export interface MaterialGetMaxImpl {
    author: UserMin,
    themeIds: number[],
    creationDate: Date,
    userNote ?: string
}
