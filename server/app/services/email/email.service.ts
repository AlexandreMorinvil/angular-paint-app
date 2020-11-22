import { DrawingToEmail } from '@common/communication/drawing-to-email';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    async sendEmail(drawing: DrawingToEmail): Promise<void> {
        // a continuer
    }
}
