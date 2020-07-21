import { Component, OnInit } from '@angular/core';
import { ScriptsService } from '../../scripts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss']
})
export class ScriptsComponent implements OnInit {
  isLoading = true;
  isLoadingOptions = false;
  isLoadingExecute = false;
  errorLoadingScripts = false;
  errorLoadingOptions = false;
  selectedScript = '';
  success = false;
  error = false;
  form: FormGroup;
  scripts;
  dialogRefSubscription: Subscription;
  scriptOptions;

  constructor(
    private scriptsService: ScriptsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.scriptsService.fetchScripts()
    .pipe(finalize(() => this.isLoading = false))
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
    this.isLoadingOptions = true;
    this.errorLoadingOptions = false;
    this.scriptsService.fetchOptions(this.selectedScript)
    .subscribe(
      response => {
        this.scriptOptions = response.data;
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

      if (['row_id', 'user_email'].includes(key)) {
        control.setValidators(Validators.required);
      }

      this.form.addControl(key, control);
    }
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ConfirmComponent, {});

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe( confirm => {
      if (confirm) {

        this.isLoadingExecute = true;
        this.scriptsService.postScripts(this.form.value, this.selectedScript)
        .pipe(finalize(() => this.isLoadingExecute = false))
        .subscribe(
          response => {
            this.success = true;
          },
          err => {
            this.error = true;
          }
        );
      }
      this.dialogRefSubscription.unsubscribe();
    });
  }
}
