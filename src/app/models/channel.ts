export interface Channel {


  id: number;
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
  snapdatetime: string;
  channel: number;
  value: number;
}

export interface Ialarm {
  alarm_min:number;
  alarm_max:number;
  alarm_mid_on:number;
  alarm_mid_off:number;
}
