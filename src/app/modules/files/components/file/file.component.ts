import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { Subscription } from 'rxjs';
import { FilesService } from '../../files.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  @Input() file;
  @Input() parentPath: string;
  path: string;
  dialogRefSubscription: Subscription;


  constructor(
    public dialog: MatDialog,
    private filesService: FilesService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.path = `${this.parentPath}/${this.file.name}`;
  }

  onEdit() {
    this.filesService.selectedFilePath = this.path;
    this.router.navigate(['/files/edit']);
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        fileName: this.file.name,
        path: this.parentPath || '/'
      }
    });

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe( confirm => {
      if (confirm) {
        this.filesService.deleteFile(this.path);
      }
      this.dialogRefSubscription.unsubscribe();
    });
  }
}
