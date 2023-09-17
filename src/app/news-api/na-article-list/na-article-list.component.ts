import { Component, OnInit, TemplateRef } from '@angular/core';
import { NewsApiService } from '../news-api.service';
import { Article } from '../interfaces/news-api.interfaces';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.scss'],
})
export class NaArticleListComponent implements OnInit {
  articles$: Observable<Article[]>;
  error: Error | null = null;

  constructor(private newsApiService: NewsApiService) {}

  ngOnInit(): void {
    this.articles$ = this.newsApiService.getPage(1).pipe(
      tap({
        error: error => {
          this.error = error.message;
        },
      })
    );
  }
}
