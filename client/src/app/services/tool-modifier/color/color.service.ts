import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/toolModifier';


@Injectable({
  providedIn: 'root'
})
export class ColorService extends ToolModifier<string> {
  constructor() {
    super("#000000");
  }
}