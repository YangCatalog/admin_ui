import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { RecordDialogComponent } from '../../dialogs/record-dialog/record-dialog.component';
import { UsersManagementService } from '../../users-management.service';
import { UsersTableHeaders, UsersTempTableHeaders } from './users.headers';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  isLoading = false;
  isLoadingTable = false;
  headers: any[];
  displayedColumns: string[];
  form: FormGroup;
  tableReady = false;
  noRecords = false;
  dataSource;
  tableDetailsList = [
    { 'name': 'approved', 'label': 'approved users' },
    { 'name': 'temp', 'label': 'users waiting for approval' }
  ]
  selectedTable: string;
  dialogRefSubscription: Subscription;
  error = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private usersService: UsersManagementService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'tableName': ['', Validators.required]
    });
  }

  formSubmit() {
    this.selectedTable = this.form.value.tableName;
    this.fetchTableRecords();
  }

  fetchTableRecords() {
    this.isLoadingTable = true;
    this.tableReady = false;
    this.noRecords = false;

    this.usersService.fetchTable(this.selectedTable)
      .pipe(finalize(() => (this.isLoadingTable = false)))
      .subscribe(
        response => {
          if (response.length > 0) {
            this.getDisplayedColumns();
            this.tableReady = true;
            this.dataSource = new MatTableDataSource<any>(response);
            this.dataSource.paginator = this.paginator;
          } else {
            this.noRecords = true;
          }
        },
        err => {
          this.error = true;
          console.log(err);
        }
      );
  }

  recordDialog(type: string, record?: any) {
    let dialogRef: MatDialogRef<RecordDialogComponent>;

    switch (type) {
      case 'create':
        dialogRef = this.dialog.open(RecordDialogComponent, {
          data: {
            tableName: this.selectedTable,
            type
          }
        });
        this.dialogRefSubscription = dialogRef.afterClosed().subscribe(closeMsg => {
          this.updateTable(closeMsg);
        });
        break;
      case 'validate':
        dialogRef = this.dialog.open(RecordDialogComponent, {
          data: {
            tableName: this.selectedTable,
            record,
            type
          }
        });
        this.dialogRefSubscription = dialogRef.afterClosed().subscribe(closeMsg => {
          this.updateTable(closeMsg);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(RecordDialogComponent, {
          data: {
            tableName: this.selectedTable,
            record,
            type
          }
        });
        this.dialogRefSubscription = dialogRef.afterClosed().subscribe(closeMsg => {
          this.updateTable(closeMsg);
        });
        break;
    }
  }

  onDelete(record: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        record
      }
    });

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.usersService.deleteRecord(this.selectedTable, record.id)
          .subscribe(
            response => {
              this.fetchTableRecords();
            },
            err => {
              this.error = true;
              console.log(err);
            }
          );
      }
      this.dialogRefSubscription.unsubscribe();
    });
  }

  onValidate(record: any) {
    this.recordDialog('validate', record);
  }

  onEdit(record: any) {
    this.recordDialog('edit', record);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable(closeMsg: string) {
    if (closeMsg === 'success') {
      this.fetchTableRecords();
    } else if (closeMsg === 'fail') {
      this.error = true;
    }
    this.dialogRefSubscription.unsubscribe();
  }

  private getDisplayedColumns() {
    this.headers = this.selectedTable === 'approved' ? UsersTableHeaders : UsersTempTableHeaders;
    this.displayedColumns = this.headers.map(headerObj => headerObj.value);
    this.displayedColumns.push('actions');
  }
}
