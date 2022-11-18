import { Component, ViewChild } from '@angular/core';

import {DataFetcherService} from "../services/data-fetcher.service";
import {interval, Observable} from "rxjs";
import {Channel} from "../models/channel";
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import {ActionSheetButton, ActionSheetController, IonModal} from "@ionic/angular";
import { BaseChartDirective } from 'ng2-charts';
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @ViewChild(IonModal) modal: IonModal;

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
  private menuButton: Array<ActionSheetButton>;
  alarm: Channel;
  private dataMode: number;

  constructor(public dfs: DataFetcherService,public actionSheetController: ActionSheetController,public activatedRoute: ActivatedRoute,private _location: Location) {
    this.updateMenu();
    this.dataMode = 0;
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
    this.activatedRoute.params.subscribe(params =>this.activeChannel = params['chid']);
    this.refresh();
    interval(5 *1000).subscribe((r)=>{
      //  this.chdata = r;
      this.refresh();
      console.log(r);
    });

  }

  refresh(){



    this.dfs.httpChannelinfo(this.activeChannel).subscribe((r)=>{
      this.chdata = r;
      this.updateChart();

   });



  }

  updateChart(){
   this.lineChartData.labels=[];
   this.lineChartData.datasets[0].data=[]; //.shift();
   this.lineChartData.datasets[1].data=[];
   this.lineChartData.datasets[2].data=[];
   this.lineChartData.datasets[0].label = this.chdata.name;


    this.dfs.httpChannelTrend(this.activeChannel,this.dataMode).subscribe((r)=>{
     // this.chdata = r;
      console.log(r);
      r.forEach((row)=>{
        this.lineChartData.labels.push(new Date(row.CreatedAt).toLocaleTimeString());
       // this.lineChartData.datasets[0].data.push(Math.floor(Math.random() * row.value));
        console.log('Row : ',row);
        this.lineChartData.datasets[0].data.push(row.Realvalue);
        this.lineChartData.datasets[1].data.push( this.chdata.alarm_max);
        this.lineChartData.datasets[2].data.push( this.chdata.alarm_min);

      });


      console.log('d = ', this.lineChartData.datasets[0].data);
      this.chart.chart.update();



    });


  }

  updateMenu(){

    this.menuButton=[];
    this.dfs.httpAllChannel().subscribe((r)=>{
      r.forEach((row)=>{
        this.menuButton.push(
        {
            text: row.group_name.concat(' ',row.name),
            icon: 'heart',
            data: row.id,
            handler: () => {
             console.log('Clicked '+row.id);
              this.activeChannel = row.id;
              this.refresh();
            }
        }
        );
      });
    });
    this.menuButton.push(
     {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
  }

  async presentActionMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change Channel',
      cssClass: 'my-custom-class',
      buttons: this.menuButton
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  setAlarm() {

     this.dfs.httpChannelsave(this.alarm).subscribe((r)=>{
         this.chdata = r;
     });
  }

  confirmChangeAlarm() {
    this.modal.dismiss(null, 'confirm');
    this.setAlarm();
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: any) {
    // const ev = event as CustomEvent<OverlayEventDetail<string>>;
    // if (ev.detail.role === 'confirm') {
    //   this.message = `Hello, ${ev.detail.data}!`;
    //}
  }

  openAlarmModel() {
    this.alarm=this.chdata;
    this.modal.present().then(r => console.log(r));
  }

  backToGroup() {
    this._location.back();
  }

  setMode(number: number) {
    this.dataMode = number;
  }
}
