import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/toolModifier';

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
export class TextureService extends ToolModifier {

  private listTextures: string[];
  private texture: string = TextureEnum.shadowTexture;


  constructor() {
    super();
    this.listTextures = Object.values(TextureEnum);
  }

  public getListTextures(): string[] {
    return this.listTextures;
  }

  get value(): string {
    return this.texture;
  }

  set value(input: string) {
    this.texture = input;
  }
}
