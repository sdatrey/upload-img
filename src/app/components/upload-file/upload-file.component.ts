import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../services/util/util.service';
import { Validator } from '../../services/util/validator';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../services/storage/storage.service';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject();
  fileToUpload: File;

  imagePreview: string | ArrayBuffer;
  uploadForm: FormGroup;
  submitted: boolean;
  private uploadProgress$: Observable<number>;

  constructor(
    private readonly  utilService: UtilService,
    private readonly snackBar: MatSnackBar,
    private readonly storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      title : new FormControl(null ,  {validators: [Validators.required, Validators.minLength(3)]}),
      photo : new FormControl('', {validators: [Validators.required, Validator.validateImage.bind(this)]}),
      description: new FormControl('', {validators: [Validators.required]})
    });
    this.uploadForm
      .get('photo')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((newValue) => {
        this.handleFileChange(newValue.files);
      });
  }
  handleFileChange([ uploadImage ]): void {
    this.fileToUpload = uploadImage;
    const reader = new FileReader();
    reader.onload = (loadEvent) => (this.imagePreview =
      loadEvent.target.result);
    reader.readAsDataURL(uploadImage);
  }
  postImage(): void{
    this.submitted = true;
    const mediaFolderPath = `${ Date.now().toLocaleString() }/media/`;
    const { downloadUrl$, uploadProgress$ } = this.storageService.uploadFileAndGetMetaData(
      mediaFolderPath,
      this.fileToUpload
    );
    this.uploadProgress$ = uploadProgress$;
    downloadUrl$.subscribe( (res) => {
      this.submitted = false;
      console.log(res);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
