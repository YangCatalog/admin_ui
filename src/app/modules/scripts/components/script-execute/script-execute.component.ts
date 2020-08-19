import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ScriptsService } from '../../scripts.service';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';

@Component({
  selector: 'app-script-execute',
  templateUrl: './script-execute.component.html',
  styleUrls: ['./script-execute.component.scss']
})
export class ScriptExecuteComponent implements OnInit {
  isLoadingScripts = true;
  isLoadingOptions = false;
  isLoadingExecute = false;
  errorLoadingScripts = false;
  errorLoadingOptions = false;
  selectedScript = '';
  successExecute = false;
  errorExecute = false;
  form: FormGroup;
  scripts: string[];
  help: string;
  dialogRefSubscription: Subscription;
  scriptOptions;
  scriptOptionsHelp: any[];
  jobIdToCopy = '';

  constructor(
    private scriptsService: ScriptsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.scriptsService.fetchScripts()
      .pipe(finalize(() => this.isLoadingScripts = false))
      .subscribe(
        response => {
          this.scripts = response.data;
        },
        err => {
          console.log(err);
          this.errorLoadingScripts = true;
        }
      );
  }

  onScriptSelectChange() {
    this.clearAlert();
    this.isLoadingOptions = true;
    this.errorLoadingOptions = false;
    this.scriptsService.fetchOptions(this.selectedScript)
      .subscribe(
        response => {
          this.scriptOptions = response.data;
          this.help = response.help;
          this.scriptOptionsHelp = response.options;
          this.buildForm();
          this.isLoadingOptions = false;
        },
        err => {
          console.log(err);
          this.isLoadingOptions = false;
          this.errorLoadingOptions = true;
        }
      );
  }

  buildForm() {
    this.form = this.formBuilder.group({});
    for (const [key, definition] of Object.entries(this.scriptOptions)) {
      const control = this.formBuilder.control(null);

      if (definition['type'] === 'int') {
        control.setValue(parseInt(definition['default'], 10));
      } else {
        control.setValue(definition['default']);
      }

      if (key === 'user_email') {
        control.setValidators([Validators.required, Validators.email]);
      }

      if (key === 'row_id') {
        control.setValidators(Validators.required);
      }

      this.form.addControl(key, control);
    }
  }

  onSubmit() {
    this.clearAlert();
    const dialogRef = this.dialog.open(ConfirmComponent, {});

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {

        this.isLoadingExecute = true;
        this.scriptsService.postScripts(this.form.value, this.selectedScript)
          .pipe(finalize(() => this.isLoadingExecute = false))
          .subscribe(
            response => {
              if (response.info === 'Verification successful') {
                this.successExecute = true;
                this.scriptsService.storeJob(this.selectedScript, response['job-id']);
                this.jobIdToCopy = response['job-id'];
              } else {
                this.errorExecute = true;
              }
            },
            err => {
              this.errorExecute = true;
            }
          );
      }
      this.dialogRefSubscription.unsubscribe();
    });
  }

  clearAlert() {
    this.successExecute = false;
    this.errorExecute = false;
    this.jobIdToCopy = '';
  }

}
