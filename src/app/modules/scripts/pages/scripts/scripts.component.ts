import { Component, OnInit } from '@angular/core';
import { ScriptsService } from '../../scripts.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      this.form.addControl(key, this.formBuilder.control(definition['default']));
    }
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ConfirmComponent, {});

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe( confirm => {
      if (confirm) {

        const data = {input: {...this.form.value}};
        data.input['script'] = this.selectedScript;

        this.isLoadingExecute = true;
        this.scriptsService.postScripts(data)
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
