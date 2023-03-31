import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

interface NewsApiResponse {
  totalResults: number;
  articles: {
    title: string;
    url: string;
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '0de1cca8854b4c7ca4e00784b97dd5c6';
  private country = 'us';

  pagesInput: Subject<number>;
  pagesOutput: Observable<any>;
  numberOfPages: Subject<number>;

  constructor(private http: HttpClient) {
    this.numberOfPages = new Subject<number>();

    this.pagesInput = new Subject<number>();
    this.pagesOutput = this.pagesInput.pipe(
      map(page => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pagesSize', this.pageSize)
          .set('page', page);
      }),
      switchMap(params => this.http.get<NewsApiResponse>(this.url, { params: params })),
      tap(response => {
        // 55 / 10 = 5.5 -> 6 pages
        const totalPages = Math.ceil(response.totalResults / this.pageSize);
        this.numberOfPages.next(totalPages);
      })
    )
  }
}
