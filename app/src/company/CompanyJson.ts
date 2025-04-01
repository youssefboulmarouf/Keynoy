import {companyTypeFromString} from "./CompanyTypeEnum";

export class CompanyJson {
    private readonly id: number;
    private readonly name: string;
    private readonly type: string;
    private readonly phone: string;
    private readonly location: string;

    constructor(
        id: number,
        name: string,
        type: string,
        phone: string,
        location: string,
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.phone = phone;
        this.location = location;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }

    public getPhone(): string {
        return this.phone;
    }

    public getLocation(): string {
        return this.location;
    }

    public static from(body: any): CompanyJson {
        return new CompanyJson(
            Number(body.id),
            body.name,
            companyTypeFromString(body.type),
            body.phone,
            body.location,
        )
    }
}