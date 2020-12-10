import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    private storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    clearAutoSaveDrawing(): void {
        this.storage.removeItem('drawing');
    }

    hasSavedDrawing(): boolean {
        if (this.storage.getItem('drawing')) {
            return true;
        }
        return false;
    }

    autoSave(canvasDataURL: string): void {
        this.storage.setItem('drawing', canvasDataURL);
    }

    getAutoSavedDrawingURL(): string {
        return this.storage.getItem('drawing') as string;
    }
}
