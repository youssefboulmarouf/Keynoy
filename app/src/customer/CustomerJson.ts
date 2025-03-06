export class CustomerJson {
    private readonly id: number;
    private readonly name: string;
    private readonly phone: string;
    private readonly location: string;

    constructor(
        id: number,
        name: string,
        phone: string,
        location: string,
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.location = location;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getPhone(): string {
        return this.phone;
    }

    public getLocation(): string {
        return this.location;
    }

    public static from(body: any): CustomerJson {
        return new CustomerJson(
            body.id,
            body.name,
            body.phone,
            body.location,
        )
    }
}