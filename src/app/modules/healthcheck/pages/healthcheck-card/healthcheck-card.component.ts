import { Component, OnInit, Input } from '@angular/core';
import { HealthcheckService } from '../../healthcheck.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-healthcheck-card',
  templateUrl: './healthcheck-card.component.html',
  styleUrls: ['./healthcheck-card.component.scss']
})
export class HealthcheckCardComponent implements OnInit {
  @Input() serviceName: string;
  statusColor = '#cdcdcd';
  isLoading = false;
  status = '';
  info = '';
  error = '';
  message = '';

  constructor(private healthcheckService: HealthcheckService) { }

  ngOnInit(): void {
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
        },
        err => {
          console.log(err);
        }
      );
  }
}
