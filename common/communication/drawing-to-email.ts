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
