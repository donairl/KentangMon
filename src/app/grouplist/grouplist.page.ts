import { Component, OnInit } from '@angular/core';
import {interval} from "rxjs";
import {DataFetcherService} from "../services/data-fetcher.service";
import {ActionSheetController} from "@ionic/angular";
import {Channel} from "../models/channel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.page.html',
  styleUrls: ['./grouplist.page.scss'],
})
export class GrouplistPage implements OnInit {
  public chdatas: Channel[];

  constructor(public dfs: DataFetcherService,public router:Router)  { }

  ngOnInit() {
  }

  ionViewWillEnter(){

    this.refresh();
    interval(30 *1000).subscribe((r)=>{
      //  this.chdata = r;
      this.refresh();
      console.log(r);
    });

  }

  private refresh() {
      this.dfs.httpAllChannel().subscribe((r)=>{
        console.log(r);
        this.chdatas = r;
      });
  }


  popDetail(chid:any) {
    this.router.navigateByUrl('/home/'+chid);
  }
}
