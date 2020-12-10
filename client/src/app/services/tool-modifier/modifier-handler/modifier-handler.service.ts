import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';

@Injectable({
    providedIn: 'root',
})
export class ModifierHandlerService {
    clamp(input: number, maximum: number, minimum: number): number {
        let value = Bound.inside;
        if (input >= maximum) {
            value = Bound.upper;
        } else if (input <= minimum) {
            value = Bound.lower;
        }
        return value;
    }
}
