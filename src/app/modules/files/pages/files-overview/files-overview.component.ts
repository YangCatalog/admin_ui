import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FilesService } from '../../files.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { Subscription } from 'rxjs';
import { LogsFilterModule } from 'src/app/modules/logs-filter/logs-filter.module';
import { FolderComponent } from '../../components/folder/folder.component';

@Component({
  selector: 'app-files-overview',
  templateUrl: './files-overview.component.html',
  styleUrls: ['./files-overview.component.scss']
})
export class FilesOverviewComponent implements OnInit, OnDestroy {
  treeChangeSubscription: Subscription;

  @ViewChild('root') private root: FolderComponent;

  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
    this.treeChangeSubscription = this.filesService.subject$.subscribe(
      data => {
        this.root.reinit();
      }
    );
  }

  ngOnDestroy() {
    this.treeChangeSubscription.unsubscribe();
  }
}
