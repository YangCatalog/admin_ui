import { Component, OnInit, ViewChild } from '@angular/core';
import { FilesService } from '../../files.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TextEditorComponent } from 'src/app/components/text-editor/text-editor.component';

@Component({
  selector: 'app-file-edit',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.scss']
})
export class FileEditComponent implements OnInit {
  isLoading = false;
  error = false;
  fileText: string;

  @ViewChild('textEditor') textEditor: TextEditorComponent;

  constructor(
    public filesService: FilesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.filesService.selectedFilePath) {
      this.isLoading = true;
      this.filesService.fetchFileContent()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(
          response => {
            this.fileText = response.data;
          },
          err => {
            console.log(err);
            this.error = true;
          }
        );
    } else {
      this.router.navigate(['/files/overview']);
    }
  }

  saveChange(editedText: string) {
    this.textEditor.startLoading();
    this.filesService.updateFile(editedText)
      .pipe(finalize(() => {
        this.textEditor.stopLoading();
      }))
      .subscribe(
        response => {
          this.textEditor.disableConfigEdit();
          this.textEditor.showSuccess();
        },
        err => {
          this.textEditor.showError();
        }
      );
  }

}
