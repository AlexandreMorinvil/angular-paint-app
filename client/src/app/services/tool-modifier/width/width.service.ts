import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/toolModifier';

@Injectable({
  providedIn: 'root'
})
export class WidthService extends ToolModifier<number> {

  readonly MAX_ATTRIBUTE_WIDTH: number = 50;
  readonly MIN_ATTRIBUTE_WIDTH: number = 1;

  constructor() {
    super(1);
  }

  get value(): number {
    return this.parameter;
  }

  set value(input: number) {
    if (input >= this.MAX_ATTRIBUTE_WIDTH) this.parameter = this.MAX_ATTRIBUTE_WIDTH;
    else if (input <= this.MIN_ATTRIBUTE_WIDTH) this.parameter = this.MIN_ATTRIBUTE_WIDTH;
    else this.parameter = input;
  }
}