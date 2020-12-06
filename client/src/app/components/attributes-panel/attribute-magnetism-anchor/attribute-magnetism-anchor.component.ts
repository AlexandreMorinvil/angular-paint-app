import { Component } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MagnetismAnchor, MagnetismService } from '@app/services/magnetism/magnetism.service';

@Component({
    selector: 'app-attribute-magnetism-anchor',
    templateUrl: './attribute-magnetism-anchor.component.html',
    styleUrls: ['./attribute-magnetism-anchor.component.scss', '../attributes-section.component.scss'],
})
export class AttributeMagnetismAnchorComponent {
    anchorMapping: Vec2[] = [];
    constructor(private magnetismService: MagnetismService) {
        this.anchorMapping.push({ y: MagnetismAnchor.Start, x: MagnetismAnchor.Start });
        this.anchorMapping.push({ y: MagnetismAnchor.Start, x: MagnetismAnchor.Center });
        this.anchorMapping.push({ y: MagnetismAnchor.Start, x: MagnetismAnchor.End });

        this.anchorMapping.push({ y: MagnetismAnchor.Center, x: MagnetismAnchor.Start });
        this.anchorMapping.push({ y: MagnetismAnchor.Center, x: MagnetismAnchor.Center });
        this.anchorMapping.push({ y: MagnetismAnchor.Center, x: MagnetismAnchor.End });

        this.anchorMapping.push({ y: MagnetismAnchor.End, x: MagnetismAnchor.Start });
        this.anchorMapping.push({ y: MagnetismAnchor.End, x: MagnetismAnchor.Center });
        this.anchorMapping.push({ y: MagnetismAnchor.End, x: MagnetismAnchor.End });
    }

    isCheckedAnchor(anchor: Vec2): boolean {
        return this.magnetismService.horizontalAnchorPosition === anchor.x && this.magnetismService.verticalAnchorPosition === anchor.y;
    }

    setSelectedAnchor(anchor: Vec2): void {
        this.magnetismService.horizontalAnchorPosition = anchor.x;
        this.magnetismService.verticalAnchorPosition = anchor.y;
    }
}
