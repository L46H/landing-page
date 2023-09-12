import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Article, NewsApiResponse } from './interfaces/news-api.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 15;
  private apiKey = '0de1cca8854b4c7ca4e00784b97dd5c6';
  private country = 'us';

  constructor(private http: HttpClient) {}

  getPage(page: number): Observable<Article[]> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('country', this.country)
      .set('pageSize', this.pageSize.toString())
      .set('page', page.toString());

    return this.http.get<NewsApiResponse>(this.url, { params }).pipe(
      delay(1000),
      map(response => response.articles)
    );
  }
}
