import { DatabaseService } from '@app/services/database/database.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/communication/drawing';
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
    private readonly ERROR_NO_IMAGE_SOURCE: string = 'Le dessin a pas une image source';

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
        this.databaseService.start();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get(this.ROUTING_GET_ALL, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_DRAWING_ID, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawing(req.params.drawingId)
                .then((drawing: Drawing) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_NAME, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByName(req.params.name)
                .then((drawing: Drawing[]) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get(this.ROUTING_GET_TAG, async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByTags(req.params.tag)
                .then((drawing: Drawing[]) => {
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
                        this.valideImageSource(imageSource);
                        this.saveDrawIntoImageFolder(imageSource, this.databaseService.drawId);
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
                .then((drawing: Drawing) => {
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
                    //supprimer dans server
                    const id: string = req.body.id;
                    this.deleteDrawIntoImageFolder(id);
                    res.status(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }

    private saveDrawIntoImageFolder(imageSource: string, id: string): void {
        const fs = require('fs');
        const nameDirectory = '/' + id + '.png';
        if (imageSource === undefined) return;
        let img64 = imageSource.replace('data:image/png;base64,', '');
        img64 = img64.split(/\s/).join('');
        fs.writeFileSync('./drawings/images' + nameDirectory, img64, { encoding: 'base64' });
    }

    private deleteDrawIntoImageFolder(id: string) {
        const fs = require('fs');
        const path: string = './drawings/images/' + id + '.png';
        fs.unlinkSync(path);
    }
    private valideImageSource(source: string): void {
        if (source == '' || source == undefined) throw new Error(this.ERROR_NO_IMAGE_SOURCE);
    }
}
