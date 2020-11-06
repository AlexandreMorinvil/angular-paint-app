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
            new DatabaseService('Wrong url', 'Wrong name', 'Wrong collection');
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should get all drawing from the database', async () => {
        let drawing = await databaseService.getAllDrawings();
        expect(drawing.length).to.equal(1);
        expect(testDrawing).to.deep.equals(drawing[0]);
    });

    it('should throw error when can not get all drawing from the database', async () => {
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

    it('should throw error when can not get specific drawing with valid drawing id', async () => {
        client.close();
        try {
            await databaseService.getDrawing('1');
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
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

    it('should throw error when can not get specific Drawing based on the name', async () => {
        client.close();
        try {
            await databaseService.getDrawingByName(testDrawing.name);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should get specific drawing based on the tags', async () => {
        let secondDrawing: DrawingToDatabase = { _id: '2', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        databaseService.collection.insertOne(secondDrawing);
        const drawings = await databaseService.getDrawingByTags('tag3');
        expect(drawings.length).to.equals(1);
        expect(drawings[0].tags).to.deep.equals(secondDrawing.tags);
        expect(drawings[0].tags).to.not.equals(testDrawing.tags);
    });

    it('should throw error when can not get specific Drawing based on the tags', async () => {
        client.close();
        try {
            await databaseService.getDrawingByTags('tag1');
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should insert a new drawing', async () => {
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: null, name: 'nomtest', tags: ['tag3', 'tag4'] };
        await databaseService.addDrawing(secondDrawing, imageSource);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(2);
        expect(drawings.find((x) => x.name === secondDrawing.name)).to.deep.equals(secondDrawing);
    });

    it('should insert a new drawing', async () => {
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: null, name: 'nomtest', tags: ['tag3', 'tag4'] };
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
        let secondDrawing: DrawingToDatabase = { _id: null, name: '', tags: ['tag3', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing, imageSource);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });

    it('should not insert a new drawing if it has an invalid tags', async () => {
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: null, name: 'nomTest2', tags: ['Bad$$$Tag!!', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing, imageSource);
        } catch {
            let drawings = await databaseService.collection.find({}).toArray();
            expect(drawings.length).to.equal(1);
        }
    });

    it('should not modify an existing drawing data if no valid drawig id is passed', async () => {
        let modifiedDrawing: DrawingToDatabase = { _id: '5', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        await databaseService.updateDrawing(modifiedDrawing._id, modifiedDrawing);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(1);
        expect(drawings.find((x) => x._id === testDrawing._id)?.name).to.not.equals(modifiedDrawing.name);
        expect(drawings.find((x) => x._id === testDrawing._id)?.tags).to.not.equals(modifiedDrawing.tags);
    });

    it('should throw error if try modify an existing drawing data whith a different key', async () => {
        let modifiedDrawing: DrawingToDatabase = { _id: '5', name: 'nomTest2', tags: ['tag3', 'tag4'] };
        try {
            await databaseService.updateDrawing('6', modifiedDrawing);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should throw error if can not existing drawing data in the collection', async () => {
        client.close();
        const imageSource = 'imageSource';
        let secondDrawing: DrawingToDatabase = { _id: null, name: 'nom', tags: ['tag3', 'tag4'] };
        try {
            await databaseService.addDrawing(secondDrawing, imageSource);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should throw error delete an not existing drawing data in the collection', async () => {
        client.close();
        try {
            await databaseService.deleteDrawing('1');
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
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

    it('validate all tags should return not throw error if all tags are valid', () => {
        const tags: string[] = ['a', 'b', 'c'];
        try {
            (databaseService as any).validateAllTags(tags);
        } catch (error) {
            expect(error).to.be.undefined;
        }
    });

    it('validate all tags should  throw error if the number og tags is bigger than max', () => {
        const tags: string[] = ['al', 'bl', 'cl', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'z', 'w'];
        try {
            (databaseService as any).validateAllTags(tags);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate image source should not throw error if image source is valid', () => {
        const imageSource = 'KEJDHTERTGSU';
        try {
            (databaseService as any).validateImageSource(imageSource);
        } catch (error) {
            expect(error).to.be.undefined;
        }
    });

    it('validate image source should throw error if image source is invalid', () => {
        const imageSource = '';
        try {
            (databaseService as any).validateImageSource(imageSource);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate  draw tag should not throw error if the tag is valid', () => {
        const tag = 'valid';
        try {
            (databaseService as any).validateTag(tag);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate  draw tag should throw error if the tag is empty', () => {
        const tag = '';
        try {
            (databaseService as any).validateTag(tag);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate  draw tag should  throw errorif the tag lenght is bigger than max ', () => {
        const tag = 'alsoergdhtryejdklstegreddhud';
        try {
            (databaseService as any).validateTag(tag);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate  draw tag should throw error if the tag has special character', () => {
        const tag = '!@^ahs';
        try {
            (databaseService as any).validateTag(tag);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate  draw name should not throw error if the name is valid', () => {
        const name = 'valid';
        try {
            (databaseService as any).validateName(name);
        } catch (error) {
            expect(error).to.be.undefined;
        }
    });

    it('validate  draw name should throw error if the name is empty', () => {
        const name = '';
        try {
            (databaseService as any).validateName(name);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate  draw name should throw error if the tag lenght is bigger than max', () => {
        const name = 'alsoergdhtryejdklstegreddhudalsoergdhtryejdklstegreddhudamskedjrh';
        try {
            (databaseService as any).validateName(name);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate  draw name should throw error  if the name has special character', () => {
        const name = 'a!!@^name';
        try {
            (databaseService as any).validateName(name);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate drawing should not throw error  if the name, tags are  valid', () => {
        const name = 'dessin';
        const tags: string[] = ['tag2', 'b', 'c'];
        const drawing = new DrawingToDatabase('1', name, tags);
        try {
            (databaseService as any).validateDrawing(drawing);
        } catch (error) {
            expect(error).to.be.undefined;
        }
    });

    it('validate drawing should return false if the name is invalid', () => {
        const name = '';
        const tags: string[] = ['tag2', 'b', 'c'];
        const drawing = new DrawingToDatabase('1', name, tags);
        try {
            (databaseService as any).validateDrawing(drawing);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('validate drawing should return false if the tags are invalid', () => {
        const name = 'valid';
        const tags: string[] = ['réré%', 'b', 'c'];
        const drawing = new DrawingToDatabase('1', name, tags);
        try {
            (databaseService as any).validateDrawing(drawing);
        } catch (error) {
            expect(error).to.not.be.undefined;
        }
    });

    it('should modify an existing drawing data if a valid drawing id  is sent', async () => {
        let modifiedDrawing: DrawingToDatabase = { _id: '1', name: 'nomtestABC', tags: ['tag3', 'tag4'] };
        await databaseService.updateDrawing('1', modifiedDrawing);
        let drawings = await databaseService.collection.find({}).toArray();
        expect(drawings.length).to.equal(1);
        expect(drawings.find((x) => x._id === drawings[0]._id)?.name).to.deep.equals(modifiedDrawing.name);
        expect(drawings.find((x) => x._id === drawings[0]._id)?.tags).to.deep.equals(modifiedDrawing.tags);
    });
});
