export interface Channel {


  id: number;
  group_name:string;
  name: string;
  unit: string;
  value: number;
  alarm_min: number;
  alarm_max: number;
  alarm_mid_on: number;
  alarm_mid_off: number;



}

export interface trend {
  id: number;
  CreatedAt: string;
  channel: number;
  Realvalue: number;
  Rawvalue:number;
}


