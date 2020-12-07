import * as fs from 'fs';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { testingContainer } from '../../../test/test-utils';
import { DrawingToEmail } from '../../controllers/database/email/email.controller.spec';
import { TYPES } from '../../types';
import { EmailService } from './email.service';

describe('Email Service', () => {
    let emailService: EmailService;
    let sandbox: any;
    let server: any;

    beforeEach(async () => {
        const [container] = await testingContainer();
        emailService = container.get(TYPES.EmailService);
        sandbox = sinon.createSandbox();
        server = sandbox.useFakeServer();
    });

    afterEach(async () => {
        server.restore();
        sandbox.restore();
        sinon.restore();
    });

    it('Process request should call writeFileSync', () => {
        const DRAWING_TO_EMAIL = new DrawingToEmail('a@hotmail.com', 'alex', 'png', 'IMAGESOURCE');
        const SPY_ON_WRITE_FILE = sinon.spy(fs, 'writeFileSync');
        emailService.processRequest(DRAWING_TO_EMAIL);
        sinon.assert.called(SPY_ON_WRITE_FILE);
    });
});
