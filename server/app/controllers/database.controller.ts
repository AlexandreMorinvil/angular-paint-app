import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { DatabaseService } from '@app/services/database/database.service';
import { inject, injectable } from 'inversify';

import { TYPES } from '@app/types';
import { Drawing } from '@common/schema/drawing';

@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
        this.databaseService.start();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.json(drawings);
                })
                .catch((error:Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/:drawingId', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawing(req.params.drawingId)
                .then((drawing:Drawing) => {
                    res.json(drawing);
                })
                .catch((error:Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/name/:name', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByName(req.params.name)
                .then((drawing:Drawing[]) => {
                    res.json(drawing);
                })
                .catch((error:Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/tag/:tag', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawingByTags(req.params.tag)
                .then((drawing:Drawing[]) => {
                    res.json(drawing);
                })
                .catch((error:Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .addDrawing(req.body)
                .then(() => {
                    res.status(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch("/:drawingId", async (req: Request, res: Response, next: NextFunction)=>{
            this.databaseService.updateDrawing(req.params.drawingId, req.body)
                .then((drawing:Drawing)=>{
                    res.json(drawing);
                })
                .catch((error:Error)=> {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/:drawingId', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.drawingId)
                .then(() => {
                    res.status(Httpstatus.NO_CONTENT).send();
                })
                .catch((error:Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
