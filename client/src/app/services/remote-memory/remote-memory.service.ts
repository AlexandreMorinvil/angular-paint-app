import { Injectable } from '@angular/core';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';

@Injectable({
    providedIn: 'root',
})
export class RemoteMemoryService {
    private drawingsFromDatabase: DrawingToDatabase[];

    constructor(public apiDrawingService: ApiDrawingService) {}

    getDrawingsFromDatabase(): DrawingToDatabase[] {
        return this.drawingsFromDatabase;
    }

    async getAllFromDatabase(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.apiDrawingService.getAll().subscribe((drawingsFetched: DrawingToDatabase[]) => {
                this.drawingsFromDatabase = drawingsFetched;
                resolve();
            });
        });
    }

    async saveToDatabase(drawing: DrawingToDatabase): Promise<void> {
        return new Promise<void>((resolve) => {
            this.apiDrawingService.save(drawing).subscribe(() => {
                resolve();
            });
        });
    }

    async deleteFromDatabase(id: string): Promise<void> {
        return new Promise<void>((resolve) => {
            this.apiDrawingService.delete(id).subscribe(() => {
                resolve();
            });
        });
    }
}
