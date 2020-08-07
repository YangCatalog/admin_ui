import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HealthcheckService } from '../../healthcheck.service';
import { finalize } from 'rxjs/operators';

const SECONDS = 60;

@Component({
  selector: 'app-healthcheck-card',
  templateUrl: './healthcheck-card.component.html',
  styleUrls: ['./healthcheck-card.component.scss']
})
export class HealthcheckCardComponent implements OnInit, OnDestroy {
  @Input() serviceName: string;
  statusColor = '#cdcdcd';
  isLoading = false;
  status = '';
  info = '';
  error = '';
  message = '';
  timestamp: number;
  miliseconds = SECONDS * 1000;
  interval: any;

  constructor(private healthcheckService: HealthcheckService) { }

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
    this.isLoading = true;
    this.healthcheckService.getServiceHealthStatus(this.serviceName)
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
          this.statusColor = this.healthcheckService.getColorByStatus(this.status);
          this.timestamp = Date.now();
        },
        err => {
          console.log(err);
        }
      );
  }
}
