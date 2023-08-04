import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Article, NewsApiResponse } from './interfaces/news-api.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '0de1cca8854b4c7ca4e00784b97dd5c6';
  private country = 'us';

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;

  constructor(private http: HttpClient) {}

  private createArticlesObservable(): void {
    this.pagesOutput = this.pagesInput.pipe(
      map(page => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', this.pageSize.toString())
          .set('page', page.toString());
      }),
      switchMap(params => this.http.get<NewsApiResponse>(this.url, { params })),
      map(response => response.articles)
    );
  }

  initializePageStream(): void {
    this.pagesInput = new Subject<number>();
    this.createArticlesObservable();
  }

  getPage(page: number): void {
    this.pagesInput.next(page);
  }
}
