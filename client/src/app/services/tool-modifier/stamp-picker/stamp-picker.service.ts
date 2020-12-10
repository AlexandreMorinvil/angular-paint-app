import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { StampPickerModifierState } from './stamp-picker-state';

export enum StampEnum {
    stamp1 = 'Étampe 1',
    stamp2 = 'Étampe 2',
    stamp3 = 'Étampe 3',
    stamp4 = 'Étampe 4',
    stamp5 = 'Étampe 5',
}

@Injectable({
    providedIn: 'root',
})
export class StampPickerService extends ToolModifier {
    private listStamps: string[];
    private stamp: string = StampEnum.stamp1;

    constructor() {
        super();
        this.listStamps = Object.values(StampEnum);
    }

    getListStamps(): string[] {
        return this.listStamps;
    }

    getStamp(): string {
        return this.stamp;
    }

    setStamp(input: string): void {
        if (this.listStamps.includes(input)) this.stamp = input;
    }

    getState(): StampPickerModifierState {
        return new StampPickerModifierState(this.stamp);
    }

    setState(state: StampPickerModifierState): void {
        this.stamp = state.stamp;
    }
}
