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
