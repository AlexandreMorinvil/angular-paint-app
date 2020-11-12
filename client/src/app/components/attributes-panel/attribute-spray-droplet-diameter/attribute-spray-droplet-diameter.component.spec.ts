import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeSprayDropletDiameterComponent } from './attribute-spray-droplet-diameter.component';

describe('AttributeSprayDropletDiameterComponent', () => {
  let component: AttributeSprayDropletDiameterComponent;
  let fixture: ComponentFixture<AttributeSprayDropletDiameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeSprayDropletDiameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeSprayDropletDiameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
