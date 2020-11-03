import { Injectable } from '@angular/core';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';

@Injectable({
    providedIn: 'root',
})
export class RemoteMemoryService {
    private drawingsFromDatabase: DrawingToDatabase[];

    constructor(private apiDrawingService: ApiDrawingService) {}

    getDrawingsFromDatabase(): DrawingToDatabase[] {
        return this.drawingsFromDatabase;
    }

    async getAllFromDatabase(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.apiDrawingService.getAll().subscribe((drawingsFetched: DrawingToDatabase[]) => {
                    this.drawingsFromDatabase = drawingsFetched;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    saveToDatabase(drawing: DrawingToDatabase): void {
        this.apiDrawingService.save(drawing).subscribe();
    }

    async deleteFromDatabase(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.apiDrawingService.delete(id).subscribe(() => {
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
