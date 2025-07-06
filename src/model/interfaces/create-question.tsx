export abstract class ICreateQuestion {
    isDraft: boolean
    private id?: string;
    private creatorId?: string;
    private title: string;
    private description: string;
    private difficulty: string;
    private category: string;
    private points: number;
    private estimatedTime: number;
    private author: string;

    constructor(
        title: string,
        description: string = '',
        difficulty: string = 'EASY',
        category: string = '',
        points: number = 0,
        estimatedTime: number = 0,
        author: string = '',
        id?: string,
        creatorId?: string
    ) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.category = category;
        this.points = points;
        this.estimatedTime = estimatedTime;
        this.author = author;
        this.id = id;
        this.creatorId = creatorId;
        this.isDraft = true;
    }

    // Abstract methods for serialization/deserialization
    abstract contentToString(): string;
    abstract populateFromContentString(contentString: string): void;

    public getId(): string | undefined {
        console.log('🔍 MODEL - Getting question ID:', this.id);
        return this.id;
    }

    public setId(id: string): void {
        console.log('🆔 MODEL - Setting question ID:', {
            oldId: this.id,
            newId: id,
            changed: this.id !== id
        });
        this.id = id;
        console.log('✅ MODEL - Question ID set to:', this.id);
    }

    public getCreatorId(): string | undefined {
        return this.creatorId;
    }

    public setCreatorId(creatorId: string): void {
        this.creatorId = creatorId;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string): void {
        this.title = title;
    }
    
    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }
    
    public getDifficulty(): string {
        return this.difficulty;
    }

    public setDifficulty(difficulty: string): void {
        this.difficulty = difficulty;
    }
    
    public getCategory(): string {
        return this.category;
    }

    public setCategory(category: string): void {
        this.category = category;
    }

    public getPoints(): number {
        return this.points;
    }

    public setPoints(points: number): void {
        this.points = points;
    }
    
    public getEstimatedTime(): number {
        return this.estimatedTime;
    }

    public setEstimatedTime(time: number): void {
        this.estimatedTime = time;
    }

    public getAuthor(): string {
        return this.author;
    }

    public setAuthor(author: string): void {
        this.author = author;
    }

    public getIsDraft(): boolean {
        return this.isDraft;
    }

    public setIsDraft(isDraft: boolean): void {
        this.isDraft = isDraft;
    }
}