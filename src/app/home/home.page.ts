import { Component } from '@angular/core';

import {DataFetcherService} from "../services/data-fetcher.service";
import {Observable} from "rxjs";
import {Channel} from "../models/channel";
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    layout: {
      padding: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    },
    scales: {
      x: {
        axis: 'x',
        grid: {
          drawBorder: false,
          display: false
        },
        ticks: {
          display: true
        }
      },
      y: {
        axis: 'y',
        min: 0,
        grid: {
          drawBorder: false,
          display: true,
          drawTicks: false
        },
        ticks: {
          padding: 10
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public lineChartType: ChartType = 'line';
  lineChartData: any;

  public chdata: Channel;

  constructor(public dfs: DataFetcherService) {

    this.lineChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Level',
          data: [980, 232, 601, 434, 1090, 1230, 1720],
          borderColor: '#035388',
          backgroundColor: 'rgba(3,83,136,0.4)'

        },
        {
          label: 'Revenue',
          data: [120, 699, 1203, 1700, 1200, 1100, 1900]
        }
      ]
    };
  }


  ionViewWillEnter(){
    this.refresh();


  }

  refresh(){
    this.dfs.httpChannelinfo().subscribe((r)=>{
      this.chdata = r;
      console.log(this.chdata);
  }

  );
  }

}
