import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { TextureEnum } from '@app/services/tool-modifier/texture/texture.service'
import { BrushService } from './brush-service';
import { TestBed } from '@angular/core/testing';

// tslint:disable:no-any
describe('BrushService', () => {
    let service: BrushService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // let texture: TextureEnum;
    // let width: number;
    // let color: string;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let shadowTextureSpy: jasmine.Spy<any>;
    let gradientTextureSpy: jasmine.Spy<any>;
    let squareTextureSpy: jasmine.Spy<any>;
    let dashTextureSpy: jasmine.Spy<any>;
    let zigzagTextureSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(BrushService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        shadowTextureSpy = spyOn<any>(service, 'shadowTexture').and.callThrough();
        gradientTextureSpy = spyOn<any>(service, 'gradientTexture').and.callThrough();
        squareTextureSpy = spyOn<any>(service, 'squareTexture').and.callThrough();
        dashTextureSpy = spyOn<any>(service, 'dashTexture').and.callThrough();
        zigzagTextureSpy = spyOn<any>(service, 'zigzagTexture').and.callThrough();
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' should call shadowTexture if it is the selected texture', () => {
        // texture = TextureEnum.shadowTexture;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        // service.onTextureChange(texture);
        service.onMouseUp(mouseEvent);
        expect(shadowTextureSpy).toHaveBeenCalled();
    });

    it(' should call gradientTexture if it is the selected texture', () => {
        // texture = TextureEnum.gradientTexture;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        // service.onTextureChange(texture);
        service.onMouseUp(mouseEvent);
        expect(gradientTextureSpy).toHaveBeenCalled();
    });

    it(' should call squareTexture if it is the selected texture', () => {
        // texture = TextureEnum.squareTexture;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        // service.onTextureChange(texture);
        service.onMouseUp(mouseEvent);
        expect(squareTextureSpy).toHaveBeenCalled();
    });

    it(' should call dashTexture if it is the selected texture', () => {
        // texture = TextureEnum.dashTexture;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        // service.onTextureChange(texture);
        service.onMouseUp(mouseEvent);
        expect(dashTextureSpy).toHaveBeenCalled();
    });

    it(' should call zigzagTexture if it is the selected texture', () => {
        // texture = TextureEnum.zigzagTexture;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        // service.onTextureChange(texture);
        service.onMouseUp(mouseEvent);
        expect(zigzagTextureSpy).toHaveBeenCalled();
    });

    it('should change width', () => {
        // width = 5;
        // service.onWidthChange(width);
        // expect(service.getLineWidth).toBe(5);
    });

    it('should change color', () => {
        // color = '#0000AA';
        // service.onColorChange(color);
        // expect(service.getColor).toBe(color);
    });

    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });
});
