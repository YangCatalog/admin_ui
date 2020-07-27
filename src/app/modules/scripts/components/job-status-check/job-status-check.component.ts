import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScriptsService } from '../../scripts.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-job-status-check',
  templateUrl: './job-status-check.component.html',
  styleUrls: ['./job-status-check.component.scss']
})
export class JobStatusCheckComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  response;
  error = false;

  constructor(
    private formBuilder: FormBuilder,
    private scriptsService: ScriptsService
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      jobId: ['', Validators.required]
    });
  }

  onSubmit() {
    this.error = false;
    this.isLoading = true;
    this.response = null;
    this.scriptsService.getJobStatus(this.form.value.jobId)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(
      response => {
        if (response?.info?.result) {
          this.response = response;
        } else {
          this.error = true;
        }
      },
      err => {
        this.error = true;
      }
    );
  }
}
