import AppError from "../utilities/errors/AppError";

export enum PaintTypeEnum {
    PVC = "PVC",
    EAU = "EAU",
}

export function paintTypeFromString(type: string): PaintTypeEnum {
    if (Object.values(PaintTypeEnum).includes(type as PaintTypeEnum)) {
        return type as PaintTypeEnum;
    }
    throw new AppError("Runtime Error", 500, `Invalid PaintTypeEnum value: ${PaintTypeEnum}. Expected 'PVC' or 'EAU'.`);
}