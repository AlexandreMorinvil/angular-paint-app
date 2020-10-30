import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
import { MatChipInputEvent } from '@angular/material/chips';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service.ts';
import { Drawing } from '@common/schema/drawing';
import { FILE_SERVER_BASE_URL } from '@app/services/api/drawing/api-drawing.service';

export interface Tag {
    tagName: string;
}

@Component({
    selector: 'app-modal-drawing-carousel',
    templateUrl: './modal-drawing-carousel.html',
    styleUrls: ['./modal-drawing-carousel.scss'],
})
export class DrawingCarouselComponent {
    private currentImages: Drawing[] = [];
    private currentActivesIndexes: number[] = [0,1,2];
    visible: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: Tag[] = [];

    constructor(public memoryService: RemoteMemoryService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.memoryService.getAllFromDatabase();
        console.log("HEY")
        /*let test: Drawing = {name: "alexa", tags: []}
        this.currentImages.push(new Drawing());
        this.currentImages.push(new Drawing());
        this.currentImages.push(test)*/
        this.setCurrentImages();
    }
//il faut que get current image me donne les images qui doivent présentement être affiché
    getCurrentImages(): Drawing[] {
      return this.currentImages;
    }
    setCurrentImages(){
      for (let i of this.currentActivesIndexes){
        this.currentImages.push(this.memoryService.drawingsFromDatabase[i])
      }
    }

    add(event: MatChipInputEvent): void {
         const input = event.input;
         const value = event.value;

         // Add the tag
         if ((value || '').trim()) {
             this.tags.push({ tagName: value.trim() });
         }

         // Reset the input value
         if (input) {
             input.value = '';
         }
     }

     remove(tag: Tag): void {
         const index = this.tags.indexOf(tag);

         if (index >= 0) {
             this.tags.splice(index, 1);
         }
     }

    getDrawingUrl(drawing: Drawing) {
        if (!drawing.name) return 'assets/images/nothing.png';
        return FILE_SERVER_BASE_URL + 'home_icon.png';
    }

/*
    getName(drawing: Drawing){
        for (let i of this.memoryService.drawingsFromDatabase){
            if (i.name === drawing.name ) return i.name
        }
        return "Erreur, nom pas trouvé"
    }

    getTags(drawing: Drawing){
      for (let i of this.memoryService.drawingsFromDatabase){
          if (i.name === drawing.name ) return i.name
      }
      return "Erreur, nom pas trouvé"
    }
*/

    movePrevious() {
      // If there is no more drawing, do nothing
      const firstIndex: number = 0;
      if (this.currentActivesIndexes[firstIndex] === 0)
          return
      for(let i = 0; i < this.currentImages.length; i++){
          this.currentImages[i] = this.memoryService.drawingsFromDatabase[this.currentActivesIndexes[i]-1]
          this.currentActivesIndexes[i] -= 1;
      }
    }


    moveNext() {
      // If there is no more drawing, do nothing
      const lastIndex: number = 2;
      if (this.currentActivesIndexes[lastIndex] === this.memoryService.drawingsFromDatabase.length - 1)
          return
      for(let i = 0; i < this.currentImages.length; i++){
          this.currentImages[i] = this.memoryService.drawingsFromDatabase[this.currentActivesIndexes[i]+1]
          this.currentActivesIndexes[i] += 1;
      }
    }

    ngOnInit(){
      //this.memoryService.getAllFromDatabase();
      //this.setCurrentImages();
    }

}
