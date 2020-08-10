import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TextEditorSaveDialogComponent } from './text-editor-save-dialog/text-editor-save-dialog.component';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, OnDestroy {
  backupText: string;
  editing = false;
  form: FormGroup;
  isLoading = false;
  textareaPreviousHeight: number;
  textChangeSubscription: Subscription;
  dialogSaveSubscription: Subscription;
  success = false;
  error = false;

  @Input() text: string;
  @Output() saveConfirm = new EventEmitter<string>();

  @ViewChild('textarea') textarea: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buildForm();
    setTimeout(() => { this.adjustTextareaHeight(); }, 0);
  }

  buildForm() {
    this.pretiffyJSONText();
    this.form = this.formBuilder.group({
      text: [this.text]
    });

    this.form.get('text').disable();

    this.textChangeSubscription = this.form.valueChanges.subscribe(value => {
      this.adjustTextareaHeight();
    });

  }

  enableEdit() {
    this.form.get('text').enable();
    this.editing = true;
  }

  disableConfigEdit() {
    this.form.get('text').disable();
    this.editing = false;
  }

  cancelChanges() {
    this.form.get('text').setValue(this.text);
    this.disableConfigEdit();
  }

  adjustTextareaHeight() {
    this.textareaPreviousHeight = parseInt(this.textarea.nativeElement.style.height.substring(0, this.textarea.nativeElement.style.height.length - 2));

    if (this.textarea.nativeElement.scrollHeight > this.textareaPreviousHeight) {
      this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`;
    }
  }

  onSubmit() {
    const dialogRef = this.dialog.open(TextEditorSaveDialogComponent, {});

    this.dialogSaveSubscription = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.saveConfirm.emit(this.form.value.text);
      }
      this.dialogSaveSubscription.unsubscribe();
    });
  }

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }

  showSuccess() {
    this.text = this.form.value.text;
    this.success = true;
    setTimeout(() => { this.success = false; }, 3000);
  }

  showError() {
    this.error = true;
    setTimeout(() => { this.error = false; }, 3000);
  }

  pretiffyJSONText() {
    try {
      const text = JSON.parse(this.text);
      this.text = JSON.stringify(text, undefined, 4);
    } catch (error) { }
  }

  ngOnDestroy() {
    this.textChangeSubscription.unsubscribe();
  }
}
