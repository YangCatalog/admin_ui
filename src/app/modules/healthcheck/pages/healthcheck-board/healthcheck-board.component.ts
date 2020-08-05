import { Component, OnInit } from '@angular/core';
import { HealthcheckService } from '../../healthcheck.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-healthcheck-board',
  templateUrl: './healthcheck-board.component.html',
  styleUrls: ['./healthcheck-board.component.scss']
})
export class HealthcheckBoardComponent implements OnInit {
  isLoading = false;
  servicesList: string[];
  error = false;

  constructor(private healthcheckService: HealthcheckService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.healthcheckService.fetchServicesList()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        response => {
          this.servicesList = response;
        },
        err => {
          this.error = true;
          console.log(err);
        }
      );
  }
}
