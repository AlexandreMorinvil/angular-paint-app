import { EmailService } from '@app/services/email/email.service';
import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class EmailController {
    router: Router;
    private readonly ROUTING_POST: string = '/';

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();

        this.router.post(this.ROUTING_POST, async (req: Request, res: Response, next: NextFunction) => {
            this.emailService
                .sendEmail(req.body)
                .then(() => {})
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
