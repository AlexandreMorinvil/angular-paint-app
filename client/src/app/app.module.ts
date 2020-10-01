import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
// Attribute components
import { AttributeColorComponent } from './components/attributes-panel/attribute-color/attributes-color.component';
import { AttributeJunctionComponent } from './components/attributes-panel/attribute-junction/attributes-junction.component';
import { AttributeTextureComponent } from './components/attributes-panel/attribute-texture/attributes-texture.component';
import { AttributeTracingComponent } from './components/attributes-panel/attribute-tracing/attributes-tracing.component';
import { AttributeWidthComponent } from './components/attributes-panel/attribute-width/attributes-width.component';
import { AttributesPanelComponent } from './components/attributes-panel/attributes-panel.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorPageComponent } from './components/editor-page/editor-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { UserGuideModalComponent } from './components/user-guide-modal/user-guide-modal.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';

@NgModule({
    declarations: [
        AppComponent,
        AttributesPanelComponent,
        AttributeJunctionComponent,
        AttributeTextureComponent,
        AttributeTracingComponent,
        AttributeWidthComponent,
        AttributeColorComponent,
        EditorPageComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        TooltipComponent,
        WorkspaceComponent,
        UserGuideModalComponent,
    ],

    exports: [],

    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        MatTabsModule,
    ],
    entryComponents: [],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
