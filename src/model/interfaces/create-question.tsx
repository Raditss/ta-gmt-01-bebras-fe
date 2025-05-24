export class ICreateQuestion {
    private id?: string;
    private creatorId?: string;
    private title: string;

    constructor(title: string, id?: string, creatorId?: string) {
        this.title = title;
        this.id = id;
        this.creatorId = creatorId;
    }

    public getId(): string | undefined {
        return this.id;
    }

    public getCreatorId(): string | undefined {
        return this.creatorId;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string): void {
        this.title = title;
    }
}