import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ScriptsService } from '../../scripts.service';

const SECONDS = 10;

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent implements OnInit, OnDestroy {
  @Input() job;
  interval;
  status = '';
  reason = '-';
  error = false;
  sec = SECONDS;
  isLoading = true;
  changeSubscription: Subscription;

  constructor(private scriptsService: ScriptsService) { }

  ngOnInit(): void {
    this.getStatus();

    this.changeSubscription = this.scriptsService.change$
      .subscribe(
        subs => {
          if (subs === 'clear-finished') {
            if (this.status !== 'In progress') {
              this.scriptsService.removeJob({
                jobId: this.job.jobId,
                finished: true
              });
            } else {
              this.scriptsService.removeJob({
                jobId: this.job.jobId,
                finished: false
              });
            }
          }
        }
      );
  }

  startTimer() {
    if (typeof this.interval === 'undefined') {
      this.interval = setInterval(() => {
        this.sec--;
        if (this.sec === 0) {
          this.getStatus();
        }
      }, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  getStatus() {
    this.isLoading = true;
    this.sec = SECONDS;
    this.scriptsService.getJobStatus(this.job.jobId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        response => {
          if (response?.info?.result) {
            switch (response.info.result) {
              case 'In progress':
                this.status = response.info.result;
                this.startTimer();
                break;
              case 'Failed':
                this.status = response.info.result;
                this.stopTimer();
                break;
              case 'Finished successfully':
                this.status = response.info.result;
                this.stopTimer();
                break;
              case 'Partially done':
                this.status = response.info.result;
                this.stopTimer();
                break;
              default:
                this.error = true;
                this.stopTimer();
            }
            this.reason = response.info.reason;
          } else {
            this.error = true;
            this.stopTimer();
          }
        },
        err => {
          this.error = true;
          this.stopTimer();
        }
      );
  }

  ngOnDestroy() {
    this.changeSubscription.unsubscribe();
  }

}
