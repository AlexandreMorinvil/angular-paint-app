import * as FormData from 'form-data';
import * as fs from 'fs';
import { request } from 'http';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    async sendEmail(email: string, ext: string): Promise<number> {
        const form = new FormData();
        form.append('to', email);
        const file = fs.createReadStream('temp.' + ext);
        form.append('payload', file);
        const req = request(
            {
                host: 'log2990.step.polymtl.ca',
                method: 'POST',
                path: '/email',
                headers: {
                    'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
                    'X-Team-Key': '1e2ccc05-3dc7-4da8-8faf-5a2f7b703153',
                },
            },
            (res) => {
                let content = '';
                res.on('data', (chunk) => {
                    content += chunk;
                });

                res.on('end', () => {
                    console.log(content);
                });
            },
        );

        form.pipe(req);

        let code: number;
        return new Promise<number>((resolve) => {
            req.on('response', (res) => {
                code = res.statusCode as number;
                resolve(code);
            });
        });
    }
}
