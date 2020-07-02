import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MysqlManagementService } from '../../mysql-management.service';

@Component({
  selector: 'app-record-dialog',
  templateUrl: './record-dialog.component.html',
  styleUrls: ['./record-dialog.component.scss']
})
export class RecordDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RecordDialogComponent>,
    private mySqlService: MysqlManagementService
    ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'first-name': ['', Validators.required],
      'last-name': ['', Validators.required],
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'models-provider': [''],
      'access-rights-sdo': [''],
      'access-rights-vendor': ['']
    });

    this.form.setValidators(this.accessRightsValidator());
  }

  accessRightsValidator() {
    return (form) => {
      const sdo = form.get('access-rights-sdo') as FormControl;
      const vendor = form.get('access-rights-vendor') as FormControl;
      if (
        sdo.value === '' &&
        vendor.value === '') {
          sdo.setErrors({'at-leaste-one-access-right-required': true});
          vendor.setErrors({'at-leaste-one-access-right-required': true});
          return {'at-leaste-one-access-right-required': true};
        } else {
          sdo.setErrors(null);
          vendor.setErrors(null);
          return null;
        }
    }
  }

  onSubmit() {
    const data = {
      input: this.form.value
    };

    this.mySqlService.saveNewRecord(this.data.tableName, data)
    .subscribe(
      response => {
        this.close('success');
      },
      err => {
        console.log(err);
        this.close('fail');
      }
    );
  }

  close(status: string) {
    this.dialogRef.close(status);
  }
}
