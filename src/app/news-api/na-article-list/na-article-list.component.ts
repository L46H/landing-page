import { Component } from '@angular/core';
import { Article } from '../news-api.service';
import { NewsApiService } from '../news-api.service';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.scss']
})
export class NaArticleListComponent {
  articles: Article[];

  constructor(private newsApiService: NewsApiService) {}

  ngOnInit(): void {
    this.newsApiService.pagesOutput.subscribe(articles => {
      this.articles = articles;
    });

    this.newsApiService.getPage(2);
  }
}
