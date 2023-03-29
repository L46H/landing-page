import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ForecastService } from '../forecast.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
  forecast$: Observable<{ dateString: string; temp: number }[]>;

  constructor(forecastService: ForecastService) {
    this.forecast$ = forecastService.getForecast();
  }
}
