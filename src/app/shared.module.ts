import { NgModule } from '@angular/core';
import { LoaderComponent } from './others/loader/loader.component';
import { CommonModule } from '@angular/common';
import { TextEditorSaveDialogComponent } from './components/text-editor/text-editor-save-dialog/text-editor-save-dialog.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionsDialogComponent } from './dialogs/permissions-dialog/permissions-dialog.component';



@NgModule({
  declarations: [LoaderComponent, TextEditorComponent, TextEditorSaveDialogComponent, PermissionsDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatTableModule, MatCheckboxModule],
  exports: [LoaderComponent, CommonModule, TextEditorComponent, TextEditorSaveDialogComponent, PermissionsDialogComponent]
})
export class SharedModule { }
