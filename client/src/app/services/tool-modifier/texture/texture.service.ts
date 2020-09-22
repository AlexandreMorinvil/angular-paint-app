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

  public setValue(input: string) {
    if (this.listTextures.includes(input))
      this.texture = input;
  }

  get value(): string {
    return this.texture;
  }
}
