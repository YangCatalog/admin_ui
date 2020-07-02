import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../config.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-config-save-dialog',
  templateUrl: './config-save-dialog.component.html',
  styleUrls: ['./config-save-dialog.component.scss']
})
export class ConfigSaveDialogComponent implements OnInit {
  isLoading = false;
  error = false;
  saved = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfigSaveDialogComponent>,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
  }

  save() {
    this.isLoading = true;
    this.configService.saveConfig(this.data.config)
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe(
      response => {
        this.saved = true;
      },
      err => {
        this.error = true;
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

}
