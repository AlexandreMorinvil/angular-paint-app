import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { DatabaseService } from '@app/services/database/database.service';
import { inject, injectable } from 'inversify';

import { TYPES } from '@app/types';
import { Drawing } from '@app/schema/drawing';

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
            try {
                const drawings: Drawing[] = await this.databaseService.getAllDrawings();
                res.json(drawings);
            } catch (error) {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            }
        });

        this.router.get('/:drawingId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const drawing: Drawing = await this.databaseService.getDrawing(req.params.drawingId);
                res.json(drawing);
            } catch(error) {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            }
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

        this.router.delete('/:drawingId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.databaseService.deleteDrawing(req.params.drawingId);
                res.status(Httpstatus.NO_CONTENT).send();
            } catch (error) {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            }
        });
    }
}
