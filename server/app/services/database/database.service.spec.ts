import { expect } from 'chai';
import { describe } from 'mocha';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DrawingToDatabase } from '../../../../common/communication/drawing-to-database';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let testDrawing: DrawingToDatabase;

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
        databaseService.collection = db.collection('test');

        testDrawing = { _id: '1', name: 'nomTest', tags: ['tag1', 'tag2'] };
        databaseService.collection.insertOne(testDrawing);
    });

    afterEach(async () => {
        client.close();
    });

    it('Database initialization failure should be caught and close the process', async () => {
        // We use the local Mongo Instance and not the production database
        try {
            new DatabaseService("Wrong url", "Wrong name", "Wrong collection");
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should get all drawing from the database', async () => {
        let drawing = await databaseService.getAllDrawings();
        expect(drawing.length).to.equal(1);
        expect(testDrawing).to.deep.equals(drawing[0]);
    });

    it('should get all drawing from the database', async () => {
        client.close();
        try {
            await databaseService.getAllDrawings();
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should get specific drawing with valid drawing id', async () => {
        const drawing: DrawingToDatabase = await databaseService.getDrawing('1');
        expect(drawing).to.deep.equals(testDrawing);
    });

    // it('should throw error when getting specific drawing with an invalid drawing id', async () => {
    //     const invalidId: string = '6';
    //     let drawing;
    //     try {
    //         drawing = await databaseService.getDrawing(invalidId).then(() => {
    //             throw new Error('Erreur');
    //         });
    //     } catch (error) {
    //         expect(drawing).to.deep.equal(null);
    //         expect(error).to.not.be.undefined;
    //     }
    // });

    it('should get specific drawing  with a valid drawing name', async () => {
        const validName = 'nomTest';
        let drawing = await databaseService.getDrawingByName(validName);
        let allDrawing: DrawingToDatabase[] = [testDrawing];
        expect(drawing).to.deep.equals(allDrawing);
    });

    it('should get specific Drawing based on the name', async () => {
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        databaseService.collection.insertOne(secondDrawing);
        const drawings = await databaseService.getDrawingByName(secondDrawing.name);
        expect(drawings.length).to.deep.equals(1);
        expect(drawings[0].name).to.deep.equals(secondDrawing.name);
        expect(drawings[0].name).to.not.equals(testDrawing.name);
        expect(drawings[0].tags).to.deep.equals(secondDrawing.tags);
        expect(drawings[0].tags).to.not.equals(testDrawing.tags);
    });

    it('should get specific drawing  with a valid drawing tags', async () => {
        let drawing = await databaseService.getDrawingByTags('tag1');
        let allDrawing: DrawingToDatabase[] = [testDrawing];
        expect(drawing).to.deep.equals(allDrawing);
    });

    it('should get specific Drawing based on the tags', async () => {
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        databaseService.collection.insertOne(secondDrawing);
        const drawings = await databaseService.getDrawingByTags('tag3');
        expect(drawings.length).to.equals(1);
        expect(drawings[0].tags).to.deep.equals(secondDrawing.tags);
        expect(drawings[0].tags).to.not.equals(testDrawing.tags);
    });

    it('should insert a new drawing', async () => {
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: '', name: 'nomtest', tags: ['tag3', 'tag4'] };
        await databaseService.addDrawing(secondDrawing, imageSource);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(2);
        expect(drawings.find((x) => x.name === secondDrawing.name)).to.deep.equals(secondDrawing);
    });

    it('should insert a new drawing', async () => {
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomtest', tags: ['tag3', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing, imageSource);
        } catch (error) {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
            expect(error).to.not.be.undefined;
        }
    });

    it('should not insert a new drawing if it has an invalid name', async () => {
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: '2', name: '', tags: ['tag3', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing, imageSource);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });

    it('should not insert a new drawing if it has an invalid tags', async () => {
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomTest2', tags: ['Bad$$$Tag!!', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing, imageSource);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });

    it('should modify an existing drawing data if a valid drawing id  is sent', async () => {
        let modifiedDrawing: DrawingToDatabase = { _id: '1', name: 'nomtest2', tags: ['tag3', 'tag4'] };
        await databaseService.updateDrawing('1', modifiedDrawing);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(1);
        expect(drawings.find((x) => x._id === drawings[0]._id)?.name).to.deep.equals(modifiedDrawing.name);
        expect(drawings.find((x) => x._id === drawings[0]._id)?.tags).to.deep.equals(modifiedDrawing.tags);
    });

    it('should not modify an existing drawing data if no valid drawig id is passed', async () => {
        let modifiedDrawing: DrawingToDatabase = { _id: '5', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        await databaseService.updateDrawing(modifiedDrawing._id, modifiedDrawing);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(1);
        expect(drawings.find((x) => x._id === testDrawing._id)?.name).to.not.equals(modifiedDrawing.name);
        expect(drawings.find((x) => x._id === testDrawing._id)?.tags).to.not.equals(modifiedDrawing.tags);
    });

    it('should delete an existing drawing data if a valid id is sent', async () => {
        const validId: string = '1';
        await databaseService.deleteDrawing(validId);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(0);
    });

    it('should not delete a drawing if it has an invalid id ', async () => {
        const invalidId: string = '5';
        try {
            await databaseService.deleteDrawing(invalidId);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });

    it('validate all tags should return true if all tags are valid', () => {
        const tags: string[] = ['a', 'b', 'c'];
        expect((databaseService as any).validateAllTags(tags)).to.be.true;
    });

    it('validate all tags should return false if the number og tags is bigger than max', () => {
        const tags: string[] = ['al', 'bl', 'cl', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'z', 'w'];
        expect((databaseService as any).validateAllTags(tags)).to.be.false;
    });

    it('validate image source should return true if image source is valid', () => {
        const imageSource = 'KEJDHTERTGSU';
        expect((databaseService as any).validateImageSource(imageSource)).to.be.true;
    });

    it('validate image source should return false if image source is invalid', () => {
        const imageSource = '';
        expect((databaseService as any).validateImageSource(imageSource)).to.be.false;
    });

    it('validate  draw tag should return true if the tag is valid', () => {
        const tag = 'valid';
        expect((databaseService as any).validateTag(tag)).to.be.true;
    });

    it('validate  draw tag should return false if the tag is empty', () => {
        const tag = '';
        expect((databaseService as any).validateTag(tag)).to.be.false;
    });

    it('validate  draw tag should return false if the tag lenght is bigger than max ', () => {
        const tag = 'alsoergdhtryejdklstegreddhud';
        expect((databaseService as any).validateTag(tag)).to.be.false;
    });

    it('validate  draw tag should return false if the tag has special character', () => {
        const tag = '!@^ahs';
        expect((databaseService as any).validateTag(tag)).to.be.false;
    });

    it('validate  draw name should return true if the name is valid', () => {
        const name = 'valid';
        expect((databaseService as any).validateName(name)).to.be.true;
    });

    it('validate  draw name should return false if the name is empty', () => {
        const name = '';
        expect((databaseService as any).validateName(name)).to.be.false;
    });

    it('validate  draw name should return false if the tag lenght is bigger than max', () => {
        const name = 'alsoergdhtryejdklstegreddhudalsoergdhtryejdklstegreddhudamskedjrh';
        expect((databaseService as any).validateName(name)).to.be.false;
    });

    it('validate  draw name should return false if the name has special character', () => {
        const name = 'a!!@^name';
        expect((databaseService as any).validateName(name)).to.be.false;
    });

    it('validate drawing should return true if the name, tags are  valid', () => {
        const name = 'dessin';
        const tags: string[] = ['tag2', 'b', 'c'];
        const drawing = new DrawingToDatabase('1', name, tags);
        expect((databaseService as any).validateDrawing(drawing)).to.be.true;
    });

    it('validate drawing should return false if the name is invalid', () => {
        const name = '';
        const tags: string[] = ['tag2', 'b', 'c'];
        const drawing = new DrawingToDatabase('1', name, tags);
        expect((databaseService as any).validateDrawing(drawing)).to.be.false;
    });

    it('validate drawing should return false if the tags are invalid', () => {
        const name = 'valid';
        const tags: string[] = ['ta@&%%$g2', 'b', 'c'];
        const drawing = new DrawingToDatabase('1', name, tags);
        expect((databaseService as any).validateDrawing(drawing)).to.be.false;
    });
});
