import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ForecastService } from '../forecast.service';
import { ForecastData } from '../forecast.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent implements OnInit{
  forecast$: Observable<ForecastData[]>;

  constructor(private forecastService: ForecastService) {}

  ngOnInit(): void {
    this.forecast$ = this.forecastService.getForecast();
  }
}