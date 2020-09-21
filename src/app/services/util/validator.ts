import {AbstractControl} from '@angular/forms';
import {UtilService} from './util.service';

export class Validator {
  private static utilService: UtilService;
  public static validateImage(imageControl: AbstractControl): { [key: string]: boolean } | null {
    if (imageControl.value){
      const [uploadImage] = imageControl.value.files;
      return this.utilService.validateFile(uploadImage)
      ? null
        : {
          image : true,
        };
    }
    return ;
  }

}
