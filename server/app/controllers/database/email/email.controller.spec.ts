import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as tests from 'supertest';
import { Stubbed, testingContainer } from '../../../../test/test-utils';
import { Application } from '../../../app';
import { EmailService } from '../../../services/email/email.service';
import { TYPES } from '../../../types';

export class DrawingToEmail {
    emailAdress: string;
    drawingName: string;
    format: string;
    imageSrc: string;

    constructor(emailAdress: string, drawingName: string, format: string, imageSrc: string) {
        this.emailAdress = emailAdress;
        this.drawingName = drawingName;
        this.format = format;
        this.imageSrc = imageSrc;
    }
}

describe('EmailController', () => {
    const ROUTING_EMAIL: string = '/api/email';
    const HTTPS_STATUS_BAD_REQUEST = StatusCodes.BAD_REQUEST;
    const HTTPS_STATUS_CODE_OK = StatusCodes.OK;

    let application: Express.Application;
    let emailService: Stubbed<EmailService>;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.EmailService).toConstantValue({
            processRequest: sandbox.stub(),
        });
        application = container.get<Application>(TYPES.Application).app;
        emailService = container.get(TYPES.EmailService);
    });

    it('should return  status code ok  when sending email succes', async () => {
        const DRAWING_TO_EMAIL = new DrawingToEmail('a@hotmail.com', 'alex', 'png', 'IMAGESOURCE');
        emailService.processRequest.resolves();
        return tests(application)
            .post(ROUTING_EMAIL)
            .send(DRAWING_TO_EMAIL)
            .then((res: any) => {
                expect(res.status).to.equal(HTTPS_STATUS_CODE_OK);
            });
    });

    it('should return an error of bad request if send email is failed', async () => {
        emailService.processRequest.rejects(new Error('Failed sending email'));
        return tests(application)
            .post(ROUTING_EMAIL)
            .expect(HTTPS_STATUS_BAD_REQUEST)
            .then((res: any) => {
                expect(res.status).to.equal(HTTPS_STATUS_BAD_REQUEST);
            });
    });
});
