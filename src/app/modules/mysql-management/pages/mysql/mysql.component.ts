import { Component, OnInit, ViewChild } from '@angular/core';
import { MysqlManagementService } from '../../mysql-management.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecordDialogComponent } from '../../dialogs/record-dialog/record-dialog.component';
import { Subscription } from 'rxjs';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-mysql',
  templateUrl: './mysql.component.html',
  styleUrls: ['./mysql.component.scss']
})
export class MysqlComponent implements OnInit {
  isLoading = false;
  isLoadingTable = false;
  headers = [
    { label: 'ID', value: 'id' },
    { label: 'First Name', value: 'first-name' },
    { label: 'Last Name', value: 'last-name' },
    { label: 'Username', value: 'username' },
    { label: 'Email', value: 'email' },
    { label: 'Models Provider', value: 'models-provider' },
    { label: 'Access Rights SDO', value: 'access-rights-sdo' },
    { label: 'Access Rights Vendor', value: 'access-rights-vendor' },
  ];
  displayedColumns: string[];
  form: FormGroup;
  tableReady = false;
  noRecords = false;
  dataSource;
  tableDetailsList: any[];
  selectedTable: string;
  dialogRefSubscription: Subscription;
  error = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private mySqlService: MysqlManagementService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.headers.map(headerObj => headerObj.value);
    this.displayedColumns.push('actions');

    this.isLoading = true;
    this.buildForm();
    this.mySqlService.fetchTables()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        response => {
          this.tableDetailsList = response;
        },
        err => {
          this.error = true;
          console.log(err);
        }
      );
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

    this.mySqlService.fetchTable(this.selectedTable)
      .pipe(finalize(() => (this.isLoadingTable = false)))
      .subscribe(
        response => {
          if (response.length > 0) {
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
            validate: false,
            tableName: this.selectedTable
          }
        });
        this.dialogRefSubscription = dialogRef.afterClosed().subscribe(closeMsg => {
          this.updateTable(closeMsg);
        });
        break;
      case 'validate':
        dialogRef = this.dialog.open(RecordDialogComponent, {
          data: {
            validate: true,
            tableName: this.selectedTable,
            record
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
        this.mySqlService.deleteRecord(this.selectedTable, record.id)
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
}
