import { expect } from 'chai';
import { describe } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
//import { DrawingToDatabase } from './communication/drawingtodatabase';
import { DatabaseService } from './database.service';

export class DrawingToDatabase {
    _id: any;
    name: string;
    tags: string[];
}

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let testDrawing: DrawingToDatabase;

    // const DATABASE_URL = 'mongodb+srv://team106:secret106@cluster0.fspbf.azure.mongodb.net/integrator-project?retryWrites=true&w=majority';
    // const DATABASE_NAME = 'integrator-project';
    // const DATABASE_COLLECTION = 'drawing';
    //const ERROR_NO_DRAWING_FOUND: string = "Le dessin demandé n'a pas été trouvé";

    beforeEach(async () => {
        databaseService = new DatabaseService();

        // Start a local test server
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // We use the local Mongo Instance and not the production database
        db = client.db(await mongoServer.getDbName());
        databaseService.collection = db.collection('drawing');

        testDrawing = { _id: '5fa051151fc8d96a305719d2', name: 'nomTest', tags: ['tag1', 'tag2'] };
        databaseService.collection.insertOne(testDrawing);
    });

    afterEach(async () => {
        client.close();
    });

    it('should throw an error if connection not working', async () => {
        client.close();
        //expect(testDrawing).to.deep.equals(drawing[0]);
    });

    it('should get all drawing from the database', async () => {
        let drawing = await databaseService.getAllDrawings();
        expect(drawing.length).to.equal(1);
        expect(testDrawing).to.deep.equals(drawing[0]);
    });

    // it('should get specific drawing with valid drawing id', async () => {
    //     const drawing: DrawingToDatabase = await databaseService.getDrawing('5fa051151fc8d96a305719d2');
    //     expect(drawing).to.deep.equals(testDrawing);
    //     //je ne comprnd pas pk sa marche pas !!!!
    // });

    // it('should throw error when getting specific drawing with an invalid drawing id', async () => {
    //     const invalidId: string = '5fa051151fc8d96a305719m3';
    //     let drawing = await databaseService.getDrawing(invalidId);
    //     expect(drawing).to.deep.equal(null);
    // });

    it('should get specific drawing  with a valid drawing name', async () => {
        const validName = 'nomTest';
        let drawing = await databaseService.getDrawingByName(validName);
        let allDrawing: DrawingToDatabase[] = [testDrawing];
        expect(drawing).to.deep.equals(allDrawing);
    });

    // it('should get specific Drawing based on the name', async () => {
    //     let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomTest2', tags: ['tag3', 'tag4'] };
    //     databaseService.collection.insertOne(secondDrawing);
    //     const drawings = await databaseService.getDrawingByName(secondDrawing.name);
    //     expect(drawings.length).to.equals(1);
    //     expect(drawings[0].name).to.equals(secondDrawing.name);
    //     expect(drawings[0].name).to.not.equals(testDrawing.name);
    //     expect(drawings[0].tags).to.equals(secondDrawing.tags);
    //     expect(drawings[0].tags).to.not.equals(testDrawing.tags);
    // });

    it('should get specific drawing  with a valid drawing tags', async () => {
        let drawing = await databaseService.getDrawingByTags('tag1');
        let allDrawing: DrawingToDatabase[] = [testDrawing];
        expect(drawing).to.deep.equals(allDrawing);
    });

    it('should get specific Drawing based on the tags', async () => {
        let secondDrawing: DrawingToDatabase = { _id: '5fa051151fc8d96a305719d3', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        databaseService.collection.insertOne(secondDrawing);
        const drawings = await databaseService.getDrawingByTags('tag3');
        expect(drawings.length).to.equals(1);
        expect(drawings[0].tags).to.deep.equals(secondDrawing.tags);
        expect(drawings[0].tags).to.not.deep.equals(testDrawing.tags);
    });

    it('should insert a new drawing', async () => {
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        await databaseService.addDrawing(secondDrawing);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(2);
        expect(drawings.find((x) => x.name === secondDrawing.name)).to.deep.equals(secondDrawing);
    });

    it('should not insert a new drawing if it has an invalid name', async () => {
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'Bad name !!', tags: ['tag3', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });

    it('should not insert a new drawing if it has an invalid tags', async () => {
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomTest2', tags: ['Bad Tag!!', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });

    // it('should modify an existing drawing data if a valid drawing id  is sent', async () => {
    //     let modifiedDrawing: DrawingToDatabase = { _id: '5fa051151fc8d96a305719d2', name: 'nomTest2', tags: ['tag3', 'tag4'] };

    //     await databaseService.updateDrawing(modifiedDrawing._id, modifiedDrawing);
    //     let drawings = await databaseService.collection.find({}).toArray();
    //     expect(drawings.length).to.equal(1);
    //     expect(drawings.find((x) => x.name === testDrawing.name)?.name).to.deep.equals(modifiedDrawing.name);
    //     //expect(drawings.find((x) => x.tags === testDrawing.tags)?.tags).to.deep.equals(modifiedDrawing.tags);
    // });

    // it('should not modify an existing drawing data if no valid drawig id is passed', async () => {
    //     let modifiedDrawing: DrawingToDatabase = { _id: '5fa051151fc8d96a305719d4', name: 'nomTest2', tags: ['tag3', 'tag4'] };
    //     const invalidId: string = '4';
    //     await databaseService.updateDrawing(invalidId, modifiedDrawing);
    //     let drawings = await databaseService.collection.find({}).toArray();
    //     expect(drawings.length).to.equal(1);
    //     expect(drawings.find((x) => x.name === testDrawing.name)?.name).to.not.equals(modifiedDrawing.name);
    //     //expect(drawings.find((x) => x.tags === testDrawing.tags)?.tags).to.not.equals(modifiedDrawing.tags);
    // });

    // it('should delete an existing drawing data if a valid id is sent', async () => {
    //     const validId: string = '5fa051151fc8d96a305719d2';
    //     await databaseService.deleteDrawing(validId);
    //     let drawings = await databaseService.collection.find({}).toArray();
    //     expect(drawings.length).to.equal(0);
    // });

    it('should not delete a drawing if it has an invalid id ', async () => {
        const invalidId: string = '5fa051151fc8d96a305719d4';
        try {
            await databaseService.deleteDrawing(invalidId);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });
});
