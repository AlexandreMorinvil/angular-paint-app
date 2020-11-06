export class DrawingToDatabase {
    // The id follows the format of MongoDB
    // tslint:disable:variable-name
    // tslint:disable:no-any
    _id: any;
    name: string;
    tags: string[];

    constructor(id: any = null, name: string = '', tags: string[] = []) {
        this._id = id;
        this.name = name;
        this.tags = tags;
    }
}
