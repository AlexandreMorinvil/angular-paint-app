import { MAX_DRAW_NAME_LENGTH, MAX_NUMBER_TAG, MAX_TAG_NAME_LENGHT } from '@common/communication/drawing';
import { DrawingToDatabase } from '@common/communication/drawingToDatabase';
import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions, ObjectID, UpdateQuery } from 'mongodb';
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
    private readonly ERROR_NO_DRAWING_NAME: string = 'Les dessins doivent contenir un nom';
    private readonly ERROR_NUMBER_TAG_GREATER_MAXIMUM: string = 'Le nombre détiquettes est supérieur à la limite de 15';
    private readonly ERROR_NO_TAG: string = 'Les étiquettes assignées ne peuvent pas être vides';
    private readonly ERROR_MAX_LENGTH_NAME_TAG: string = 'Les étiquettes des dessions doivent contenir un maximum de 25 caractères';
    private readonly ERROR_MAX_LENGTH_NAME_DRAWING: string = 'Les noms des dessions doivent contenir un maximum de 50 caractères';
    private readonly ERROR_DELETE_DRAWING: string = 'Échec lors de la tentative de suppression du dessin';
    private readonly ERROR_UPDATE_DRAWING: string = 'Échec lors de la tentative de mise à jour du dessin';
    private readonly ERROR_NO_DRAWING_FOUND: string = "Le dessin demandé n'a pas été trouvé";
    private readonly ERROR_GET_ALL_DRAWING: string = 'Échec lors de la tentative de récupération de tous les dessins';
    private readonly CONNECTION_ERROR: string = 'CONNECTION ERROR. EXITING PROCESS';

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    start(): void {
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

    closeConnection(): void {
        this.client.close();
    }

    async getAllDrawings(): Promise<DrawingToDatabase[]> {
        try {
            const drawings: DrawingToDatabase[] = await this.collection.find({}).toArray();
            return drawings;
        } catch (error) {
            throw new Error(this.ERROR_GET_ALL_DRAWING);
        }
    }

    async getDrawing(drawingID: string): Promise<DrawingToDatabase> {
        try {
            const drawing: DrawingToDatabase | null = await this.collection.findOne({ _id: new ObjectID(drawingID) });
            if (!drawing) throw new Error(this.ERROR_NO_DRAWING_FOUND);
            return drawing;
        } catch (error) {
            throw error;
        }
    }

    async getDrawingByName(drawingName: string): Promise<DrawingToDatabase[]> {
        try {
            const drawings: DrawingToDatabase[] = await this.collection.find({ name: drawingName }).toArray();
            return drawings;
        } catch (error) {
            throw new Error(`Échec lors de la tentative de récupération de tous les dessins nommés ${drawingName}`);
        }
    }

    async getDrawingByTags(drawingTag: string): Promise<DrawingToDatabase[]> {
        try {
            const drawings: DrawingToDatabase[] = await this.collection.find({ tags: drawingTag }).toArray();
            return drawings;
        } catch (error) {
            throw new Error(`Échec lors de la tentative de récupération de tous les dessins ayant l'étiquettes ${drawingTag}`);
        }
    }

    async addDrawing(drawing: DrawingToDatabase): Promise<void> {
        try {
            this.validateDrawing(drawing);
            this.drawId = await (await this.collection.insertOne(drawing)).insertedId.toString();
            return;
        } catch (error) {
            throw error;
        }
    }

    async updateDrawing(drawingID: string, drawing: DrawingToDatabase): Promise<DrawingToDatabase> {
        try {
            // Update
            const filterQuery: FilterQuery<DrawingToDatabase> = { _id: new ObjectID(drawingID) };
            const updateQuery: UpdateQuery<DrawingToDatabase> = {
                $set: { name: drawing.name, tags: drawing.tags },
            };
            await this.collection.updateOne(filterQuery, updateQuery);

            // Return updated value
            const updatedDrawing: DrawingToDatabase | null = await this.collection.findOne({ _id: new ObjectID(drawingID) });
            if (!updatedDrawing) throw new Error();
            return updatedDrawing;
        } catch (error) {
            throw new Error(this.ERROR_UPDATE_DRAWING);
        }
    }

    async deleteDrawing(drawingID: string): Promise<void> {
        try {
            this.collection.findOneAndDelete({ _id: new ObjectID(drawingID) });
        } catch (error) {
            throw new Error(this.ERROR_DELETE_DRAWING);
        }
    }

    private validateDrawing(drawing: DrawingToDatabase): void {
        this.validateName(drawing.name);
        this.validateTag(drawing.tags);
    }

    private validateName(name: string): void {
        if (!(name.length > 0)) throw new Error(this.ERROR_NO_DRAWING_NAME);
        if (!(name.length <= MAX_DRAW_NAME_LENGTH)) throw new Error(this.ERROR_MAX_LENGTH_NAME_DRAWING);
    }
    private validateTag(tags: string[]): void {
        if (!(tags.length <= MAX_NUMBER_TAG)) throw new Error(this.ERROR_NUMBER_TAG_GREATER_MAXIMUM);
        if (tags.length === 0) return;
        tags.forEach((tag) => {
            if (!(tag.length > 0)) throw new Error(this.ERROR_NO_TAG);
            if (!(tag.length <= MAX_TAG_NAME_LENGHT)) throw new Error(this.ERROR_MAX_LENGTH_NAME_TAG);
        });
    }
}
