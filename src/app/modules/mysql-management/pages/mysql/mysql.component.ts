import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MysqlManagementService } from '../../mysql-management.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
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
  headers = [
    {label: 'ID', value: 'id'},
    {label: 'First Name', value: 'first-name'},
    {label: 'Last Name', value: 'last-name'},
    {label: 'Username', value: 'username'},
    {label: 'Email', value: 'email'},
    {label: 'Models Provider', value: 'models-provider'},
    {label: 'Access Rights SDO', value: 'access-rights-sdo'},
    {label: 'Access Rights Vendor', value: 'access-rights-vendor'},
  ];
  displayedColumns: string[];
  form: FormGroup;
  tableReady = false;
  noRecords = false;
  dataSource;
  tablesList: string[];
  selectedTable: string;
  dialogRefSubscription: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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
        this.tablesList = response;
      },
      err => {
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

  fetchTableRecords () {
    this.isLoading = true;
    this.tableReady = false;
    this.noRecords = false;

    this.mySqlService.fetchTable(this.selectedTable)
    .pipe(finalize(() => (this.isLoading = false)))
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
        console.log(err);
      }
    )
  }

  recordDialog(type: string, id?: number) {
    switch (type) {
      case 'create':
        const dialogRef = this.dialog.open(RecordDialogComponent, {
          data: {
            edit: false,
            tableName: this.selectedTable
          }
        });

        this.dialogRefSubscription = dialogRef.afterClosed().subscribe( closeMsg => {
          if (closeMsg === 'success') {
            this.fetchTableRecords();
          }
          this.dialogRefSubscription.unsubscribe();
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

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe( confirm => {
      if (confirm) {
        this.mySqlService.deleteRecord(this.selectedTable, record.id)
        .subscribe(
          response => {
            this.fetchTableRecords();
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
