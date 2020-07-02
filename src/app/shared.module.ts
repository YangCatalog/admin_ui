import { NgModule } from '@angular/core';
import { LoaderComponent } from './others/loader/loader.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [LoaderComponent],
    imports: [CommonModule],
    exports: [LoaderComponent, CommonModule]
})
export class SharedModule {}
