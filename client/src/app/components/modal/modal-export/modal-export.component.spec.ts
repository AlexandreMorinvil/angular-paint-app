import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExportComponent } from './modal-export.component';

describe('ModalExportComponent', () => {
  let component: ModalExportComponent;
  let fixture: ComponentFixture<ModalExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
