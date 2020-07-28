import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScriptsService } from '../../scripts.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs = [];
  changeSubscription: Subscription;
  constructor(private scriptsService: ScriptsService) { }

  ngOnInit(): void {
    this.changeSubscription = this.scriptsService.change$.subscribe(
      subs => {
        if (subs === 'job-stored' || subs === 'reinit') {
          this.init();
        }
      }
    )
    this.init();
  }

  init() {
    this.jobs =  JSON.parse(localStorage.getItem("jobs") || "[]");
  }

  onClearFinished() {
    this.scriptsService.change$.next('clear-finished');
  }

  trackJob(index: number, job: any) {
    return job.jobId;
  }

  ngOnDestroy() {
    this.changeSubscription.unsubscribe();
  }
}
