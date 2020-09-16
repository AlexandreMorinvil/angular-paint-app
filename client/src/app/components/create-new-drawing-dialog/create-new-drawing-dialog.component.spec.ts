import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDrawingDialogComponent } from './create-new-drawing-dialog.component';

describe('CreateNewDrawingDialogComponent', () => {
  let component: CreateNewDrawingDialogComponent;
  let fixture: ComponentFixture<CreateNewDrawingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewDrawingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
