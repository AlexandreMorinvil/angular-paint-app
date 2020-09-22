import { Injectable } from '@angular/core';
import { ToolModifier } from /*'@app/classes/*/ '../../../classes/toolModifier';

export enum TextureEnum {
  shadowTexture = "ombrée",
  gradientTexture = "dégradée",
  squareTexture = "carrotée",
  dashTexture = "pointillée",
  zigzagTexture = "zigzaguée"
}

@Injectable({
  providedIn: 'root'
})
export class TextureService extends ToolModifier<string> {

  private listTextures: string[];


  constructor() {
    super(TextureEnum.shadowTexture);
    this.listTextures = Object.values(TextureEnum);
  }

  public getListTextures(): string[] {
    return this.listTextures;
  }

  get value(): string {
    return this.parameter;
  }

  set value(input: string) {
    this.parameter = input;
  }
}
