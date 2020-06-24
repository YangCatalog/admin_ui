import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogsFilterService } from '../../logs-filter.service';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
    logsFilterForm: FormGroup;
    fileNames: Array<string> = [];
    levelOptions: Array<string> = ['INFO', 'DEBUG', 'ERROR', 'WARNING'];
    displayedColumns: string[] = ['timestamp', 'level', 'class', 'message', 'lineNumber'];
    filteredLogsDataSource;
    isLoading = false;

    // MatPaginator Inputs
    paginatorOptions = {
        length: 1,
        pageSize: 1,
        pageIndex: 1,
        pageSizeOptions: [100, 250, 500, 1000]
    };

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private formBuilder: FormBuilder, private logsFilterService: LogsFilterService) {}

    ngOnInit(): void {
        this.buildForm();
        this.isLoading = true;
        this.logsFilterService
            .fetchLogsFileNames()
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(
                response => {
                    // Sort filenames alphabetically
                    this.fileNames = response.data.sort((a: string, b: string) => {
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    });
                },
                err => {
                    console.log(err);
                }
            );
    }

    submitForm() {
        if (!this.logsFilterForm.valid) {
            return;
        }
        const formData = this.getDirtyValues(this.logsFilterForm);
        this.isLoading = true;
        this.logsFilterForm.disable();
        this.filteredLogsDataSource = null;
        this.logsFilterService
            .getLogs(formData)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                    this.logsFilterForm.enable();
                })
            )
            .subscribe(
                response => {
                    const parsedOutput = response.meta.format ? this.parseOutput(response.output) : response.output;
                    // this.setPaginatorValues(response.meta['lines-per-page'], response.meta.page, response.meta.pages);
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
            'file-name': this.formBuilder.control(null, Validators.required),
            'lines-per-page': this.formBuilder.control(1000, [Validators.min(1), Validators.max(4294967295)]),
            page: this.formBuilder.control(1, [Validators.min(1)]),
            'from-date': this.formBuilder.control(''),
            filter: this.formBuilder.group({
                'match-case': this.formBuilder.control(false),
                'match-words': this.formBuilder.control(false),
                'search-for': this.formBuilder.control(''),
                'filter-out': this.formBuilder.control(''),
                level: this.formBuilder.control(null)
            })
        });
    }

    private parseOutput(output: string[]): any[] {
        const parsedOutput = [];

        output.forEach(line => {
            const splittedLine = line.split(' ').filter(f => f !== '');
            const parsedLine = {
                timestamp: splittedLine.slice(0, 2).join(' '),
                level: splittedLine[2],
                class: splittedLine[3],
                message: splittedLine.slice(5, -2).join(' '),
                lineNumber: splittedLine.slice(-1)
            };
            parsedOutput.push(parsedLine);
        });
        return parsedOutput;
    }

    private getDirtyValues(form: any) {
        const dirtyValues = {};

        Object.keys(form.controls).forEach(key => {
            const currentControl = form.controls[key];

            if (currentControl.dirty && currentControl.value !== '' && currentControl.value !== null) {
                if (currentControl.controls) dirtyValues[key] = this.getDirtyValues(currentControl);
                else dirtyValues[key] = currentControl.value;
            }
        });
        if (dirtyValues['from-date']) {
            dirtyValues['from-date'] = this.convertToTimestamp(dirtyValues['from-date']);
        }
        return dirtyValues;
    }

    private convertToTimestamp(time: any): number {
        // By default in miliseconds = divide by 1000
        return Math.round(new Date(time).getTime() / 1000);
    }

    private setPaginatorValues(lines: number, page: number, pages: number) {
        console.log('lines ' + lines);
        console.log('page ' + page);
        console.log('pages ' + pages);

        this.paginatorOptions.length = pages;
        this.paginatorOptions.pageIndex = page;
        this.paginatorOptions.pageSize = lines;
    }
}
