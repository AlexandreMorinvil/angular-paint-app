import { DatabaseService } from '@app/services/database/database.service';
import { TYPES } from '@app/types';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class DatabaseController {
    router: Router;
    private readonly ROUTING_GET_ALL: string = '/';
    private readonly ROUTING_POST: string = '/';
    private readonly ROUTING_GET_DRAWING_ID: string = '/:drawingId';
    private readonly ROUTING_GET_NAME: string = '/name/:name';
    private readonly ROUTING_GET_TAG: string = '/tag/:tag';
    private readonly ROUTING_PATCH: string = '/:drawingId';
    private readonly ROUTING_DELETE: string = '/:drawingId';
    private readonly PATH_SAVE_IMAGE_TO_SERVER: string = './drawings/images';

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get(this.ROUTING_GET_ALL, (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((drawings: DrawingToDatabase[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_DRAWING_ID, (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawing(req.params.drawingId)
                .then((drawing: DrawingToDatabase) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_NAME, (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByName(req.params.name)
                .then((drawing: DrawingToDatabase[]) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_TAG, (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByTags(req.params.tag)
                .then((drawing: DrawingToDatabase[]) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post(this.ROUTING_POST, (req: Request, res: Response, next: NextFunction) => {
            const drawingToDatabase: DrawingToDatabase = {
                _id: null,
                name: req.body.name,
                tags: req.body.tags,
            };
            this.databaseService
                .addDrawing(drawingToDatabase, req.body.imageSrc)
                .then(() => {
                    const imageSource: string = req.body.imageSrc;
                    res.status(StatusCodes.CREATED).send();
                    this.saveDrawIntoImageFolder(imageSource, this.databaseService.drawId, this.PATH_SAVE_IMAGE_TO_SERVER);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch(this.ROUTING_PATCH, (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .updateDrawing(req.params.drawingId, req.body)
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete(this.ROUTING_DELETE, (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.drawingId)
                .then(() => {
                    const id: string = req.params.drawingId;
                    res.status(StatusCodes.NO_CONTENT).send();
                    this.deleteDrawIntoImageFolder(id);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }

    private saveDrawIntoImageFolder(imageSource: string, id: string, path: string): void {
        const NAME_DIRECTORY = '/' + id + '.png';
        let img64 = imageSource.replace('data:image/png;base64,', '');
        img64 = img64.split(/\s/).join('');
        fs.writeFileSync(path + NAME_DIRECTORY, img64, { encoding: 'base64' });
    }

    private deleteDrawIntoImageFolder(id: string): void {
        const PATH: string = this.PATH_SAVE_IMAGE_TO_SERVER;
        const PATH_TO_UNLINK: string = PATH + '/' + id + '.png';
        fs.unlinkSync(PATH_TO_UNLINK);
    }
}
