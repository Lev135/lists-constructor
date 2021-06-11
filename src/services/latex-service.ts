import { createQueryBuilder, getRepository } from "typeorm";
import { LatexPackage } from "../entities/latex/latex-package";

export async function getPackageName(packageUuid : string) : Promise<string> {
    const pack : LatexPackage = await getRepository(LatexPackage).findOneOrFail(packageUuid);
    return pack.name;
}

export interface PackageGetModel {
    uuid : string,
    name : string
}

export async function addPackage(packageName : string) : Promise<string> {
    return (await getRepository(LatexPackage).save({
        name : packageName,
    })).uuid;
}

export async function getPackages() : Promise<PackageGetModel[]> {
    return await createQueryBuilder(LatexPackage).getMany();
}

export async function packageCheckUuid(uuid : string) : Promise<void> {
    return getPackage(uuid).then(() => {});
}

export async function getPackage(uuid : string) : Promise<LatexPackage> {
    return getRepository(LatexPackage)
        .findOneOrFail(uuid)
        .catch(_ => { throw new Error (`Incorrect package uuid: "${uuid}"`); })
}
