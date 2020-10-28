import { Injectable } from '@angular/core';
import { ApiDrawingService } from '@app/services/api/api-drawing.service';
import { Drawing } from '@common/schema/drawing';

@Injectable({
    providedIn: 'root',
})
export class RemoteMemoryService {
    drawingsFromDatabase: Drawing[] = [];

    constructor(private apiDrawingService: ApiDrawingService) {}

    getAllFromDatabase(drawing: Drawing): void {
        this.apiDrawingService.getAll().subscribe((drawingsFetched: Drawing[]) => {
            this.drawingsFromDatabase = drawingsFetched;
        });
    }

    saveToDatabase(drawing: Drawing): void {
        this.apiDrawingService.save(drawing).subscribe(() => {});
    }
}
