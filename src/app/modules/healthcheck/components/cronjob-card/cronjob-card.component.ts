import { Component, OnInit, Input } from '@angular/core';
import { HealthcheckService } from '../../healthcheck.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageDialogComponent } from '../../dialogs/error-message-dialog/error-message-dialog.component';

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
    this.statusColor = this.healthcheckService.getColorByStatus(this.status);
  }

  onInfoClick() {
    const dialogRef = this.dialog.open(ErrorMessageDialogComponent, {
      data: {
        errorMessage: this.errorMessage
      }
    });
  }
}
