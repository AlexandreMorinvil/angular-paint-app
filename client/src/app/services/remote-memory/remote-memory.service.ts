import { Injectable } from '@angular/core';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { Drawing } from '@common/communication/drawing';

@Injectable({
    providedIn: 'root',
})
export class RemoteMemoryService {
    drawingsFromDatabase: Drawing[];

    constructor(private apiDrawingService: ApiDrawingService) {}

    getAllFromDatabase(): void {
        this.apiDrawingService.getAll().subscribe((drawingsFetched: Drawing[]) => {
            this.drawingsFromDatabase = drawingsFetched;
            //TO BE REMOVED TEST ONLY
            this.drawingsFromDatabase.push(new Drawing());
            this.drawingsFromDatabase.push(new Drawing());
        });
    }

    saveToDatabase(drawing: Drawing): void {
        this.apiDrawingService.save(drawing).subscribe(() => {});
    }
}
