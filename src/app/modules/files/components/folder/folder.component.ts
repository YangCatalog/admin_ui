import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { FilesService } from '../../files.service';
import { PermissionsDialogComponent } from 'src/app/dialogs/permissions-dialog/permissions-dialog.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() folder;
  @Input() parentPath: string;
  modificationDate: Date;
  newPath: string;
  closed = true;
  isLoading = false;
  isRoot = false;
  content = {
    files: [],
    folders: [],
    name: ''
  };
  ITEMS_RENDERED_AT_ONCE = 200;
  INTERVAL_IN_MS = 10;
  intervals = {
    files: null,
    folders: null
  };

  constructor(private filesService: FilesService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // root directory
    if (this.parentPath === '' && this.folder.name === '') {
      this.newPath = '';
      this.toggle();
      this.isRoot = true;
    } else {
      this.newPath = `${this.parentPath}/${this.folder.name}`;
    }
    this.modificationDate = this.folder['modification'] ? new Date(this.folder['modification'] * 1000) : null;
  }

  toggle() {
    this.filesService.currentPath$.next(this.newPath);
    if (this.content.files.length === 0 && this.content.folders.length === 0) {
      this.fetchFolderContent();
    } else {
      this.filesService.currentMessage$.next(this.content);
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
          this.filesService.currentMessage$.next(response.data);
          this.progressiveRender(response.data.files, 'files');
          this.progressiveRender(response.data.folders, 'folders');
          this.content.name = response.data.name;
        },
        err => {
          this.filesService.subject$.next('files-fetch-error');
          console.log(err);
        }
      );
  }

  progressiveRender(data: any, type: string) {
    let currentIndex = 0;
    this.intervals[type] = setInterval(() => {
      const nextIndex = currentIndex + this.ITEMS_RENDERED_AT_ONCE;

      for (let n = currentIndex; n <= nextIndex; n++) {
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

  onPermission() {
    const dialogRef = this.dialog.open(PermissionsDialogComponent, {
      width: '50%',
      data: {
        permissions: this.folder.permissions,
        group: this.folder.group,
        user: this.folder.user
      }
    });
  }
}
