import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions, UpdateQuery } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information
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

    //private readonly ERROR_NO_DRAWING_NAME: string = 'Les dessins doivent contenir un nom';
    //private readonly ERROR_NUMBER_TAG_GREATER_MAXIMUM: string = 'Le nombre détiquettes est supérieur à la limite de 15';
    //private readonly ERROR_NO_TAG: string = 'Les étiquettes assignées ne peuvent pas être vides';
    //private readonly ERROR_MAX_LENGTH_NAME_TAG: string = 'Les étiquettes des dessions doivent contenir un maximum de 25 caractères';
    //private readonly ERROR_MAX_LENGTH_NAME_DRAWING: string = 'Les noms des dessions doivent contenir un maximum de 50 caractères';
    //private readonly ERROR_DELETE_DRAWING: string = 'Échec lors de la tentative de suppression du dessin';
    //private readonly ERROR_UPDATE_DRAWING: string = 'Échec lors de la tentative de mise à jour du dessin';
    //private readonly ERROR_NO_DRAWING_FOUND: string = "Le dessin demandé n'a pas été trouvé";
    //private readonly ERROR_GET_ALL_DRAWING: string = 'Échec lors de la tentative de récupération de tous les dessins';
    //private readonly ERROR_ADD_DRAWING: string = "Échec lors de l'ajout du dessin";
    //private readonly ERROR_GET_DRAWING_BY_TAG: string = "Échec lors de la tentative de récupération de tous les dessins ayant l'étiquettes";
    //private readonly ERROR_GET_DRAWING_BY_NAME: string = 'Échec lors de la tentative de récupération de tous les dessins nommés';
    //private readonly ERROR_NO_IMAGE_SOURCE: string = "Échec lors de la tentative d'ajout il n'y a pas d'image source";
    private readonly CONNECTION_ERROR: string = 'CONNECTION ERROR. EXITING PROCESS';

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.client = client;
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error(this.CONNECTION_ERROR);
                process.exit(1);
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
                throw error;
            });
        // try {
        //     const drawings: DrawingToDatabase[] = await this.collection.find({}).toArray();
        //     return drawings;
        // } catch (error) {
        //     throw new Error(this.ERROR_GET_ALL_DRAWING);
        // }
    }

    async getDrawing(drawingID: string): Promise<DrawingToDatabase> {
        // try {
        //     const drawing: DrawingToDatabase | null = await this.collection.findOne({ _id: new ObjectID(drawingID) });
        //     if (drawing == null) throw new Error('Erreur'); //this.ERROR_NO_DRAWING_FOUND);
        //     return drawing;
        // } catch (error) {
        //     throw error;
        // }

        return this.collection
            .findOne({ _id: drawingID })
            .then((drawing: DrawingToDatabase) => {
                return drawing;
            })
            .catch((error: Error) => {
                throw new Error('Erreur');
            });
    }

    async getDrawingByName(drawingName: string): Promise<DrawingToDatabase[]> {
        let filterQuery: FilterQuery<DrawingToDatabase> = { name: drawingName };
        return this.collection
            .find(filterQuery)
            .toArray()
            .then((drawings: DrawingToDatabase[]) => {
                return drawings;
            })
            .catch(() => {
                throw new Error('No courses for that teacher');
            });
        // try {
        //     const drawings: DrawingToDatabase[] = await this.collection.find({ name: drawingName }).toArray();
        //     return drawings;
        // } catch (error) {
        //     throw new Error(this.ERROR_GET_DRAWING_BY_NAME + drawingName);
        // }
    }

    async getDrawingByTags(drawingTag: string): Promise<DrawingToDatabase[]> {
        // try {
        //     const drawings: DrawingToDatabase[] = await this.collection.find({ tags: drawingTag }).toArray();
        //     return drawings;
        // } catch (error) {
        //     throw new Error(this.ERROR_GET_DRAWING_BY_TAG + drawingTag);
        // }
        let filterQuery: FilterQuery<DrawingToDatabase> = { tags: drawingTag };
        return this.collection
            .find(filterQuery)
            .toArray()
            .then((drawing: DrawingToDatabase[]) => {
                return drawing;
            })
            .catch(() => {
                throw new Error('No courses for that teacher');
            });
    }

    async addDrawing(drawing: DrawingToDatabase, imageSource: string): Promise<void> {
        // try {
        //     this.valideImageSource(imageSource);
        //     this.validateDrawing(drawing);
        //     this.drawId = (await this.collection.insertOne(drawing)).insertedId.toString();
        //     return this.drawId;
        // } catch (error) {
        //     throw new Error(this.ERROR_ADD_DRAWING);
        // }

        // if (!this.validateImageSource(imageSource)) {
        //     return;
        // }

        // if (!this.validateDrawing(drawing)) {
        //     return;
        // }
        if (this.validateImageSource(imageSource) && this.validateDrawing(drawing)) {
            this.collection
                .insertOne(drawing)
                .then((returnValue) => {
                    this.drawId = returnValue.insertedId.toString();
                })
                .catch((error: Error) => {
                    throw error;
                });
        } else {
            throw new Error('Erreur');
        }
    }

    async updateDrawing(drawingID: string, drawing: DrawingToDatabase): Promise<void> {
        // try {
        //     // Update
        //     const filterQuery: FilterQuery<DrawingToDatabase> = { _id: new ObjectID(drawingID) };
        //     const updateQuery: UpdateQuery<DrawingToDatabase> = {
        //         $set: { name: drawing.name, tags: drawing.tags },
        //     };
        //     await this.collection.updateOne(filterQuery, updateQuery);

        //     // Return updated value
        //     const updatedDrawing: DrawingToDatabase | null = await this.collection.findOne({ _id: new ObjectID(drawingID) });
        //     if (!updatedDrawing) throw new Error();
        //     return updatedDrawing;
        // } catch (error) {
        //     throw new Error('error'); //this.ERROR_UPDATE_DRAWING);
        // }

        let filterQuery: FilterQuery<DrawingToDatabase> = { _id: drawingID };
        let updateQuery: UpdateQuery<DrawingToDatabase> = {
            $set: { name: drawing.name, tags: drawing.tags },
        };
        // Can also use replaceOne if we want to replace the entire object
        this.collection
            .updateOne(filterQuery, updateQuery)
            .then(() => {})
            .catch(() => {
                throw new Error('Failed to update document');
            });
    }
    // tslint:disable:no-any
    async deleteDrawing(drawingID: string): Promise<any> {
        // return (
        //     this.collection
        //         // tslint:disable:no-empty
        //         .findOneAndDelete({ _id: new ObjectID(drawingID) })
        //         .then(() => {})
        //         .catch((error: Error) => {
        //             throw new Error(); //this.ERROR_DELETE_DRAWING);
        //         })
        // );
        return this.collection
            .findOneAndDelete({ _id: drawingID })
            .then(() => {})
            .catch((error: Error) => {
                throw new Error('Failed to delete drawing');
            });
    }

    private validateDrawing(drawing: DrawingToDatabase): boolean {
        return this.validateName(drawing.name) && this.validateAllTags(drawing.tags);
    }

    private validateName(name: string): boolean {
        const noName = '';
        return name !== noName && name.length <= this.MAX_LENGHT_DRAW_NAME && /^[0-9a-zA-Z]*$/g.test(name);
    }

    private validateTag(tag: string): boolean {
        return tag !== '' && tag.length <= this.MAX_LENGHT_NAME_TAG && /^[0-9a-zA-Z]*$/g.test(tag);
    }

    private validateImageSource(imageSrc: string): boolean {
        return imageSrc !== '';
    }

    private validateAllTags(tags: string[]): boolean {
        let validTag = true;
        if (tags.length > this.MAX_NUMBER_OF_TAGS) {
            validTag = false;
        }
        tags.forEach((tag) => {
            validTag = validTag && this.validateTag(tag);
        });
        return validTag;
    }
}
