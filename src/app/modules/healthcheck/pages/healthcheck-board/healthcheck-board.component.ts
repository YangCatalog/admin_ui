import { Component, OnInit } from '@angular/core';
import { HealthcheckService } from '../../healthcheck.service';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-healthcheck-board',
  templateUrl: './healthcheck-board.component.html',
  styleUrls: ['./healthcheck-board.component.scss']
})
export class HealthcheckBoardComponent implements OnInit {
  isLoading = false;
  servicesList: any[];
  cronjobsList: string[];
  cronjobsData: any[];
  error = false;

  constructor(private healthcheckService: HealthcheckService) { }

  ngOnInit(): void {
    this.isLoading = true;
    const services = this.healthcheckService.fetchServicesList();
    const cronjobs = this.healthcheckService.getCronjobsStatus();

    forkJoin([services, cronjobs])
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        response => {
          this.servicesList = response[0];
          this.cronjobsData = response[1].data;
          this.cronjobsList = Object.keys(this.cronjobsData);
        },
        err => {
          this.error = true;
          console.log(err);
        }
      );
  }
}
