import { Image } from '@common/communication/image';
import { injectable } from 'inversify';
import { createCanvas } from 'node_modules/canvas';
//import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class IndexService {
    clientMessages: Image[];
    /*constructor(@inject(TYPES.DateService) private dateService: DateService) {
        this.clientMessages = [];
    }
    */

    constructor() {
        this.clientMessages = [];
    }

    /*about(): Message {
        return {
            title: 'Basic Server About Page',
            body: 'Try calling helloWorld to get the time',
        };
    }
    */

    /*async helloWorld(): Promise<Message> {
        return this.dateService
            .currentTime()
            .then((timeMessage: Message) => {
                return {
                    title: 'Hello world',
                    body: 'Time is ' + timeMessage.body,
                };
            })
            .catch((error: unknown) => {
                console.error('There was an error!!!', error);

                return {
                    title: 'Error',
                    body: error as string,
                };
            });
    }
    */

    storeMessage(drawing: Image): void {
        console.log(drawing.name);
        console.log(drawing.image.width);
        console.log('Bienrecu');
        this.clientMessages.push(drawing);
        this.saveImageToDrawings(drawing);
    }

    saveImageToDrawings(drawing: Image): void {
        //const name = drawing.name;
        const imageData: ImageData = drawing.image;
        const fs = require('fs');
        const width = 600;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.putImageData(imageData, 0, 0);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(__dirname + '/../../drawings/image', buffer);
        console.log(__dirname);
    }
}
