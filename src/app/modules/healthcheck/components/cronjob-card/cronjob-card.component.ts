import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageDialogComponent } from '../../dialogs/error-message-dialog/error-message-dialog.component';
import { InfoMessageDialogComponent } from '../../dialogs/info-message-dialog/info-message-dialog.component';
import { HealthcheckService } from '../../healthcheck.service';

@Component({
  selector: 'app-cronjob-card',
  templateUrl: './cronjob-card.component.html',
  styleUrls: ['./cronjob-card.component.scss']
})
export class CronjobCardComponent implements OnInit {
  @Input() cronjobName: string;
  @Input() cronjobData: any;
  statusColor = '#cdcdcd';
  status = '';
  errorMessage = '';
  infoMessages = [];
  startDate: Date;
  endDate: Date;
  lastSuccessfullDate: Date;
  isLoading = false;
  constructor(public dialog: MatDialog, private healthcheckService: HealthcheckService) { }

  ngOnInit(): void {
    this.status = this.cronjobData.status;
    this.startDate = new Date(this.cronjobData.start * 1000);
    this.endDate = new Date(this.cronjobData.end * 1000);
    this.lastSuccessfullDate = this.cronjobData['last_successfull'] ? new Date(this.cronjobData['last_successfull'] * 1000) : null;
    this.errorMessage = this.cronjobData.error;
    this.infoMessages = this.cronjobData.messages;
    this.statusColor = this.healthcheckService.getColorByStatus(this.status);
  }

  onErrorInfoClick() {
    const dialogRef = this.dialog.open(ErrorMessageDialogComponent, {
      data: {
        errorMessage: this.errorMessage
      },
      width: '40%',
      height: '30%'
    });
  }

  onMessageInfoClick() {
    const dialogRef = this.dialog.open(InfoMessageDialogComponent, {
      data: {
        infoMessages: this.infoMessages
      },
      width: '40%',
      height: '30%'
    });
  }
}
