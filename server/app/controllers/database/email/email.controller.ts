import { EmailService } from '@app/services/email/email.service';
import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';

@injectable()
export class EmailController {
    router: Router;
    private readonly ROUTING_POST: string = '/';

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post(this.ROUTING_POST, async (req: Request, res: Response, next: NextFunction) => {
            const email = req.body.emailAdress;
            const data = req.body.imageSrc.split(';base64,');
            const base64Image = data.pop();
            const ext = data[0].split('/').pop();

            fs.writeFile('temp.' + ext, base64Image, { encoding: 'base64' }, async () => {
                console.log('File created');
                const code = await this.emailService.sendEmail(email, ext);
                res.status(code).send({ returnCode: code });
            });

            return;
        });
    }
}
