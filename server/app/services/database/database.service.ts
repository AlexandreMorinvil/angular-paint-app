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
    private readonly ERROR_ADD_DRAWING: string = "Échec lors de l'ajout du dessin";
    private readonly ERROR_GET_DRAWING_BY_TAG: string = "Échec lors de la tentative de récupération de tous les dessins ayant l'étiquettes";
    private readonly ERROR_GET_DRAWING_BY_NAME: string = 'Échec lors de la tentative de récupération de tous les dessins nommés';
    private readonly ERROR_NO_IMAGE_SOURCE: string = "Échec lors de la tentative d'ajout il n'y a pas d'image source";
    private readonly ERROR_NO_ALPHABETIC_NUMERIC_NAME: string = 'Le nom ne doit pas contenir de caractères spéciaux';
    private readonly ERROR_NO_ALPHABETIC_NUMERIC_TAG: string = 'Le ou les tags ne doivent pas contenir de caractères spéciaux';
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
        return this.collection
            .find({})
            .toArray()
            .then((drawings: DrawingToDatabase[]) => {
                return drawings;
            })
            .catch((error: Error) => {
                throw new Error(this.ERROR_GET_ALL_DRAWING);
            });
    }

    async getDrawing(drawingID: string): Promise<DrawingToDatabase> {
        return this.collection
            .findOne({ _id: drawingID })
            .then((drawing: DrawingToDatabase) => {
                return drawing;
            })
            .catch((error: Error) => {
                throw new Error(this.ERROR_NO_DRAWING_FOUND);
            });
    }

    async getDrawingByName(drawingName: string): Promise<DrawingToDatabase[]> {
        const filterQuery: FilterQuery<DrawingToDatabase> = { name: drawingName };
        return this.collection
            .find(filterQuery)
            .toArray()
            .then((drawings: DrawingToDatabase[]) => {
                return drawings;
            })
            .catch(() => {
                throw new Error(this.ERROR_GET_DRAWING_BY_NAME);
            });
    }

    async getDrawingByTags(drawingTag: string): Promise<DrawingToDatabase[]> {
        const filterQuery: FilterQuery<DrawingToDatabase> = { tags: drawingTag };
        return this.collection
            .find(filterQuery)
            .toArray()
            .then((drawing: DrawingToDatabase[]) => {
                return drawing;
            })
            .catch(() => {
                throw new Error(this.ERROR_GET_DRAWING_BY_TAG);
            });
    }

    async addDrawing(drawing: DrawingToDatabase, imageSource: string): Promise<void> {
        try {
            this.validateImageSource(imageSource);
            this.validateDrawing(drawing);
            return this.collection
                .insertOne(drawing)
                .then((returnValue) => {
                    this.drawId = returnValue.insertedId.toString();
                })
                .catch((error: Error) => {
                    throw new Error(this.ERROR_ADD_DRAWING);
                });
        } catch (error) {
            throw error;
        }
    }
    // tslint:disable:no-empty
    async updateDrawing(drawingID: string, drawing: DrawingToDatabase): Promise<void> {
        const filterQuery: FilterQuery<DrawingToDatabase> = { _id: drawingID };
        const updateQuery: UpdateQuery<DrawingToDatabase> = {
            $set: { name: drawing.name, tags: drawing.tags },
        };
        this.collection
            .updateOne(filterQuery, updateQuery)
            .then(() => {})
            .catch(() => {
                throw new Error(this.ERROR_UPDATE_DRAWING);
            });
    }
    // tslint:disable:no-any
    async deleteDrawing(drawingID: string): Promise<any> {
        return this.collection
            .findOneAndDelete({ _id: drawingID })
            .then(() => {})
            .catch((error: Error) => {
                throw new Error(this.ERROR_DELETE_DRAWING);
            });
    }

    private validateDrawing(drawing: DrawingToDatabase): void {
        this.validateName(drawing.name);
        this.validateAllTags(drawing.tags);
    }

    private validateName(name: string): void {
        if (name === '') throw new Error(this.ERROR_NO_DRAWING_NAME);
        if (name.length > this.MAX_LENGHT_DRAW_NAME) throw new Error(this.ERROR_MAX_LENGTH_NAME_DRAWING);
        const valid: boolean = /^[0-9a-zA-Z]*$/g.test(name);
        if (!valid) {
            throw new Error(this.ERROR_NO_ALPHABETIC_NUMERIC_NAME);
        }
    }

    private validateTag(tag: string): void {
        if (tag === '') throw new Error(this.ERROR_NO_TAG);
        if (tag.length > this.MAX_LENGHT_NAME_TAG) throw new Error(this.ERROR_MAX_LENGTH_NAME_TAG);
        const valid: boolean = /^[0-9a-zA-Z]*$/g.test(tag);
        if (!valid) {
            throw new Error(this.ERROR_NO_ALPHABETIC_NUMERIC_TAG);
        }
    }

    private validateImageSource(imageSrc: string): void {
        if (imageSrc === '') throw new Error(this.ERROR_NO_IMAGE_SOURCE);
    }

    private validateAllTags(tags: string[]): void {
        if (tags.length > this.MAX_NUMBER_OF_TAGS) throw new Error(this.ERROR_NUMBER_TAG_GREATER_MAXIMUM);
        tags.forEach(async (tag) => {
            this.validateTag(tag);
        });
    }
}
