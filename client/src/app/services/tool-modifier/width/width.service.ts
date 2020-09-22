import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/toolModifier';

@Injectable({
  providedIn: 'root'
})
export class WidthService extends ToolModifier {

  readonly MAX_ATTRIBUTE_WIDTH: number = 50;
  readonly MIN_ATTRIBUTE_WIDTH: number = 1;
  private width:number = this.MIN_ATTRIBUTE_WIDTH;

  constructor() {
    super();
  }

  get value(): number {
    return this.width;
}

  set value(input: number) {
    if (input >= this.MAX_ATTRIBUTE_WIDTH) this.width = this.MAX_ATTRIBUTE_WIDTH;
    else if (input <= this.MIN_ATTRIBUTE_WIDTH) this.width = this.MIN_ATTRIBUTE_WIDTH;
    else this.width = input;
  }
}