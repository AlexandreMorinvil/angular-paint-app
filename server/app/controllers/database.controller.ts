import { DatabaseService } from '@app/services/database/database.service';
import { TYPES } from '@app/types';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';
import { NextFunction, Request, Response, Router } from 'express';
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
        //this.databaseService.start();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get(this.ROUTING_GET_ALL, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((drawings: DrawingToDatabase[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_DRAWING_ID, async (req: Request, res: Response, next: NextFunction) => {
            console.log('passe par le get');
            this.databaseService
                .getDrawing(req.params.drawingId)
                .then((drawing: DrawingToDatabase) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_NAME, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByName(req.params.name)
                .then((drawing: DrawingToDatabase[]) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_TAG, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByTags(req.params.tag)
                .then((drawing: DrawingToDatabase[]) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.post(this.ROUTING_POST, async (req: Request, res: Response, next: NextFunction) => {
            const drawingToDatabase: DrawingToDatabase = {
                _id: null, // laisser sa a null svp
                name: req.body.name,
                tags: req.body.tags,
            };
            this.databaseService
                .addDrawing(drawingToDatabase)
                .then(() => {
                    try {
                        const imageSource: string = req.body.imageSrc;
                        if (this.valideImageSource(imageSource)) {
                            this.saveDrawIntoImageFolder(imageSource, this.databaseService.drawId, this.PATH_SAVE_IMAGE_TO_SERVER);
                        }
                    } catch (error) {
                        throw error;
                    }
                    res.status(StatusCodes.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch(this.ROUTING_PATCH, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .updateDrawing(req.params.drawingId, req.body)
                .then((drawing: DrawingToDatabase) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete(this.ROUTING_DELETE, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.drawingId)
                .then(() => {
                    // supprimer dans server
                    const id: string = req.params.drawingId;
                    this.deleteDrawIntoImageFolder(id, this.PATH_SAVE_IMAGE_TO_SERVER);
                    res.status(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }

    private saveDrawIntoImageFolder(imageSource: string, id: string, path: string): void {
        // tslint:disable:no-require-imports
        const fs = require('fs');
        const nameDirectory = '/' + id + '.png';
        let img64 = imageSource.replace('data:image/png;base64,', '');
        img64 = img64.split(/\s/).join('');
        console.log(img64);
        fs.writeFileSync(path + nameDirectory, img64, { encoding: 'base64' });
    }

    private deleteDrawIntoImageFolder(id: string, path: string): void {
        // tslint:disable:no-require-imports
        const fs = require('fs');
        const pathToUnlink: string = path + '/' + id + '.png';
        fs.unlinkSync(pathToUnlink);
    }
    private valideImageSource(source: string): boolean {
        return !(source === '');
    }
}
