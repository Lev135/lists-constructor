import { UserGetMinModel } from "./user-service";

export interface GroupGetNameModel {
  id: number;
  name: string;
}

export interface GroupGetModel extends GroupGetNameModel {
  description: string;
  creator: UserGetMinModel;
  users: UserGetMinModel[];
}

export interface GroupSetModel extends GroupGetNameModel {
  description: string;
  creatorId: number;
  userIds: number[];
}

export async function createGroup(obj: GroupSetModel) : Promise<number> {
  throw new Error("Not implemented");
}

export async function editGroup(id: number, obj: GroupSetModel) : Promise<void> {
  throw new Error("Not implemented");
}

export async function removeGroup(id: number) : Promise<void> {
  throw new Error("Not implemented");
}

export async function getGroup(id: number) : Promise<GroupGetNameModel> {
  throw new Error("Not implemented");
}