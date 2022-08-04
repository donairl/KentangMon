import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {catchError, retry} from 'rxjs/operators'
import {Channel, trend} from '../models/channel';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {
  private rootApi = 'http://localhost:8081';


  constructor(public http:HttpClient) { }

  public httpChannelinfo(channelNo): Observable<Channel> {


    return this.http.get<Channel>(this.rootApi + '/channelinfo/'+channelNo).pipe(
      retry(2),
      catchError(this.handleError)
    );

  }

  public httpChannelsave(body:Channel): Observable<Channel> {


    return this.http.put<Channel>(this.rootApi + '/channelinfo/'+body.id,body).pipe(
      retry(2),
      catchError(this.handleError)
    );

  }

  public httpAllChannel(): Observable<Channel[]> {


    return this.http.get<Channel[]>(this.rootApi + '/channelinfo').pipe(
      retry(2),
      catchError(this.handleError)
    );

  }
  public httpChannelTrend(): Observable<trend[]> {


    return this.http.get<trend[]>(this.rootApi + '/trend').pipe(
      retry(3),
      catchError(this.handleError)
    );

  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message

    return throwError(
      'Something bad happened; please try again later.');
  }

}
