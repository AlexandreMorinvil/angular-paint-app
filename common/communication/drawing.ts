export class Drawing {
    // The id follows the format of MongoDB
    // tslint:disable:variable-name
    // tslint:disable:no-any
    _id: any;
    name: string;
    tags: string[];
    imageSrc: string | undefined;

    constructor(id: any, name: string, tags: string[], imageSrc: string) {
        this._id = id;
        this.name = name;
        this.tags = tags;
        this.imageSrc = imageSrc;
    }
}

export const MAX_NAME_LENGTH = 50;
export const MAX_DRAW_NAME_LENGTH = 50;
export const MAX_TAG_NAME_LENGHT = 25;
export const MAX_NUMBER_TAG = 15;
