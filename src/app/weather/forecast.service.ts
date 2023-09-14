import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {
  map,
  mergeMap,
  switchMap,
  filter,
  toArray,
  share,
  tap,
  catchError,
  retry,
} from 'rxjs/operators';
import { NotificationsService } from '../notifications/notifications.service';
import {
  OpenWeatherResponse,
  ForecastData,
  Coordinates,
} from './interfaces/weather.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) {}

  getForecast(): Observable<ForecastData[]> {
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
        return of({
          list: [{ dt_txt: '1990-08-01 00:00:00', main: { temp: 0 } }],
        });
      }),
      map(value => value.list),
      mergeMap(value => of(...value)),
      filter((_, index) => index % 8 === 0),
      map(value => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp,
        };
      }),
      toArray(),
      share()
    ) as Observable<ForecastData[]>;
  }

  getCurrentLocation(): Observable<Coordinates> {
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
      catchError(err => {
        this.notificationsService.addError('Failed to get your location');
        return throwError(() => new Error(err));
      })
    );
  }
}
