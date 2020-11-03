import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
import { LoadService } from '@app/services/load/load.service';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service';
import { TagFilterService } from '@app/services/tag-filter/tag-filter.service';
import { DrawingCarouselComponent } from './modal-drawing-carousel.component';

describe('DrawingCarouselComponent', () => {
  let component: DrawingCarouselComponent;
  let fixture: ComponentFixture<DrawingCarouselComponent>;
  let memoryServiceSpy: jasmine.SpyObj<RemoteMemoryService>;
  let tagFilterServiceSpy: jasmine.SpyObj<TagFilterService>;
  let loadServiceSpy: jasmine.SpyObj<LoadService>;
  let data: DialogData;


  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [DrawingCarouselComponent],
      providers: [
        { provide: RemoteMemoryService, useValue: memoryServiceSpy },
        { provide: TagFilterService, useValue: tagFilterServiceSpy },
        { provide: LoadService, useValue: loadServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' should ', () => {
    component
    expect(component).toBeTruthy();
  });
});
