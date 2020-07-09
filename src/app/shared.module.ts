import { NgModule } from '@angular/core';
import { LoaderComponent } from './others/loader/loader.component';
import { CommonModule } from '@angular/common';
import { TextEditorSaveDialogComponent } from './components/text-editor/text-editor-save-dialog/text-editor-save-dialog.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
    declarations: [LoaderComponent, TextEditorComponent, TextEditorSaveDialogComponent],
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule],
    exports: [LoaderComponent, CommonModule, TextEditorComponent, TextEditorSaveDialogComponent]
})
export class SharedModule {}
