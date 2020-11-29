import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import * as tests from 'supertest';
import { Stubbed, testingContainer } from '../../../../test/test-utils';
import { Application } from '../../../app';
import { EmailService } from '../../../services/email/email.service';
import { TYPES } from '../../../types';

describe('EmailController', () => {
    const ROUTING_EMAIL: string = '/api/email';
    const HTTPS_STATUS_BAD_REQUEST = StatusCodes.BAD_REQUEST;

    let application: Express.Application;
    let emailService: Stubbed<EmailService>;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.EmailService).toConstantValue({
            sendEmail: sandbox.stub(),
        });
        application = container.get<Application>(TYPES.Application).app;
        emailService = container.get(TYPES.EmailService);
    });

    it('should return an error of bad request if send email is failed', async () => {
        emailService.sendEmail.rejects(new Error('Failed sending email'));
        return tests(application)
            .post(ROUTING_EMAIL)
            .expect(HTTPS_STATUS_BAD_REQUEST)
            .then((res: any) => {
                expect(res.status).to.equal(HTTPS_STATUS_BAD_REQUEST);
            });
    });
});
