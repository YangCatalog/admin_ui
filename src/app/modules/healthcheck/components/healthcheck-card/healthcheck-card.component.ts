import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { InfoMessageDialogComponent } from '../../dialogs/info-message-dialog/info-message-dialog.component';
import { HealthcheckService } from '../../healthcheck.service';

const SECONDS = 60;

@Component({
  selector: 'app-healthcheck-card',
  templateUrl: './healthcheck-card.component.html',
  styleUrls: ['./healthcheck-card.component.scss']
})
export class HealthcheckCardComponent implements OnInit, OnDestroy {
  @Input() service: any;
  statusColor = '#cdcdcd';
  isLoading = false;
  status = '';
  info = '';
  error = '';
  message = '';
  additionalInfo = [];
  timestamp: number;
  miliseconds = SECONDS * 1000;
  interval: any;

  constructor(public dialog: MatDialog, private healthcheckService: HealthcheckService) { }

  ngOnInit(): void {
    this.getHealthStatus();
    this.interval = setInterval(() => {
      this.getHealthStatus();
    }, this.miliseconds);
  }

  onReloadClick() {
    this.statusColor = '#cdcdcd';
    this.getHealthStatus();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private getHealthStatus() {
    this.statusColor = '#cdcdcd';
    this.isLoading = true;
    this.healthcheckService.getServiceHealthStatus(this.service.endpoint)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        response => {
          this.status = response.status;
          this.info = response.info;
          if (this.status === 'down') {
            this.error = response.error;
          } else {
            this.message = response.message;
          }
          this.additionalInfo = response['additional_info'] ? response['additional_info'] : [];
          this.statusColor = this.healthcheckService.getColorByStatus(this.status);
          this.timestamp = Date.now();
        },
        err => {
          console.log(err);
        }
      );
  }

  onMessageInfoClick() {
    const dialogRef = this.dialog.open(InfoMessageDialogComponent, {
      data: {
        infoMessages: this.additionalInfo
      },
      width: '40%',
      height: '70%'
    });
  }
}
