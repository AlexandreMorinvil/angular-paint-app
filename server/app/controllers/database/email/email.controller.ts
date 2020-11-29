import { EmailService } from '@app/services/email/email.service';
import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class EmailController {
    router: Router;
    private readonly ROUTING_EMAIL: string = '/';

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post(this.ROUTING_EMAIL, async (req: Request, res: Response, next: NextFunction) => {
            this.emailService
                .sendEmail(req.body)
                .then()
                .catch((error: Error) => {
                    res.status(StatusCodes.BAD_REQUEST).send(error.message);
                });

            // const email = req.body.emailAdress;
            // const data = req.body.imageSrc.split(';base64,');
            // const base64Image = data.pop();
            // const ext = data[0].split('/').pop();

            // fs.writeFile('temp.' + ext, base64Image, { encoding: 'base64' }, async () => {
            //     console.log('File created');
            //     const code = await this.emailService.sendEmail(email, ext);
            //     res.status(code).send({ returnCode: code });
            // });

            // return;
        });
    }
}
