import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilesService } from '../../files.service';
import { Subscription } from 'rxjs';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-files-size-graph',
  templateUrl: './files-size-graph.component.html',
  styleUrls: ['./files-size-graph.component.scss']
})
export class FilesSizeGraphComponent implements OnInit, OnDestroy {
  folderChartLabels: Label[];
  foldersChartData: number[];
  foldersChartTitle: string;

  diskUsageChartLabels: Label[];
  diskUsageChartData: number[];
  diskUsageChartTitle = 'Disk usage';
  diskUsageChartColors: Color[];

  private homeDirectory = '/var/yang';
  private subscription = new Subscription();
  constructor(readonly filesService: FilesService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.filesService.currentMessage$.subscribe(response => {
        if (response != null) {
          this.folderChartLabels = [];
          this.foldersChartData = [];

          response.folders.forEach(folder => {
            this.folderChartLabels.push(folder.name);
            this.foldersChartData.push(folder.size);
          });

          if (response.files.length > 0) {
            let filesSizeSum = 0;
            response.files.forEach(file => filesSizeSum += file.size);
            this.folderChartLabels.unshift('Files in a folder');
            this.foldersChartData.unshift(<any>filesSizeSum);
          }
        }
      })
    );

    this.subscription.add(
      this.filesService.currentPath$.subscribe((path: string) => {
        this.foldersChartTitle = path === '' ? this.homeDirectory : `${this.homeDirectory}${path}`;
      })
    );

    this.getDiskUsageData();
  };

  ngOnDestroy() {
    this.filesService.currentMessage$.next(null);
    this.subscription.unsubscribe();
  }

  private getDiskUsageData() {
    this.filesService.getDiskUsage().subscribe(response => {
      const diskUsageData = response.data;

      this.diskUsageChartData = [];
      this.diskUsageChartData.push(diskUsageData.free);
      this.diskUsageChartData.push(diskUsageData.used);

      this.diskUsageChartLabels = ['Free space', 'Used space'];
      this.diskUsageChartColors = [{ backgroundColor: ['#95d37d', '#f0514c'] }];
    });
  }
}
