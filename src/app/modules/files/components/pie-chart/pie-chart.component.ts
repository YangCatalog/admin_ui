import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, SingleDataSet, Color } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() title: string;
  @Input() labels: Label[];
  @Input() data: SingleDataSet[];
  @Input() colors?: Color[];

  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    legend: {
      position: 'right',
    },
    responsive: true,
    aspectRatio: 3,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const bytes = this.formatBytes(parseInt(data.datasets[0].data[tooltipItem.index].toString(), 10));
          const folderName = data.labels[tooltipItem.index];
          return ' ' + folderName + ' ' + bytes;
        }
      }
    }
  };

  constructor() { }

  ngOnInit(): void { }

  // Transform bytes to more user-friendly format
  private formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
