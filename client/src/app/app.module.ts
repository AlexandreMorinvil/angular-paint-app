import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AttributesPanelComponent } from './components/attributes-panel/attributes-panel.component';
import { CreateNewDrawingDialogComponent } from './components/create-new-drawing-dialog/create-new-drawing-dialog.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorPageComponent } from './components/editor-page/editor-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateNewDrawingDialogService } from './services/create-new-drawing-dialog/create-new-drawing-dialog.service';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';

// Attribute components
import { AttributeTracingComponent } from './components/attributes-panel/attribute-tracing/attributes-tracing.component';
import { AttributeWidthComponent } from './components/attributes-panel/attribute-width/attributes-width.component';
import { AttributeTextureComponent } from './components/attributes-panel/attribute-texture/attributes-texture.component';

@NgModule({
    declarations: [
        AppComponent,
        AttributesPanelComponent,
        EditorPageComponent, 
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        TooltipComponent,
        WorkspaceComponent,
        CreateNewDrawingDialogComponent,
        AttributeTracingComponent,
        AttributeWidthComponent,
        AttributeTextureComponent
    ],
    
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
    ],
    entryComponents: [CreateNewDrawingDialogComponent],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }, CreateNewDrawingDialogService],
    bootstrap: [AppComponent],
})
export class AppModule { }
