import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { HealthcheckService } from '../../healthcheck.service';

@Component({
  selector: 'app-info-message-dialog',
  templateUrl: './info-message-dialog.component.html',
  styleUrls: ['./info-message-dialog.component.scss']
})
export class InfoMessageDialogComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = [''];
  isLoading = false;
  containsJobId = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private healthcheckService: HealthcheckService) {}

  ngOnInit(): void {
    this.dataSource = this.data.infoMessages;
    this.checkJobId();
    if (this.containsJobId) {
      this.displayedColumns = ['label', 'message', 'result']
    } else {
      this.displayedColumns = ['label', 'message']
    }
  }

  private checkJobId() {
    this.dataSource.forEach(infoMessage => {
      if (infoMessage.label === 'Job ID') {
        this.containsJobId = true;
        this.isLoading = true;
          this.healthcheckService.getJobStatus(infoMessage.message)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(response => {
              if (response?.info?.result) {
                infoMessage['result'] = response.info.result;
              }
            });
      }
    });
  }
}
