import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/toolModifier';

@Injectable({
  providedIn: 'root'
})
export class TracingService extends ToolModifier {

  private contour:boolean = true;
  private fill:boolean = false;

  constructor() {
    super();
  }

  get valueContour(): boolean {
    return this.contour;
  }

  get valueFill(): boolean {
    return this.fill;
  }

  set valueContour(input: boolean) {
    this.contour = input;
  }

  set valueFill(input: boolean) {
    this.fill = input;
  }
}