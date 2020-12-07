import { DrawingToEmail } from '@common/communication/drawing-to-email';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { request } from 'http';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    processRequest(requestBody: DrawingToEmail): Promise<number> {
        const dotenv = require('dotenv');
        dotenv.config();
        const EMAIL = requestBody.emailAdress;
        const DATA = requestBody.imageSrc.split(';base64,');
        const BASE_64_IMAGE = DATA.pop();
        const EXT = requestBody.format;

        fs.writeFileSync('temp.' + EXT, BASE_64_IMAGE, { encoding: 'base64' });
        return this.sendEmail(EMAIL, EXT);
    }

    sendEmail(email: string, ext: string): Promise<number> {
        const FROM = new FormData();
        FROM.append('to', email);
        const FILE = fs.createReadStream('temp.' + ext);
        FROM.append('payload', FILE);
        const req = request({
            host: 'log2990.step.polymtl.ca',
            method: 'POST',
            path: '/email',
            headers: {
                'content-type': 'multipart/form-data; boundary=' + FROM.getBoundary(),
                'X-Team-Key': process.env.API_KEY,
            },
        });

        FROM.pipe(req);

        let code: number;
        return new Promise<number>((resolve) => {
            req.on('response', (res) => {
                code = res.statusCode as number;
                resolve(code);
            });
        });
    }
}
