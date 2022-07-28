import { Component, ViewChild } from '@angular/core';

import {DataFetcherService} from "../services/data-fetcher.service";
import {interval, Observable} from "rxjs";
import {Channel} from "../models/channel";
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import {ActionSheetController} from "@ionic/angular";
import { BaseChartDirective } from 'ng2-charts';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

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
        display:true,
        grid: {
          drawBorder: true,
          display: false,
          color: '#230b47'
        },title: {
          display: true,
          text: 'Timestamp'
        },
        ticks: {
          display: true,
          color: '#9ab45d'

        }
      },
      y: {
        axis: 'y',
        min: 0,
        grid: {
          drawBorder: true,
          display: true,
          drawTicks: true,
          color: '#230b47'
        },
        ticks: {
          padding: 10
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    },

  };

  public lineChartType: ChartType = 'line';
  lineChartData: any;

  public chdata: Channel;
  private activeChannel:number;

  constructor(public dfs: DataFetcherService,public actionSheetController: ActionSheetController) {

    this.lineChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

      datasets: [
        {
          label: 'Level',
          data: [],
          borderColor: '#035388',
          backgroundColor: 'rgba(3,83,136,0.4)'

        },
        {
          label: 'Alarm Max',
          data: [],
          borderColor: '#9e0000',
         // backgroundColor: '#000000'

        },
        {
          label: 'Alarm Min',
          data: [],
          borderColor: '#016113',
          // backgroundColor: '#000000'

        }
      ]
    };

    this.activeChannel = 1;

  }


  ionViewWillEnter(){
    this.refresh();
    interval(10 *1000).subscribe((r)=>{
      //  this.chdata = r;
      this.refresh();
      console.log(r);
    });

  }

  refresh(){



    this.dfs.httpChannelinfo(this.activeChannel).subscribe((r)=>{
      this.chdata = r;
      console.log(this.chdata);
       this.updateChart();

   });



  }

  updateChart(){
   this.lineChartData.labels=[];
   this.lineChartData.datasets[0].data.shift();
   this.lineChartData.datasets[1].data=[];
   this.lineChartData.datasets[2].data=[];
   this.lineChartData.datasets[0].label = this.chdata.name;


    this.dfs.httpChannelTrend().subscribe((r)=>{
     // this.chdata = r;
      console.log(r);
      r.forEach((row)=>{
        this.lineChartData.labels.push(row.snapdatetime);
        this.lineChartData.datasets[0].data.push(Math.floor(Math.random() * row.value));
        this.lineChartData.datasets[1].data.push( this.chdata.alarm_max);
        this.lineChartData.datasets[2].data.push( this.chdata.alarm_min);

      });


      console.log('w =',this.chart.chart.width, this.chdata.alarm_max);
      this.chart.chart.update();



    });


  }

  async presentActionMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change Channel',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Level Sungai',
        role: 'destructive',
        icon: 'trash',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Power Usage',
        icon: 'share',
        data: 10,
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Temperature',
        icon: 'caret-forward-circle',
        data: 'Data value',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Oxygen Level',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  setAlarm() {

  }
}
