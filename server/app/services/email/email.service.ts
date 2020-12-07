import { DrawingToEmail } from '@common/communication/drawing-to-email';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { request } from 'http';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    async processRequest(requestBody: DrawingToEmail): Promise<number> {
        const EMAIL = requestBody.emailAdress;
        const DATA = requestBody.imageSrc.split(';base64,');
        const BASE_64_IMAGE = DATA.pop();
        const EXT = requestBody.format;

        fs.writeFileSync('temp.' + EXT, BASE_64_IMAGE, { encoding: 'base64' });
        return this.sendEmail(EMAIL, EXT);
    }

    async sendEmail(email: string, ext: string): Promise<number> {
        const FORM = new FormData();
        FORM.append('to', email);
        const FILE = fs.createReadStream('temp.' + ext);
        FORM.append('payload', FILE);
        const req = request({
            host: 'log2990.step.polymtl.ca',
            method: 'POST',
            path: '/email',
            headers: {
                'content-type': 'multipart/form-data; boundary=' + FORM.getBoundary(),
                'X-Team-Key': '1e2ccc05-3dc7-4da8-8faf-5a2f7b703153',
            },
        });

        FORM.pipe(req);

        let code: number;
        return new Promise<number>((resolve) => {
            req.on('response', (res) => {
                code = res.statusCode as number;
                resolve(code);
            });
        });
    }
}
