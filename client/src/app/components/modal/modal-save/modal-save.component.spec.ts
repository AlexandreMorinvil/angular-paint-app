import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ApiImageTransferService } from '@app/services/api/image-transfer/api-image-transfer.service';
import { SaveService } from '@app/services/save/save.service';
import { ModalSaveComponent } from './modal-save.component';

class HTMLInputElement {
    input: string;
}

describe('ModalSaveComponent', () => {
    let component: ModalSaveComponent;
    let fixture: ComponentFixture<ModalSaveComponent>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // tslint:disable:no-any
    let basicPostSpy: jasmine.Spy<any>;
    let sendMessageToServerSpy: jasmine.Spy<any>;
    let saveDrawSpy: jasmine.Spy<any>;
    let pushSpy: jasmine.Spy<any>;
    let spliceSpy: jasmine.Spy<any>;
    const dialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalSaveComponent, any>> = jasmine.createSpyObj('MatDialogRef', ['close']);

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ModalSaveComponent],
                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: dialogRefSpy },
                    { provide: MatDialog, useValue: {} },
                    { provide: Router, useValue: {} },
                    { provide: MatTabsModule, useValue: {} },
                    SaveService,
                    HttpClientTestingModule,
                    HttpClient,
                    HttpTestingController,
                    HttpHandler,
                    ApiImageTransferService,
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        fixture = TestBed.createComponent(ModalSaveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // tslint:disable:no-string-literal
        component['saveService']['drawingService'].baseCtx = baseCtxStub;
        component['saveService']['drawingService'].previewCtx = previewCtxStub;
        component['saveService']['drawingService'].canvas = canvasStub;
        // tslint:disable:no-magic-numbers
        component['saveService']['drawingService'].canvas.width = 1000;
        component['saveService']['drawingService'].canvas.height = 800;

        spliceSpy = spyOn(component.tags, 'splice').and.callThrough();
        pushSpy = spyOn(component.tags, 'push').and.callThrough();
        saveDrawSpy = spyOn<any>(component['saveService'], 'saveDraw').and.callThrough();
        sendMessageToServerSpy = spyOn<any>(component, 'sendMessageToServer').and.callThrough();
        component['saveService'].imageSource = 'IMAGESOURCE';
        basicPostSpy = spyOn<any>(component['apiImageTransferService'], 'basicPost').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('validate all tags should return true if all tags are valid', () => {
        const tags: string[] = ['a', 'b', 'c'];
        expect((component as any).validateAllTags(tags)).toBeTruthy();
    });

    it('validate all tags should return false if the number og tags is bigger than max', () => {
        const tags: string[] = ['al', 'bl', 'cl', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'z', 'w'];
        expect((component as any).validateAllTags(tags)).toBeFalse();
    });

    it('validate image source should return true if image source is valid', () => {
        const imageSource = 'KEJDHTERTGSU';
        expect((component as any).validateImageSRC(imageSource)).toBeTruthy();
    });

    it('validate image source should return false if image source is invalid', () => {
        const imageSource = '';
        expect((component as any).validateImageSRC(imageSource)).toBeFalse();
    });

    it('validate  a tag should return true if the tag is valid', () => {
        const tag = 'valid';
        expect((component as any).validateTag(tag)).toBeTruthy();
    });

    it('validate  a tag should return false if the tag is empty', () => {
        const tag = '';
        expect((component as any).validateTag(tag)).toBeFalse();
    });

    it('validate  a tag should return false if the tag lenght is bigger than max ', () => {
        const tag = 'alsoergdhtryejdklstegreddhud';
        expect((component as any).validateTag(tag)).toBeFalse();
    });

    it('validate  a tag should return false if the tag has special character', () => {
        const tag = '!@^ahs';
        expect((component as any).validateTag(tag)).toBeFalse();
    });

    it('validate  a name should return true if the name is valid', () => {
        const name = 'valid';
        expect((component as any).validateDrawName(name)).toBeTruthy();
    });

    it('validate  a name should return false if the name is empty', () => {
        const name = '';
        expect((component as any).validateDrawName(name)).toBeFalse();
    });

    it('validate  a tag should return false if the tag lenght is bigger than max', () => {
        const name = 'alsoergdhtryejdklstegreddhudalsoergdhtryejdklstegreddhudamskedjrh';
        expect((component as any).validateDrawName(name)).toBeFalse();
    });

    it('validate  a name should return false if the name has special character', () => {
        const name = 'a!!@^name';
        expect((component as any).validateDrawName(name)).toBeFalse();
    });

    it('validate value should return true if the name, tags and image source is valid', () => {
        const name = 'dessin';
        const imageSource = 'KEJDHTERTGSU';
        const tags: string[] = ['tag2', 'b', 'c'];
        expect((component as any).validateValue(name, tags, imageSource)).toBeTruthy();
    });

    it('validate value should return false if the name is invalid', () => {
        const name = '';
        const imageSource = 'KEJDHTERTGSU';
        const tags: string[] = ['$$$$', 'b', 'c'];
        expect((component as any).validateValue(name, tags, imageSource)).toBeFalse();
    });

    it('validate value should return false if the tags is invalid', () => {
        const name = 'valid';
        const imageSource = 'KEJDHTERTGSU';
        const tags: string[] = ['@a1!', '!!ml'];
        expect((component as any).validateValue(name, tags, imageSource)).toBeFalse();
    });

    it('validate value should return false if the image source is invalid', () => {
        const name = 'valid';
        const imageSource = '';
        const tags: string[] = ['a', 'b', 'c'];
        expect((component as any).validateValue(name, tags, imageSource)).toBeFalse();
    });

    it('add should call tags.push if the value is not empty ', () => {
        const event = new HTMLInputElement();
        event.input = 'inp';
        const eventInput: any = { input: event, value: 'val' };
        (component as any).tags = ['a', 'b'];
        component.add(eventInput);
        expect(pushSpy).toHaveBeenCalled();
    });

    it('add should not call tags.push if the input is empty ', () => {
        const event = new HTMLInputElement();
        event.input = 'input';
        const eventInput: any = { input: event, value: '' };
        (component as any).tags = ['a', 'b'];
        component.add(eventInput);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('remove tag should  call tags.splice if the tag and index are valid', () => {
        (component as any).tags = ['a', 'b'];
        component.remove(component.tags[1]);
        expect(spliceSpy).toHaveBeenCalled();
    });

    it('remove tag should  call tags.splice if the tag and index are invalid', () => {
        (component as any).tags = ['a', 'b'];
        const tag = 'd';
        component.remove(tag);
        expect(spliceSpy).not.toHaveBeenCalled();
    });

    it('send message to server should call basic post', () => {
        (component as any).drawName.value = 'name';
        (component as any).tags = ['tag1', 'tag2'];
        component.saveService.saveDraw();
        component.sendMessageToServer();
        expect(basicPostSpy).toHaveBeenCalled();
    });

    it('should save message to server when validate value is true', () => {
        (component as any).drawName.value = 'name';
        (component as any).tags = ['tag1', 'tag2'];
        component.saveService.saveDraw();
        component.saveToServer();
        expect(saveDrawSpy).toHaveBeenCalled();
        expect(sendMessageToServerSpy).toHaveBeenCalled();
    });

    it('should not save message to server when validate value is false', () => {
        (component as any).drawName.value = '';
        (component as any).tags = ['tag1', 'tag2'];
        component.saveToServer();
        expect(saveDrawSpy).not.toHaveBeenCalled();
        expect(sendMessageToServerSpy).not.toHaveBeenCalled();
    });
});
