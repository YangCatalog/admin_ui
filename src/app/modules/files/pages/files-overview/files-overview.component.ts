import { Component, OnInit, ViewChild } from '@angular/core';
import { FilesService } from '../../files.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-files-overview',
  templateUrl: './files-overview.component.html',
  styleUrls: ['./files-overview.component.scss']
})
export class FilesOverviewComponent implements OnInit {
  isLoadingFolders = true;
  isLoadingFiles = false;
  hideTable = true;
  form: FormGroup;
  folderNames: string[];
  dataSource;
  displayedColumns = ['name', 'actions'];
  dialogRefSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private filesService: FilesService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.buildForm();
    this.filesService.fetchFolders()
    .pipe(finalize(() => this.isLoadingFolders = false))
    .subscribe(
      response => {
        this.folderNames = response;
      },
      err => {
        console.log(err);
      }
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      folderName: [[], Validators.required]
    });
  }

  formSubmit() {
    this.filesService.selectedFolder = this.form.value.folderName;
    this.fetchFiles();
  }

  fetchFiles() {
    this.isLoadingFiles = true;
    this.hideTable = true;

    this.filesService.fetchFiles()
    .pipe(finalize(() => this.isLoadingFiles = false))
    .subscribe(
      response => {
        this.dataSource = new MatTableDataSource<any>(response);
        this.dataSource.paginator = this.paginator;
        this.hideTable = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  onEdit(file: string) {
    this.filesService.selectedFile = file;
    this.router.navigate(['/files/edit']);
  }

  onDelete(fileName: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        fileName
      }
    });

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe( confirm => {
      if (confirm) {
        this.filesService.deleteFile(fileName)
        .subscribe(
          response => {
            this.fetchFiles();
          },
          err => {
            console.log(err);
          }
        );
      }
      this.dialogRefSubscription.unsubscribe();
    });
  }
}
