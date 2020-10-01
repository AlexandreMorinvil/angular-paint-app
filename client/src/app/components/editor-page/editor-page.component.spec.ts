import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { EditorPageComponent } from './editor-page.component';

describe('EditorPageComponent', () => {
    let component: EditorPageComponent;
    let fixture: ComponentFixture<EditorPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorPageComponent, DrawingComponent, SidebarComponent],
            providers: [{ provide: Router }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
