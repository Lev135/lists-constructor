import { ListBlockComp } from "../types/list-impl-types";
import { UserMin } from "../services/user-service";

export interface ListCompileModel {
    id: number,
    author: UserMin,
    name: string,
    blocks: ListBlockComp[]
}

export function getListPackages(obj : ListCompileModel) : string[] {
    let packageIds : string[] = [];
    obj.blocks.forEach(block => {
        if ('body' in block) {
            packageIds.push(...block.body.packageUuids);
        }
        else {
            block.tasks.forEach(task => {
                packageIds.push(...task.statement.packageUuids);
                task.solutions.forEach(solution => {
                    packageIds.push(...solution.packageUuids);
                }) 
            })
        }
    })
    return Array.from(new Set(packageIds));
}