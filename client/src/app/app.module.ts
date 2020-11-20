import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AttributeColorPickerViewerComponent } from './components/attributes-panel/attribute-color-picker-viewer/attribute-color-picker-viewer.component';
// Attribute components
import { AttributeColorComponent } from './components/attributes-panel/attribute-color/attributes-color.component';
import { AttributeGridDisplayComponent } from './components/attributes-panel/attribute-grid-display/attribute-grid-display.component';
import { AttributeGridOpacityComponent } from './components/attributes-panel/attribute-grid-opacity/attributes-grid-opacity.component';
import { AttributeJunctionComponent } from './components/attributes-panel/attribute-junction/attributes-junction.component';
import { AttributeNumberSprayTransmissionComponent } from './components/attributes-panel/attribute-number-spray-transmission/attribute-number-spray-transmission.component';
import { AttributeSelectionComponent } from './components/attributes-panel/attribute-selection/attribute-selection.component';
import { AttributeSpacingComponent } from './components/attributes-panel/attribute-spacing/attributes-spacing.component';
import { AttributeSprayDiameterComponent } from './components/attributes-panel/attribute-spray-diameter/attribute-spray-diameter.component';
import { AttributeSprayDropletDiameterComponent } from './components/attributes-panel/attribute-spray-droplet-diameter/attribute-spray-droplet-diameter.component';
import { AttributeStampPickerComponent } from './components/attributes-panel/attribute-stamp-picker/attributes-stamp-picker.component';
import { AttributeTextureComponent } from './components/attributes-panel/attribute-texture/attributes-texture.component';
import { AttributeTracingComponent } from './components/attributes-panel/attribute-tracing/attributes-tracing.component';
import { AttributeWidthComponent } from './components/attributes-panel/attribute-width/attributes-width.component';
import { AttributesPanelComponent } from './components/attributes-panel/attributes-panel.component';
import { AttributesSidesComponent } from './components/attributes-panel/attributes-sides/attributes-sides.component';
import { AttributesToleranceComponent } from './components/attributes-panel/attributes-tolerance/attributes-tolerance.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorPageComponent } from './components/editor-page/editor-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ContinueDrawingModalComponent } from './components/modal/modal-continue-drawing/modal-continue-drawing.component';
import { DrawingCarouselComponent } from './components/modal/modal-drawing-carousel/modal-drawing-carousel.component';
import { ExportComponent } from './components/modal/modal-export/modal-export.component';
import { ModalSaveComponent } from './components/modal/modal-save/modal-save.component';
import { UserGuideModalComponent } from './components/modal/modal-user-guide/modal-user-guide.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
@NgModule({
    declarations: [
        AppComponent,
        AttributesPanelComponent,
        AttributeSpacingComponent,
        AttributeGridDisplayComponent,
        AttributeGridOpacityComponent,
        AttributeJunctionComponent,
        AttributeTextureComponent,
        AttributeTracingComponent,
        AttributeWidthComponent,
        AttributeColorComponent,
        EditorPageComponent,
        ExportComponent,
        SidebarComponent,
        DrawingComponent,
        DrawingCarouselComponent,
        MainPageComponent,
        TooltipComponent,
        WorkspaceComponent,
        UserGuideModalComponent,
        AttributesSidesComponent,
        ModalSaveComponent,
        AttributeColorPickerViewerComponent,
        AttributesToleranceComponent,
        AttributeSelectionComponent,
        ContinueDrawingModalComponent,
        AttributeSprayDiameterComponent,
        AttributeSprayDropletDiameterComponent,
        AttributeNumberSprayTransmissionComponent,
        AttributeStampPickerComponent,
    ],

    exports: [MatChipsModule],

    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatDialogModule,
        MatChipsModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatTabsModule,
    ],
    entryComponents: [ModalSaveComponent, ExportComponent],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }],
    bootstrap: [AppComponent],
})
export class AppModule {}
