import { GroupGetNameModel  } from "./group-service";

export interface UserGetMinModel {
  id: number;
  name: string,
  surname: string,
  patronymic?: string,
  email: string
}

export interface UserGetWithGroupsModel extends UserGetMinModel {
  groups: GroupGetNameModel;
}

export interface UserGetProfileModel extends UserGetWithGroupsModel {
  // Ещё разная информация об активности User'a
}

export interface UserPostRegistrationModel extends UserGetMinModel {
  password: string;
}

export async function registerUser(obj: UserPostRegistrationModel) : Promise<number> {
  throw new Error("Not implemented");
}

export async function getUserProfile(id: number) : Promise<UserGetProfileModel> {
  throw new Error("Not implemented");
}