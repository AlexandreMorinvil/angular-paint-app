import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions, UpdateQuery } from 'mongodb';
import 'reflect-metadata';

const DATABASE_URL = 'mongodb+srv://team106:secret106@cluster0.fspbf.azure.mongodb.net/integrator-project?retryWrites=true&w=majority';
const DATABASE_NAME = 'integrator-project';
const DATABASE_COLLECTION = 'drawing';

@injectable()
export class DatabaseService {
    collection: Collection<DrawingToDatabase>;
    client: MongoClient;
    drawId: string;

    private readonly MAX_NUMBER_OF_TAGS: number = 15;
    private readonly MAX_LENGHT_DRAW_NAME: number = 50;
    private readonly MAX_LENGHT_NAME_TAG: number = 25;

    private readonly ERROR_NO_DRAWING_NAME: string = 'Les dessins doivent contenir un nom';
    private readonly ERROR_NUMBER_TAG_GREATER_MAXIMUM: string = 'Le nombre détiquettes est supérieur à la limite de 15';
    private readonly ERROR_NO_TAG: string = 'Les étiquettes assignées ne peuvent pas être vides';
    private readonly ERROR_MAX_LENGTH_NAME_TAG: string = 'Les étiquettes des dessions doivent contenir un maximum de 25 caractères';
    private readonly ERROR_MAX_LENGTH_NAME_DRAWING: string = 'Les noms des dessions doivent contenir un maximum de 50 caractères';
    private readonly ERROR_DELETE_DRAWING: string = 'Échec lors de la tentative de suppression du dessin';
    private readonly ERROR_UPDATE_DRAWING: string = 'Échec lors de la tentative de mise à jour du dessin';
    private readonly ERROR_NO_DRAWING_FOUND: string = "Le dessin demandé n'a pas été trouvé";
    private readonly ERROR_GET_ALL_DRAWING: string = 'Échec lors de la tentative de récupération de tous les dessins';
    private readonly ERROR_GET_DRAWING_BY_TAG: string = "Échec lors de la tentative de récupération de tous les dessins ayant l'étiquettes";
    private readonly ERROR_GET_DRAWING_BY_NAME: string = 'Échec lors de la tentative de récupération de tous les dessins nommés';
    private readonly ERROR_NO_IMAGE_SOURCE: string = "Échec lors de la tentative d'ajout il n'y a pas d'image source";
    private readonly CONNECTION_ERROR: string = 'CONNECTION ERROR. EXITING PROCESS';

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor(databaseUrl: string = DATABASE_URL, databaseName: string = DATABASE_NAME, databaseCollection: string = DATABASE_COLLECTION) {
        MongoClient.connect(databaseUrl, this.options)
            .then((client: MongoClient) => {
                this.client = client;
                this.collection = client.db(databaseName).collection(databaseCollection);
            })
            .catch((error) => {
                console.error(this.CONNECTION_ERROR);
                throw error;
            });
    }

    async getAllDrawings(): Promise<DrawingToDatabase[]> {
        try {
            return await this.collection.find({}).toArray();
        } catch (error) {
            throw new Error(this.ERROR_GET_ALL_DRAWING);
        }
    }

    async getDrawing(drawingID: string): Promise<DrawingToDatabase> {
        try {
            const drawing = await this.collection.findOne({ _id: drawingID });
            if (!drawing) throw new Error(this.ERROR_NO_DRAWING_FOUND);
            return drawing;
        } catch (error) {
            throw error;
        }
    }

    async getDrawingByName(drawingName: string): Promise<DrawingToDatabase[]> {
        try {
            return this.collection.find({ name: drawingName }).toArray();
        } catch (error) {
            throw new Error(this.ERROR_GET_DRAWING_BY_NAME);
        }
    }

    async getDrawingByTags(drawingTag: string): Promise<DrawingToDatabase[]> {
        try {
            const drawings = await this.collection.find({ tags: drawingTag }).toArray();
            if (!drawings) throw new Error();
            return drawings;
        } catch (error) {
            throw new Error(this.ERROR_GET_DRAWING_BY_TAG);
        }
    }

    async addDrawing(drawing: DrawingToDatabase, imageSource: string): Promise<void> {
        try {
            this.validateImageSource(imageSource);
            this.validateDrawing(drawing);
            const insertionResult = await this.collection.insertOne(drawing);
            this.drawId = await insertionResult.insertedId.toString();
        } catch (error) {
            throw error;
        }
    }

    async updateDrawing(drawingID: string, drawing: DrawingToDatabase): Promise<void> {
        const filterQuery: FilterQuery<DrawingToDatabase> = { _id: drawingID };
        const updateQuery: UpdateQuery<DrawingToDatabase> = {
            $set: { name: drawing.name, tags: drawing.tags },
        };
        try {
            await this.collection.updateOne(filterQuery, updateQuery);
        } catch {
            throw new Error(this.ERROR_UPDATE_DRAWING);
        }
    }
    // tslint:disable:no-any
    // tslint:disable:no-empty
    async deleteDrawing(drawingID: string): Promise<any> {
        try {
            return await this.collection.findOneAndDelete({ _id: drawingID });
        } catch {
            throw new Error(this.ERROR_DELETE_DRAWING);
        }
    }

    private async validateDrawing(drawing: DrawingToDatabase): Promise<void> {
        this.validateName(drawing.name);
        this.validateAllTags(drawing.tags);
    }

    private async validateName(name: string): Promise<void> {
        if (!(name !== '')) throw new Error(this.ERROR_NO_DRAWING_NAME);
        if (!(name.length <= this.MAX_LENGHT_DRAW_NAME)) throw new Error(this.ERROR_MAX_LENGTH_NAME_DRAWING);
        if (!/^[0-9a-zA-Z]*$/g.test(name)) throw new Error();
    }

    private async validateTag(tag: string): Promise<void> {
        if (!(tag !== '')) throw new Error(this.ERROR_NO_TAG);
        if (!(tag.length <= this.MAX_LENGHT_NAME_TAG)) throw new Error(this.ERROR_MAX_LENGTH_NAME_TAG);
        if (!/^[0-9a-zA-Z]*$/g.test(tag)) throw new Error();
    }

    private async validateImageSource(imageSrc: string): Promise<void> {
        if (!(imageSrc !== '')) throw new Error(this.ERROR_NO_IMAGE_SOURCE);
    }

    private async validateAllTags(tags: string[]): Promise<void> {
        if (!(tags.length > this.MAX_NUMBER_OF_TAGS)) throw new Error(this.ERROR_NUMBER_TAG_GREATER_MAXIMUM);
        tags.forEach(async (tag) => {
            await this.validateTag(tag);
        });
    }
}
