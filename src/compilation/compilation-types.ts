import { ListBlockComp } from "../types/list-impl-types";
import { UserMin } from "../services/user-service";

export interface ListCompileModel {
    uuid : string,
    author: UserMin,
    title: string,
    blocks: ListBlockComp[],
    packageUuids : string[]
}

export function getListPackages(obj : ListCompileModel) : string[] {
    let packageIds : string[] = [];
    obj.blocks.forEach(block => {
        if ('tasks' in block) {
            block.tasks.forEach(task => {
                packageIds.push(...task.packageUuids);
                task.solutions.forEach(solution => {
                    packageIds.push(...solution.packageUuids);
                }) 
            })
        }
    })
    packageIds.push(...obj.packageUuids)
    return Array.from(new Set(packageIds));
}