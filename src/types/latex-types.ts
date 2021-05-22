import { PackageGetModel } from "../services/latex-service";

// latex/packages (_, _) => send
export type GetPackagesSend = PackageGetModel[];

// latex/viewPdf (query, _) => file
export interface GetViewPdfQuery {
    uuid : string
}
// ViewPdfSend : .pdf file
