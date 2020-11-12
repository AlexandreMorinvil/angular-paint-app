import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeSprayDiameterComponent } from './attribute-spray-diameter.component';

describe('AttributeSprayDiameterComponent', () => {
  let component: AttributeSprayDiameterComponent;
  let fixture: ComponentFixture<AttributeSprayDiameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeSprayDiameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeSprayDiameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
