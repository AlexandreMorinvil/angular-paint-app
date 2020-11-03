import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
import { LoadService } from '@app/services/load/load.service';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service';
import { Tag, TagFilterService } from '@app/services/tag-filter/tag-filter.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';
import { DrawingCarouselComponent } from './modal-drawing-carousel.component';

describe('DrawingCarouselComponent', () => {
    let component: DrawingCarouselComponent;
    let fixture: ComponentFixture<DrawingCarouselComponent>;
    let memoryServiceSpy: jasmine.SpyObj<RemoteMemoryService>;
    let tagFilterServiceSpy: jasmine.SpyObj<TagFilterService>;
    let loadServiceSpy: jasmine.SpyObj<LoadService>;
    let data: DialogData;
    let testData: DrawingToDatabase[];
    let tagAdded: MatChipInputEvent;

    beforeEach(async(() => {
        testData = [
            { _id: '1', name: 'test1', tags: [] },
            { _id: '2', name: 'test2', tags: ['tag'] },
        ];
        memoryServiceSpy = jasmine.createSpyObj('RemoteMemoryService', {
            getAllFromDatabase: Promise.resolve(),
            getDrawingsFromDatabase: testData,
        });
        tagFilterServiceSpy = jasmine.createSpyObj('TagFilterService', {
            getActiveTags: [],
            filterByTag: testData,
            addTag: {},
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
    }));

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
        let newTag: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('input');
        newTag.value = 'tag';
        tagAdded = { input: newTag, value: 'tag' };
        component.addTag(tagAdded);
        expect(tagFilterServiceSpy.addTag).toHaveBeenCalled();
    });

    it('should remove tag', () => {
        let tagToRemove: Tag = { tagName: 'test' };
        component.removeTag(tagToRemove);
        expect(tagFilterServiceSpy.removeTag).toHaveBeenCalled();
    });
});
