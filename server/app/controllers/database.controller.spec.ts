import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import * as tests from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
//import { DrawingToDatabase } from '../communication/drawingtodatabase';
import { DatabaseService } from '../services/database/database.service';
import { TYPES } from '../types';
import { DatabaseController } from './database.controller';

const HTTP_STATUS_CODE_NOT_FOUND = StatusCodes.NOT_FOUND;
const HTTPS_STATUS_CODE_OK = StatusCodes.OK;
//const HTTPS_STATUS_CODE_CREATED = StatusCodes.CREATED;
//const HTTP_STATUS_NO_CONTENT = StatusCodes.NO_CONTENT;

const ERROR_DELETE_DRAWING: string = 'Échec lors de la tentative de suppression du dessin';
const ERROR_UPDATE_DRAWING: string = 'Échec lors de la tentative de mise à jour du dessin';
const ERROR_NO_DRAWING_FOUND: string = "Le dessin demandé n'a pas été trouvé";
const ERROR_GET_ALL_DRAWING: string = 'Échec lors de la tentative de récupération de tous les dessins';
const ERROR_ADD_DRAWING: string = "Échec lors de l'ajout du dessin";
const ERROR_GET_DRAWING_BY_TAG: string = "Échec lors de la tentative de récupération de tous les dessins ayant l'étiquettes";
const ERROR_GET_DRAWING_BY_NAME: string = 'Échec lors de la tentative de récupération de tous les dessins nommés';

export class DrawingToDatabase {
    _id: any;
    name: string;
    tags: string[];
}
export class Drawing {
    _id: any;
    name: string;
    tags: string[];
    imageSrc: string | undefined;
}

describe('DatabaseController', () => {
    const ROUTING_GET_ALL: string = '/api/drawing';
    const ROUTING_POST: string = '/api/drawing';
    const ROUTING_GET_DRAWING_ID: string = '/api/drawing/:drawingId';
    const ROUTING_GET_NAME: string = '/api/drawing/name/:name';
    const ROUTING_GET_TAG: string = '/api/drawing/tag/:tag';
    const ROUTING_PATCH: string = '/api/drawing/:drawingId';
    const ROUTING_DELETE: string = '/api/drawing/:drawingId';

    let application: Express.Application;
    let databaseController: DatabaseController;
    let databaseService: Stubbed<DatabaseService>;
    let timer: sinon.SinonFakeTimers;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabaseService).toConstantValue({
            getAllDrawings: sandbox.stub(),
            getDrawing: sandbox.stub(),
            getDrawingByName: sandbox.stub(),
            getDrawingByTags: sandbox.stub(),
            addDrawing: sandbox.stub(),
            updateDrawing: sandbox.stub(),
            deleteDrawing: sandbox.stub(),
        });
        application = container.get<Application>(TYPES.Application).app;
        databaseService = container.get(TYPES.DatabaseService);
        databaseController = container.get<DatabaseController>(TYPES.DatabaseController);
        timer = sinon.useFakeTimers();
    });

    afterEach(() => {
        timer.restore();
    });

    it('should get all drawing from the database when routing is all drawing ', async () => {
        const id1: string = '1';
        const id2: string = '2';
        const name1: string = 'alex';
        const name2: string = 'luca';
        const tags1 = new Array<string>('tag1', 'tag2');
        const tags2 = new Array<string>('tag1', 'tag2');
        const drawing1 = new DrawingToDatabase();
        const drawing2 = new DrawingToDatabase();
        drawing1._id = id1;
        drawing1.name = name1;
        drawing1.tags = tags1;
        drawing1._id = id2;
        drawing1.name = name2;
        drawing1.tags = tags2;
        const allDrawing: DrawingToDatabase[] = new Array<DrawingToDatabase>(drawing1, drawing2);
        databaseService.getAllDrawings.resolves(allDrawing);

        return tests(application)
            .get(ROUTING_GET_ALL)
            .expect(HTTPS_STATUS_CODE_OK)
            .then((res: any) => {
                expect(res.body).to.deep.equal(allDrawing);
            });
    });

    it('should return an error of not find if get all drawing is failed', async () => {
        databaseService.getAllDrawings.rejects(new Error(ERROR_GET_ALL_DRAWING));
        return tests(application)
            .get(ROUTING_GET_ALL)
            .expect(HTTP_STATUS_CODE_NOT_FOUND)
            .then((res: any) => {
                expect(res.status).to.equal(HTTP_STATUS_CODE_NOT_FOUND);
            });
    });

    it('should get a drawing from the database when routing is get drawing id ', async () => {
        const id1: string = '1';
        const name1: string = 'alex';
        const tags1 = new Array<string>('tag1', 'tag2');
        const drawing1 = new DrawingToDatabase();
        drawing1._id = id1;
        drawing1.name = name1;
        drawing1.tags = tags1;
        databaseService.getDrawing.resolves(drawing1);

        return tests(application)
            .get(ROUTING_GET_DRAWING_ID)
            .expect(HTTPS_STATUS_CODE_OK)
            .then((res: any) => {
                expect(res.body).to.deep.equal(drawing1);
            });
    });

    it('should return an error of not find if getDrawing is failed', async () => {
        databaseService.getDrawing.rejects(new Error(ERROR_NO_DRAWING_FOUND));
        return tests(application)
            .get(ROUTING_GET_DRAWING_ID)
            .expect(HTTP_STATUS_CODE_NOT_FOUND)
            .then((res: any) => {
                expect(res.status).to.equal(HTTP_STATUS_CODE_NOT_FOUND);
            });
    });

    it('should get a drawing from the database when routing is get drawing by name ', async () => {
        const id1: string = '1';
        const name1: string = 'alex';
        const tags1 = new Array<string>('tag1', 'tag2');
        const drawing1 = new DrawingToDatabase();
        drawing1._id = id1;
        drawing1.name = name1;
        drawing1.tags = tags1;
        databaseService.getDrawingByName.resolves(drawing1);
        return tests(application)
            .get(ROUTING_GET_NAME)
            .expect(HTTPS_STATUS_CODE_OK)
            .then((res: any) => {
                expect(res.body).to.deep.equal(drawing1);
            });
    });

    it('should return an error of not find if getDrawingByName is failed', async () => {
        databaseService.getDrawingByName.rejects(new Error(ERROR_GET_DRAWING_BY_NAME));
        return tests(application)
            .get(ROUTING_GET_NAME)
            .expect(HTTP_STATUS_CODE_NOT_FOUND)
            .then((res: any) => {
                expect(res.status).to.equal(HTTP_STATUS_CODE_NOT_FOUND);
            });
    });

    it('should get a drawing from the database when routing is get drawing by tags ', async () => {
        const id1: string = '1';
        const name1: string = 'alex';
        const tags1 = new Array<string>('tag1', 'tag2');
        const drawing1 = new DrawingToDatabase();
        drawing1._id = id1;
        drawing1.name = name1;
        drawing1.tags = tags1;
        databaseService.getDrawingByTags.resolves(drawing1);

        return tests(application)
            .get(ROUTING_GET_TAG)
            .expect(HTTPS_STATUS_CODE_OK)
            .then((res: any) => {
                expect(res.body).to.deep.equal(drawing1);
            });
    });

    it('should return an error of not find if get drawing by tag is failed', async () => {
        databaseService.getDrawingByTags.rejects(new Error(ERROR_GET_DRAWING_BY_TAG));
        return tests(application)
            .get(ROUTING_GET_TAG)
            .expect(HTTP_STATUS_CODE_NOT_FOUND)
            .then((res: any) => {
                expect(res.status).to.equal(HTTP_STATUS_CODE_NOT_FOUND);
            });
    });

    // it('should add drawing from the database when routing is post ', async () => {
    //     // Il faudrait passer par la fonction saveDraw into image folder pr avoir le bon code
    //     const id1: string = 'null';
    //     const name1: string = 'alex';
    //     const tags1 = new Array<string>('tag1', 'tag2');
    //     const drawing1 = new DrawingToDatabase();
    //     drawing1._id = id1;
    //     drawing1.name = name1;
    //     drawing1.tags = tags1;
    //     //const imageSource = 'IAMELRKFH';
    //     //const path: string = './drawings/images';
    //     databaseService.addDrawing.resolves();
    //     //databaseService.addDrawing.resolves();
    //     //(databaseController as any).valideImageSource.resolves(true);
    //     //(databaseController as any).saveDrawIntoImageFolder.resolves(null);

    //     return tests(application)
    //         .post(ROUTING_POST)
    //         .expect(HTTPS_STATUS_CODE_CREATED)
    //         .then((res: any) => {
    //             //databaseService.addDrawing(drawing1);
    //             //await(databaseController as any).valideImageSource(imageSource);
    //             //let spy2 = await(databaseController as any).saveDrawIntoImageFolder(imageSource, id1, path);
    //             //(databaseController as any).saveDrawIntoImageFolder.resolves(null);
    //             //expect(res.status).to.equal(HTTPS_STATUS_CODE_CREATED);
    //             //expect(spy1).to.have.been.caller();
    //             //expect(spy2).to.have.been.caller();
    //         });
    // });

    it('should return an error of not find if addDrawing is failed', async () => {
        databaseService.addDrawing.rejects(new Error(ERROR_ADD_DRAWING));
        return tests(application)
            .post(ROUTING_POST)
            .expect(HTTP_STATUS_CODE_NOT_FOUND)
            .then((res: any) => {
                expect(res.status).to.equal(HTTP_STATUS_CODE_NOT_FOUND);
            });
    });

    // it('should update the drawing from the server when routing is patch ', async () => {
    //     // Il faudrait passer par la fonction delete draw into image folder pour avoir le bon code
    //     const id1: string = '1';
    //     const name1: string = 'alex';
    //     const tags1 = new Array<string>('tag1', 'tag2');
    //     const drawing1 = new DrawingToDatabase();
    //     drawing1._id = id1;
    //     drawing1.name = name1;
    //     drawing1.tags = tags1;
    //     let spy = await databaseService.updateDrawing(drawing1._id);
    //     databaseService.updateDrawing.resolves(null);
    //     return tests(application)
    //         .patch(ROUTING_PATCH)
    //         .expect(HTTP_STATUS_CODE_NOT_FOUND)
    //         .then((res: any) => {
    //             // expect(res.status).to.equal(HTTP_STATUS_NO_CONTENT);
    //             expect(spy).to.have.been.caller();
    //         });
    // });

    it('should return an error of not find if updtateDrawing is failed', async () => {
        databaseService.updateDrawing.rejects(new Error(ERROR_UPDATE_DRAWING));
        return tests(application)
            .patch(ROUTING_PATCH)
            .expect(HTTP_STATUS_CODE_NOT_FOUND)
            .then((res: any) => {
                expect(res.status).to.equal(HTTP_STATUS_CODE_NOT_FOUND);
            });
    });

    // it('should delete the drawing from the server when routing is delete ', async () => {
    //     // Il faudrait passer par la fonction delete draw into image folder pour avoir le bon code
    //     const id1: string = '1';
    //     const name1: string = 'alex';
    //     const tags1 = new Array<string>('tag1', 'tag2');
    //     const drawing1 = new DrawingToDatabase();
    //     drawing1._id = id1;
    //     drawing1.name = name1;
    //     drawing1.tags = tags1;
    //     let spy = await databaseService.deleteDrawing(drawing1._id);
    //     databaseService.deleteDrawing.resolves(null);
    //     return tests(application)
    //         .delete(ROUTING_DELETE)
    //         .expect(HTTP_STATUS_CODE_NOT_FOUND)
    //         .then((res: any) => {
    //             // expect(res.status).to.equal(HTTP_STATUS_NO_CONTENT);
    //             expect(spy).to.have.been.caller();
    //         });
    // });

    it('should return an error of not find if deleteDrawing is failed', async () => {
        databaseService.deleteDrawing.rejects(new Error(ERROR_DELETE_DRAWING));
        return tests(application)
            .delete(ROUTING_DELETE)
            .expect(HTTP_STATUS_CODE_NOT_FOUND)
            .then((res: any) => {
                expect(res.status).to.equal(HTTP_STATUS_CODE_NOT_FOUND);
            });
    });

    it('valideImageSource should return false if image source is empty', async () => {
        const noImageSource: string = '';
        expect(databaseController['valideImageSource'](noImageSource)).to.eq(false);
    });

    it('valideImageSource should return true if image source is valid', async () => {
        const imageSource: string = 'KTERGHJU';
        expect(databaseController['valideImageSource'](imageSource)).to.eq(true);
    });

    // it('should save the draw in the right folder when imageSource is valid', async () => {
    //     const imageSource: string =
    //         'data:image/png;base64, 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';
    //     const id1: string = '5fa04bbf20a82a5ac81a33b7';
    //     const savingPath: string = './drawings/images';
    //     await (databaseController as any).saveDrawIntoImageFolder(id1, imageSource, savingPath);
    //     const filename = savingPath + '/' + id1 + '.png';
    //     let img64 = imageSource.replace('data:image/png;base64,', '');
    //     img64 = img64.split(/\s/).join('');
    //     const fs = require('fs');
    //     expect(fs.readFileSyn(filename, { encoding: 'base64' })).contain(img64);
    //     expect(databaseController['valideImageSource'](imageSource)).to.eq(true);
    // });

    // it('should remove the draw in the right folder when delete draw into image folder is called', async () => {
    //     const imageSource: string =
    //         'data:image/png;base64, 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';
    //     const id1: string = '5fa04bbf20a82a5ac81a33b7';
    //     const savingPath: string = './drawings/images';
    //     await (databaseController as any).deleteDrawIntoImageFolder(id1, savingPath);
    //     const filename = savingPath + '/' + id1 + '.png';
    //     let img64 = imageSource.replace('data:image/png;base64,', '');
    //     img64 = img64.split(/\s/).join('');
    //     const fs = require('fs');
    //     expect(fs.readFileSyn(filename, { encoding: 'base64' })).not.contain(img64);
    // });

    // it('should save the drawing to the server when routing is post ', async () => {
    //     const id1: string = '1';
    //     const name1: string = 'alex';
    //     const tags1 = new Array<string>('tag1', 'tag2');
    //     const imageSource: string = 'data:image/png;base64 ITGDHTBNL';
    //     const drawing1 = new DrawingToDatabase();
    //     drawing1._id = id1;
    //     drawing1.name = name1;
    //     drawing1.tags = tags1;
    //     databaseService.getAllDrawings.resolves(drawing1);
    //     const savingPath = __dirname;

    //     let spy = await (databaseController as any).saveDrawIntoImageFolder(id1, imageSource, savingPath);
    //     //const spy = sinon.spy(databaseController, 'saveDrawIntoImageFolder');
    //     return tests(application)
    //         .post(ROUTING_POST)
    //         .expect(HTTPS_STATUS_CODE_OK)
    //         .then((res: any) => {
    //             // sinon.assert.called()
    //             expect(spy).to.have.been.caller();
    //             const filename = savingPath + '/' + id1 + '.png';
    //             let img64 = imageSource.replace('data:image/png;base64,', '');
    //             img64 = img64.split(/\s/).join('');
    //             const fs = require('fs');
    //             expect(fs.readFileSyn(filename, { encoding: 'base64' })).contain(img64);
    //             expect(res.status).to.equal(HTTP_STATUS_NO_CONTENT);
    //         });
    // });
});
