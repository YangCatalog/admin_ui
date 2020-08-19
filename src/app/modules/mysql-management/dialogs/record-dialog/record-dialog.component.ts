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
  dialogTitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RecordDialogComponent>,
    private mySqlService: MysqlManagementService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    if (this.data.validate) {
      this.form.setValidators(this.accessRightsValidator());
      this.dialogTitle = 'Validate record';
      this.fillForm(this.data.record);
    } else {
      this.dialogTitle = 'Create record';
    }

    if (this.data.tableName === 'users') {
      this.form.setValidators(this.accessRightsValidator());
    }
  }

  accessRightsValidator() {
    return (form) => {
      const sdo = form.get('access-rights-sdo') as FormControl;
      const vendor = form.get('access-rights-vendor') as FormControl;
      if (
        sdo.value === '' &&
        vendor.value === '') {
        sdo.setErrors({ 'at-leaste-one-access-right-required': true });
        vendor.setErrors({ 'at-leaste-one-access-right-required': true });
        return { 'at-leaste-one-access-right-required': true };
      } else {
        sdo.setErrors(null);
        vendor.setErrors(null);
        return null;
      }
    };
  }

  onSubmit() {
    const data = {
      input: this.form.getRawValue()
    };

    if (this.data.validate) {
      data.input['id'] = this.data.record.id;
      delete data.input.password;

      this.mySqlService.validateRecord(data)
        .subscribe(
          response => {
            this.close('success');
          },
          err => {
            console.log(err);
            this.close('fail');
          });
    } else {
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
  }

  close(status: string) {
    this.dialogRef.close(status);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      'first-name': [{ value: '', disabled: this.data.validate }, Validators.required,],
      'last-name': [{ value: '', disabled: this.data.validate }, Validators.required],
      'username': [{ value: '', disabled: this.data.validate }, Validators.required],
      'password': [{ value: '', disabled: this.data.validate }, Validators.required],
      'email': [{ value: '', disabled: this.data.validate }, [Validators.required, Validators.email]],
      'models-provider': [{ value: '', disabled: this.data.validate }],
      'access-rights-sdo': '',
      'access-rights-vendor': ''
    });
  }

  private fillForm(record: any) {
    Object.getOwnPropertyNames(record).forEach((prop: string) => {
      if (prop !== 'access-rights-sdo' && prop !== 'access-rights-vendor') {
        this.form.patchValue({ [prop]: record[prop] });
      }
    });
  }
}
