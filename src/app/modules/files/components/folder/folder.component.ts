import { Component, OnInit, Input } from '@angular/core';
import { FilesService } from '../../files.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() folder;
  @Input() parentPath: string;
  newPath: string;
  closed = true;
  isLoading = false;
  isRoot = false;
  content = {
    files: [],
    folders: []
  };

  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
    // root directory
    if (this.parentPath === '' && this.folder.name === '') {
      this.newPath = '';
      this.toggle();
      this.isRoot = true;
    } else {
      this.newPath = `${this.parentPath}/${this.folder.name}`;
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
        this.content.files = response.data.files;
        this.content.folders = response.data.folders;
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
