import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadService } from '@app/services/load/load.service';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service';
import { Tag, TagFilterService } from '@app/services/tag-filter/tag-filter.service';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { DrawingCarouselComponent } from './modal-drawing-carousel.component';
// tslint:disable:prefer-const
describe('DrawingCarouselComponent', () => {
    let component: DrawingCarouselComponent;
    let fixture: ComponentFixture<DrawingCarouselComponent>;
    let memoryServiceSpy: jasmine.SpyObj<RemoteMemoryService>;
    let tagFilterServiceSpy: jasmine.SpyObj<TagFilterService>;
    let loadServiceSpy: jasmine.SpyObj<LoadService>;
    let data: MatDialog;
    let testData: DrawingToDatabase[];
    let testData2: DrawingToDatabase[];
    let tagAdded: MatChipInputEvent;

    testData = [
        { _id: '0', name: 'test1', tags: [] },
        { _id: '1', name: 'test2', tags: ['tag'] },
    ];
    testData2 = [
        { _id: '0', name: 'test1', tags: [] },
        { _id: '1', name: 'test2', tags: ['tag'] },
        { _id: '2', name: 'test3', tags: ['tag', 'gat'] },
    ];

    beforeEach(
        waitForAsync(() => {
            memoryServiceSpy = jasmine.createSpyObj('RemoteMemoryService', {
                getAllFromDatabase: Promise.resolve(),
                getDrawingsFromDatabase: testData,
                deleteFromDatabase: Promise.resolve(),
            });
            tagFilterServiceSpy = jasmine.createSpyObj('TagFilterService', {
                getActiveTags: [],
                filterByTag: testData,
                addTag: {},
                removeTag: {},
                clearTags: {},
            });
            loadServiceSpy = jasmine.createSpyObj('LoadService', {
                loadDraw: {},
            });
            TestBed.configureTestingModule({
                declarations: [DrawingCarouselComponent],
                providers: [
                    { provide: RemoteMemoryService, useValue: memoryServiceSpy },
                    { provide: TagFilterService, useValue: tagFilterServiceSpy },
                    { provide: LoadService, useValue: loadServiceSpy },
                    { provide: MAT_DIALOG_DATA, useValue: data },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return the nothing image given a value with no name', () => {
        expect(component.getDrawingUrl(new DrawingToDatabase())).toBe(component.NOTHING_IMAGE_LOCATION);
    });

    it('should add tag', () => {
        const newTag: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('input');
        newTag.value = 'tag';
        tagAdded = { input: newTag, value: 'tag' };
        component.addTag(tagAdded);
        expect(tagFilterServiceSpy.addTag).toHaveBeenCalled();
    });

    it('should not add tag if the value is empty', () => {
        const newTag: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('input');
        newTag.value = 'tag';
        tagAdded = { input: newTag, value: '' };
        component.addTag(tagAdded);
        expect(tagFilterServiceSpy.addTag).not.toHaveBeenCalled();
    });

    it('should remove tag', () => {
        const tagToRemove: Tag = { tagName: 'test' };
        component.removeTag(tagToRemove);
        expect(tagFilterServiceSpy.removeTag).toHaveBeenCalled();
    });

    it('should prevent defaut key on Ctrl+G pressed', () => {
        const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'g' });
        const spy = spyOn(event, 'preventDefault');
        component.onKeyDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should not prevent defaut key on other key  pressed', () => {
        const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 's' });
        const spy = spyOn(event, 'preventDefault');
        component.onKeyDown(event);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should change currentDrawings when pressing the previous button ', () => {
        tagFilterServiceSpy.filterByTag.and.returnValue(testData2);
        component.setCurrentDrawings();
        const drawings: DrawingToDatabase[] = testData2;
        component.movePrevious();
        expect(drawings[1]).toBe(component.getCurrentDrawings()[2]);
    });

    it('should change currentDrawings when pressing the previous button with the keyboard', () => {
        tagFilterServiceSpy.filterByTag.and.returnValue(testData2);
        component.setCurrentDrawings();
        const drawings: DrawingToDatabase[] = testData2;
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
        });
        component.onKeyDown(event);
        expect(drawings[1]).toBe(component.getCurrentDrawings()[2]);
    });

    it('should not change currentDrawings when pressing the next button if theres an empty drawing space', () => {
        component.setCurrentDrawings();
        const currentDrawings: DrawingToDatabase[] = testData;
        component.moveNext();
        expect(currentDrawings[0]).toBe(component.getCurrentDrawings()[0]);
    });

    it('should change currentDrawings when pressing the next button ', () => {
        tagFilterServiceSpy.filterByTag.and.returnValue(testData2);
        component.setCurrentDrawings();
        const drawings: DrawingToDatabase[] = testData2;
        component.moveNext();
        expect(drawings[1]).toBe(component.getCurrentDrawings()[0]);
    });

    it('should change currentDrawings when pressing the next button with the keyboard', () => {
        tagFilterServiceSpy.filterByTag.and.returnValue(testData2);
        component.setCurrentDrawings();
        const drawings: DrawingToDatabase[] = testData2;
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
        });
        component.onKeyDown(event);
        expect(drawings[1]).toBe(component.getCurrentDrawings()[0]);
    });

    it('should call to delete drawing if it was clicked on it and the delete button was pressed', () => {
        component.setCurrentDrawings();
        component.deleteDrawingButtonSelected();
        component.drawingClicked(testData[1]);
        expect(memoryServiceSpy.deleteFromDatabase).toHaveBeenCalled();
    });

    it('should load drawing if it was clicked on it', () => {
        component.setCurrentDrawings();
        component.drawingClicked(testData[1]);
        expect(loadServiceSpy.loadDraw).toHaveBeenCalled();
    });

    it('should load drawing if it was clicked on it after the delete button was pressed twice', () => {
        component.setCurrentDrawings();
        component.deleteDrawingButtonSelected();
        component.deleteDrawingButtonSelected();
        component.drawingClicked(testData[0]);
        expect(loadServiceSpy.loadDraw).toHaveBeenCalled();
    });

    it('should not change currentDrawings when pressing the wrong button with the keyboard', () => {
        tagFilterServiceSpy.filterByTag.and.returnValue(testData2);
        component.setCurrentDrawings();
        const drawings: DrawingToDatabase[] = testData2;
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowUp',
        });
        component.onKeyDown(event);
        expect(drawings[1]).toBe(component.getCurrentDrawings()[1]);
    });
});
