import { Component, OnInit } from '@angular/core';
import { NewsApiService } from '../news-api.service';
import { Article } from '../interfaces/news-api.interfaces';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.scss'],
})
export class NaArticleListComponent implements OnInit {
  articles: Article[] = [];

  constructor(private newsApiService: NewsApiService) {}

  ngOnInit(): void {
    this.newsApiService.initializePageStream();

    this.newsApiService.pagesOutput.subscribe(articles => {
      this.articles = articles;
    });

    this.newsApiService.getPage(2);
  }
}
