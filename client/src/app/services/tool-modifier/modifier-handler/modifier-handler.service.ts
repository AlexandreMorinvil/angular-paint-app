import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';

@Injectable({
    providedIn: 'root',
})
export class ModifierHandlerService {
    clamp(input: number, maximum: number, minimum: number): number {
        if (input >= maximum) return Bound.upper;
        if (input <= minimum) return Bound.lower;
        return Bound.inside;
    }
}
