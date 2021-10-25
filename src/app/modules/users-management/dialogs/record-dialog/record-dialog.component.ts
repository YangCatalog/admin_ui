import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsersManagementService } from '../../users-management.service';

@Component({
  selector: 'app-record-dialog',
  templateUrl: './record-dialog.component.html',
  styleUrls: ['./record-dialog.component.scss']
})
export class RecordDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;
  isValidate: boolean;
  isCreate: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RecordDialogComponent>,
    private usersService: UsersManagementService
  ) { }

  ngOnInit(): void {
    this.isEdit = this.data.type === 'edit';
    this.isValidate = this.data.type === 'validate';
    this.isCreate = this.data.type === 'create';

    this.buildForm();

    if (this.isValidate) {
      this.form.setValidators(this.accessRightsValidator());
      this.fillForm(this.data.record);
    } else if (this.isEdit) {
      this.fillForm(this.data.record);
    }

    if (this.data.tableName === 'approved') {
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

    if (this.isValidate) {
      data.input['id'] = this.data.record.id;
      delete data.input.password;

      this.usersService.validateRecord(data)
        .subscribe(
          response => {
            this.close('success');
          },
          err => {
            console.log(err);
            this.close('fail');
          });
    } else if (this.isCreate) {
      this.usersService.saveNewRecord(this.data.tableName, data)
        .subscribe(
          response => {
            this.close('success');
          },
          err => {
            console.log(err);
            this.close('fail');
          }
        );
    } else {
      data.input['id'] = this.data.record.id;
      delete data.input.password;

      this.usersService.editRecord(this.data.tableName, this.data.record.id, data)
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
      'first-name': [{ value: '', disabled: this.isValidate }, Validators.required],
      'last-name': [{ value: '', disabled: this.isValidate }, Validators.required],
      'username': [{ value: '', disabled: this.isValidate }, Validators.required],
      'password': [{ value: '', disabled: this.isValidate || this.isEdit }, Validators.required],
      'email': [{ value: '', disabled: this.isValidate }, [Validators.required, Validators.email]],
      'models-provider': [{ value: '', disabled: this.isValidate }],
      'access-rights-sdo': '',
      'access-rights-vendor': ''
    });
  }

  private fillForm(record: any) {
    switch (this.data.tableName) {
      case 'approved':
        Object.getOwnPropertyNames(record).forEach((prop: string) => {
          this.form.patchValue({ [prop]: record[prop] });
        });
        break;
      case 'temp':
        Object.getOwnPropertyNames(record).forEach((prop: string) => {
          if (prop !== 'access-rights-sdo' && prop !== 'access-rights-vendor') {
            this.form.patchValue({ [prop]: record[prop] });
          }
        });
        break;
    }
  }
}
