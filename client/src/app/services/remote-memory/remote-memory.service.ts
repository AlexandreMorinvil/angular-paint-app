import { Injectable } from '@angular/core';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';

@Injectable({
    providedIn: 'root',
})
export class RemoteMemoryService {
    drawingsFromDatabase: DrawingToDatabase[];

    constructor(private apiDrawingService: ApiDrawingService) {}

    getAllFromDatabase(): void {
        this.apiDrawingService.getAll().subscribe((drawingsFetched: DrawingToDatabase[]) => {
            this.drawingsFromDatabase = drawingsFetched;
            //TO BE REMOVED TEST ONLY
            // this.drawingsFromDatabase.push(new Drawing());
            // this.drawingsFromDatabase.push(new Drawing());
        });
    }

    saveToDatabase(drawing: DrawingToDatabase): void {
        this.apiDrawingService.save(drawing).subscribe(() => {});
    }
}
