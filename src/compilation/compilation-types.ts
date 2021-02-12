import { ListBlockCompModel, ListCompModel } from "../services/list-service";
import { UserGetMinModel } from "../services/user-service";

export interface ListCompileModel {
    id: number,
    author: UserGetMinModel,
    name: string,
    blocks: ListBlockCompModel[]
}

export function getListPackages(obj : ListCompileModel) : string[] {
    let packageIds : string[] = [];
    obj.blocks.forEach(block => {
        if ('body' in block) {
            packageIds.concat(block.body.packageUuids);
        }
        else {
            block.tasks.forEach(task => {
                packageIds.concat(task.statement.packageUuids);
                task.solutions.forEach(solution => {
                    packageIds.concat(solution.packageUuids);
                }) 
            })
        }
    })
    return Array.from(new Set(packageIds));
}