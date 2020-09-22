import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/toolModifier';

@Injectable({
  providedIn: 'root'
})
export class TracingService extends ToolModifier {

  private contour:boolean = true;
  private fill:boolean = true;

  constructor() {
    super();
  }

  public setContourValue(input: boolean) : void {
    this.contour = input;
  }

  public setFillValue(input: boolean) : void {
    this.fill = input;
  }

  get valueContour(): boolean {
    return this.contour;
  }

  get valueFill(): boolean {
    return this.fill;
  }
}