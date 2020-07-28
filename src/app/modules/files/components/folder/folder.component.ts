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
  ITEMS_RENDERED_AT_ONCE = 200;
  INTERVAL_IN_MS = 10;
  intervals = {
    files: null,
    folders: null
  }

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
        this.progressiveRender(response.data.files, 'files');
        this.progressiveRender(response.data.folders, 'folders');
      },
      err => {
        this.filesService.subject$.next('files-fetch-error');
        console.log(err);
      }
    );
  }

  progressiveRender(data, type) {
    let currentIndex = 0;
    this.intervals[type] = setInterval( () => {
      const nextIndex = currentIndex + this.ITEMS_RENDERED_AT_ONCE;

      for (let n = currentIndex; n <= nextIndex ; n++) {
        if (n >= data.length) {
          clearInterval(this.intervals[type]);
          break;
        }
        this.content[type].push(data[n]);
      }

      currentIndex += this.ITEMS_RENDERED_AT_ONCE;
    }, this.INTERVAL_IN_MS);
  }

  trackName(index: number, item: any) {
    return item.name;
  }

  reinit() {
    this.content.files = [];
    this.content.folders = [];
    this.closed = true;
    this.toggle();
  }
}
