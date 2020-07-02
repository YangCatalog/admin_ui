import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ConfigService } from '../../config.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfigSaveDialogComponent } from '../../dialogs/config-save-dialog/config-save-dialog.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {
  isLoading = true;
  configText;
  configForm: FormGroup;
  editing = false;
  textareaPreviousHeight = 0;
  dialogSaveSubscription: Subscription;

  private configTextarea: ElementRef;

  @ViewChild('configTextarea') set content(content: ElementRef) {
    if (content) {
      this.configTextarea = content;
    }
  }
  configChageSubscription: Subscription;

  constructor(
      private configService: ConfigService,
      private formBuilder: FormBuilder,
      public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.fetchConfig();
  }

  fetchConfig() {
    this.configService.fetchConfig()
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe(
      response => {
        this.configText = response;
        this.buildForm();
        setTimeout(() => { this.adjustTextareaHeight(); }, 0);
      },
      err => {
        console.log(err);
      }
    );
  }

  buildForm() {
    this.configForm = this.formBuilder.group({
      config: [this.configText]
    });

    this.configForm.get('config').disable();

    this.configChageSubscription = this.configForm.valueChanges.subscribe(value => {
      this.adjustTextareaHeight();
    });
  }

  onSubmit() {
    const dialogRef = this.dialog.open(ConfigSaveDialogComponent, {
      data: {
        config: this.configForm.value.config
      }
    });

    this.dialogSaveSubscription = dialogRef.afterClosed().subscribe( configSaved => {
      if (configSaved === 'saved') {
        this.isLoading = true;
        this.disableConfigEdit();
        this.fetchConfig();
      }
      this.dialogSaveSubscription.unsubscribe();
    });
  }

  adjustTextareaHeight() {
    this.textareaPreviousHeight = parseInt(this.configTextarea.nativeElement.style.height.substring(0, this.configTextarea.nativeElement.style.height.length - 2));

    if (this.configTextarea.nativeElement.scrollHeight > this.textareaPreviousHeight) {
      this.configTextarea.nativeElement.style.height = `${this.configTextarea.nativeElement.scrollHeight}px`;
    }
  }

  enableConfigEdit() {
    this.configForm.get('config').enable();
    this.editing = true;
  }

  disableConfigEdit() {
    this.configForm.get('config').disable();
    this.editing = false;
  }

  discardChanges() {
    this.configForm.get('config').setValue(this.configText);
    this.disableConfigEdit();
  }

  ngOnDestroy() {
    this.configChageSubscription.unsubscribe();
  }

}
