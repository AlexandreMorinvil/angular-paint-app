import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeNumberSprayTransmissionComponent } from './attribute-number-spray-transmission.component';

describe('AttributeNumberSprayTransmissionComponent', () => {
  let component: AttributeNumberSprayTransmissionComponent;
  let fixture: ComponentFixture<AttributeNumberSprayTransmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeNumberSprayTransmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeNumberSprayTransmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
