import { AccessType } from "../entities/user-access";
import { MRouter, Uuid } from "../mlib-routes";
import { AccessMax } from "../services/access-service";
import * as s from "../services/user-group-service"
import * as t from "../types/group-types";

const r = MRouter();

function accessChecker(minLevel : AccessType) {
    return ({ uuid } : { uuid : string }, _ : any, userId : number) => 
                s.groupCheckAccessLevel(uuid, userId, minLevel)
}

r.post<void, s.CreateGroupModel, Uuid>({
    path : '/create',
    checker : (_, body, __) => s.createGroupCheck(body),
    handler : (_, body, actorId) =>  s.createGroup(body, actorId)
                                      .then(uuid => ({ uuid }))
})

r.put<t.UserQuery, void, void>({
    path : '/addUser',
    checker : ({ uuid, userId }, _, actorId) => s.addUserInGroupCheck(uuid, userId, actorId),
    handler : ({ uuid, userId }, _, __) =>  s.addUserInGroup(uuid, userId)
})

r.put<t.UserQuery, void, void>({
    path :'/removeUser',
    checker : ({ uuid, userId }, _, actorId) => s.removeUserFromGroupCheck(uuid, userId, actorId),
    handler : ({ uuid, userId }, _, __) => s.removeUserFromGroup(uuid, userId)
})

r.put<t.RenameQuery, void, void>({
    path : '/rename',
    checker : accessChecker(AccessType.moderate),
    handler : ({ uuid, newName }, _, __) => s.renameGroup(uuid, newName)    
})

r.get<Uuid, void, s.GroupMax>({
    path : '/view',
    checker : accessChecker(AccessType.read),
    handler : ({ uuid }, _, __) => s.getGroupMax(uuid)
})

r.put<Uuid, t.SetAccessLevelBody, void>({
    path : '/access',
    checker : accessChecker(AccessType.moderate),
    handler : ({ uuid }, { userId, type }, actorId) => s.setGrouplUserAccess(uuid, type, userId, actorId)
})

export const groupRouter = r.expressRouter
