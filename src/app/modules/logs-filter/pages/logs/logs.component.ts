import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { LogsFilterService } from '../../logs-filter.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logsFilterForm: FormGroup;
  fileNames: Array<string> = [];
  levelOptions: Array<string> = ['', 'INFO', 'WARNING', 'DEBUG', 'ERROR'];
  displayedColumns: string[] = [];
  filteredLogsDataSource;
  isTableLoading = false;
  isFormLoading = false;
  allFiles = false;

  // MatPaginator Inputs
  paginatorOptions = {
    length: 1,
    pageSize: 1000,
    pageIndex: 0,
    pageSizeOptions: [100, 250, 500, 1000]
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder, private logsFilterService: LogsFilterService) { }

  ngOnInit(): void {
    this.buildForm();
    this.isFormLoading = true;
    this.logsFilterService
      .fetchLogsFileNames()
      .pipe(finalize(() => (this.isFormLoading = false)))
      .subscribe(
        response => {
          // Sort filenames alphabetically
          this.fileNames = response.data.sort((a: string, b: string) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          });
        },
        err => {
          console.log('ERROR: ' + err);
        }
      );
  }

  onFormSubmit() {
    if (!this.logsFilterForm.valid) {
      return;
    }
    const formData = this.getFormData(this.logsFilterForm);
    this.getLogsByFilter(formData);
  }

  onPageChange(e: PageEvent) {
    const formData = this.getFormData(this.logsFilterForm);
    formData['lines-per-page'] = e.pageSize;
    formData['page'] = e.pageIndex + 1;
    this.getLogsByFilter(formData);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2 || filterValue.length === 0) {
      this.filteredLogsDataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  setAll(checked: boolean) {
    this.allFiles = checked;
    if (this.allFiles) {
      this.logsFilterForm.get('file-names').setValue(this.fileNames);
    } else {
      this.logsFilterForm.get('file-names').setValue([]);
    }
  }

  private getLogsByFilter(formData: any) {
    this.isTableLoading = true;
    this.logsFilterForm.disable();
    this.filteredLogsDataSource = null;
    this.logsFilterService
      .getLogs(formData)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
          this.logsFilterForm.enable();
        })
      )
      .subscribe(
        response => {
          const parsedOutput = this.parseResponse(response);
          this.setPaginatorValues(response.meta['lines-per-page'], response.meta.page, response.meta.pages);
          this.filteredLogsDataSource = new MatTableDataSource<any>(parsedOutput);
          this.filteredLogsDataSource.paginator = this.paginator;
        },
        err => {
          console.log('ERROR: ' + err);
        }
      );
  }

  private buildForm() {
    this.logsFilterForm = this.formBuilder.group({
      'file-names': this.formBuilder.control(null, Validators.required),
      'lines-per-page': this.formBuilder.control(1000, [Validators.min(1), Validators.max(4294967295)]),
      page: this.formBuilder.control(1, [Validators.min(1)]),
      'from-date': this.formBuilder.control(''),
      'to-date': this.formBuilder.control(''),
      filter: this.formBuilder.group({
        'match-case': this.formBuilder.control(false),
        'match-words': this.formBuilder.control(false),
        'search-for': this.formBuilder.control(''),
        'filter-out': this.formBuilder.control(''),
        level: this.formBuilder.control(null)
      })
    });
  }

  // Different parsing and displaying based on whether the logs are formatted or not
  private parseResponse(response: any) {
    let parsedData: any[] = [];
    if (response.meta.format) {
      parsedData = this.parseFormatedData(response.output);
      this.displayedColumns = ['timestamp', 'level', 'filename', 'class', 'message', 'lineNumber'];
    } else {
      parsedData = this.parseData(response.output);
      this.displayedColumns = ['message'];
    }
    return parsedData;
  }

  private parseFormatedData(output: string[]): any[] {
    const parsedOutput = [];

    output.forEach(line => {
      const splittedLine = line.split(' ').filter(f => f !== '');
      const parsedLine = {
        timestamp: splittedLine.slice(0, 2).join(' '),
        level: splittedLine[2],
        filename: splittedLine[3],
        class: splittedLine[4],
        message: '',
        lineNumber: ''
      };
      // Traceback logs have different format (position of line number not at the very end
      if (this.logsFilterService.isTracebackMessage(line)) {
        const tracebackWord = splittedLine.find(word => word.includes('Traceback'));
        parsedLine.message = splittedLine.slice(6).join(' ');
        parsedLine.lineNumber = tracebackWord.split('\n')[0];
      } else {
        parsedLine.message = splittedLine.slice(6, -2).join(' ');
        parsedLine.lineNumber = [...splittedLine.slice(-1)].pop();
      }
      parsedOutput.push(parsedLine);
    });
    return parsedOutput;
  }

  private parseData(output: string[]): any[] {
    const parsedOutput = [];

    output.forEach(line => {
      if (line !== '') {
        parsedOutput.push({
          message: line
        });
      }
    });

    return parsedOutput;
  }

  private getFormData(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls).forEach(key => {
      const currentControl = form.controls[key];

      if (currentControl.dirty && currentControl.value !== '' && currentControl.value !== null) {
        if (currentControl.controls) dirtyValues[key] = this.getFormData(currentControl);
        else dirtyValues[key] = currentControl.value;
      }
    });
    if (dirtyValues['from-date']) {
      dirtyValues['from-date'] = this.logsFilterService.datetimeToTimestamp(dirtyValues['from-date']);
    }
    if (dirtyValues['to-date']) {
      dirtyValues['to-date'] = this.logsFilterService.datetimeToTimestamp(dirtyValues['to-date']);
    }
    return dirtyValues;
  }

  private setPaginatorValues(pageSize: number, pageIndex: number, pages: number) {
    this.paginatorOptions.length = pageSize * pages;
    this.paginatorOptions.pageIndex = pageIndex;
    this.paginatorOptions.pageSize = pageSize;
  }
}
