import { Component, OnInit } from '@angular/core';
import { ScriptsService } from '../../scripts.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import Script from '../../interfaces/script';
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
  isLoadingExecute = false;
  success = false;
  error = false;
  form: FormGroup;
  scripts: Script[];
  dialogRefSubscription: Subscription;

  constructor(
    private scriptsService: ScriptsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.scriptsService.fetchScripts()
    .subscribe(
      response => {
        this.scripts = response.scripts;
        this.buildForm();
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      scripts: this.formBuilder.array([])
    });
    this.pushEmptyScript();
  }

  addScript() {
    this.pushEmptyScript();
  }

  pushEmptyScript() {
    const scripts = this.form.get('scripts') as FormArray;
    scripts.push(this.formBuilder.group({
      name: [null, Validators.required],
      options: this.formBuilder.array([])
    }));
  }

  scriptSelected(event: MatSelectChange, i: number) {
    const value = event.value;
    const scripts = this.form.get('scripts') as FormArray;
    const scriptFormGroup = scripts.at(i);
    const options = scriptFormGroup.get('options') as FormArray;
    options.clear();

    const availableScript = this.scripts.find(script => script.name === value);

    if (availableScript.options && availableScript.options.length > 0) {
      const availableOptions = availableScript.options;
      availableOptions.forEach( avOpt => {
        options.push(this.formBuilder.group({
          label: avOpt,
          value: false
        }));
      });
    }
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ConfirmComponent, {});

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe( confirm => {
      if (confirm) {
        const data = { input: []};
        this.form.value.scripts.forEach( script => {
          const scr = { name: script.name };
          if (script.options.length > 0) {
            scr['options'] = script.options.filter(opt => opt.value).map(opt => opt.label);
          }
          data.input.push(scr);
        });

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

  removeScript(i: number) {
    const scripts = this.form.get('scripts') as FormArray;
    scripts.removeAt(i);
  }
}
