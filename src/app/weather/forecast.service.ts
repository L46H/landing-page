import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap, switchMap, filter, toArray, share, tap, catchError, retry } from 'rxjs/operators';
import { NotificationsService } from '../notifications/notifications.service';

interface Coordinates {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
}

interface OpenWeatherResponse {
  // inside array each element is gonna be obj
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
  }[];
}

export interface ForecastData {
  dateString: string;
  temp: number;
}

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) { }

  getForecast() {
    return this.getCurrentLocation().pipe(
      map(coords => {
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metric')
          .set('appid', 'e4443779dce4cf41ee40eb0b3504a514');
      }),
      switchMap(params =>
        this.http.get<OpenWeatherResponse>(this.url, { params })
      ),
      tap(() => this.notificationsService.addSuccess('Connected to Weather')),
      catchError(() => {
        this.notificationsService.addError('Failed to connected to Weather');
        // returning alternative observable if failed to fetch current location
        return of({ list: [{ dt_txt: '1990-08-01 00:00:00', main: { temp: 0 } }] });
      }),
      map(value => value.list),
      // take array of records and breaks it up into sigle records objects
      mergeMap(value => of(...value)),
      filter((value, index) => index % 8 === 0),
      map(value => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp,
        };
      }),
      toArray(),
      // turn into multicast
      share()
      // here is more than 9 operators,
      // pipe() stops inferring the type and will just return a default type of Observable<{}>
      // so you'll have to assert the type manually:
    ) as Observable<ForecastData[]>;
  }

  getCurrentLocation() {
    return new Observable<Coordinates>(observer => {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          observer.next(position.coords);
          observer.complete();
        },
        err => observer.error(err)
      );
    }).pipe(
      retry(2),
      tap(() => {
        this.notificationsService.addSuccess('Got your location');
      }),
      catchError((err) => {
        // #1 handle error
        this.notificationsService.addError('Failed to get your location');
        // 2# throw error away to the further processing pipeline
        return throwError(() => new Error(err));
      })
    );
  }
}
