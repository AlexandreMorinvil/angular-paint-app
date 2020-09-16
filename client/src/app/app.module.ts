import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { CreateNewDrawingDialogComponent } from './components/create-new-drawing-dialog/create-new-drawing-dialog.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateNewDrawingDialogService } from './services/create-new-drawing-dialog/create-new-drawing-dialog.service';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainPageComponent],
    imports: [BrowserAnimationsModule, BrowserModule, HttpClientModule, AppRoutingModule, MatDialogModule, MatFormFieldModule, FormsModule],
    entryComponents: [CreateNewDrawingDialogComponent],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }, CreateNewDrawingDialogService],
    bootstrap: [AppComponent],
})
export class AppModule { }
