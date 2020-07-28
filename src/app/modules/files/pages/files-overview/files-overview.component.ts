import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FilesService } from '../../files.service';
import { Subscription } from 'rxjs';
import { FolderComponent } from '../../components/folder/folder.component';

@Component({
  selector: 'app-files-overview',
  templateUrl: './files-overview.component.html',
  styleUrls: ['./files-overview.component.scss']
})
export class FilesOverviewComponent implements OnInit, OnDestroy {
  treeChangeSubscription: Subscription;
  error = false;

  @ViewChild('root') private root: FolderComponent;

  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
    this.treeChangeSubscription = this.filesService.subject$.subscribe(
      data => {
        if (data === 'files-fetch-error') {
          this.error = true;
        }

        if (data === 'file-delete-ok') {
          this.root.reinit();
        }

        if (data === 'file-delete-error') {
          this.error = true;
        }
      }
    );
  }

  ngOnDestroy() {
    this.treeChangeSubscription.unsubscribe();
  }
}
