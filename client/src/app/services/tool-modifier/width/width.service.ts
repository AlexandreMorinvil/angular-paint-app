import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '@app/services/tool-modifier/modifier-handler/modifier-handler.service';
import { WidthModifierState } from './width-state';

@Injectable({
    providedIn: 'root',
})
export class WidthService extends ToolModifier {
    readonly MAX_ATTRIBUTE_WIDTH: number = 50;
    readonly MIN_ATTRIBUTE_WIDTH: number = 1;
    private width: number = this.MIN_ATTRIBUTE_WIDTH;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setWidth(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_ATTRIBUTE_WIDTH, this.MIN_ATTRIBUTE_WIDTH);
        if (LIMIT === Bound.upper) this.width = this.MAX_ATTRIBUTE_WIDTH;
        else if (LIMIT === Bound.lower) this.width = this.MIN_ATTRIBUTE_WIDTH;
        else this.width = input;
    }

    getWidth(): number {
        return this.width;
    }

    getState(): WidthModifierState {
        return new WidthModifierState(this.width);
    }

    setState(state: WidthModifierState): void {
        this.width = state.width;
    }
}
