import { DatabaseService } from '@app/services/database/database.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/schema/drawing';
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
            this.databaseService
                .addDrawing(req.body)
                .then(() => {
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
                    res.status(StatusCodes.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
