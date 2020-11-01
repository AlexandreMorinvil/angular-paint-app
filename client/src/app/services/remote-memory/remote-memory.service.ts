import { Injectable } from '@angular/core';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';

@Injectable({
    providedIn: 'root',
})
export class RemoteMemoryService {
    drawingsFromDatabase: DrawingToDatabase[];

    constructor(private apiDrawingService: ApiDrawingService) {}

    getAllFromDatabase(): Promise<DrawingToDatabase> {
        return new Promise<DrawingToDatabase>((resolve, reject) => {
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
        this.apiDrawingService.save(drawing).subscribe(() => {});
    }

    deleteFromDatabase(id: string) {
        this.apiDrawingService.delete(id);
    }
}
