import { Component, OnInit, Input } from '@angular/core';
import { FilesService } from '../../files.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() name: string;
  @Input() parentPath: string;
  newPath: string;
  closed = true;
  isLoading = false;
  content = {
    files: [],
    folders: []
  };

  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
    // root directory
    if (this.parentPath === '' && this.name === '') {
      this.newPath = '';
    } else {
      this.newPath = `${this.parentPath}/${this.name}`;
    }

    // root directory
    if (this.name === '') {
      this.toggle();
    }
  }

  toggle() {
    if (this.content.files.length === 0 && this.content.folders.length === 0) {
      this.fetchFolderContent();
    } else {
      this.closed = !this.closed;
    }
  }

  fetchFolderContent() {
    this.isLoading = true;
    this.filesService.fetchFolder(this.newPath)
    .pipe(finalize(() => {
      this.isLoading = false;
      this.closed = !this.closed;
    }))
    .subscribe(
      response => {
        this.content = response.data;
      },
      err => {
        this.filesService.subject$.next('files-fetch-error');
        console.log(err);
      }
    );
  }

  reinit() {
    this.content.files = [];
    this.content.folders = [];
    this.closed = true;
    this.toggle();
  }
}
