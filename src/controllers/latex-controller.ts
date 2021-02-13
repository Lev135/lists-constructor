import { getPackages } from "../services/latex-service";

export async function latexPackages(req : any, res : any) {
    res.send(await getPackages());
}