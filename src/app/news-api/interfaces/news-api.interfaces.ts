export interface Article {
  title: string;
  url: string;
  source: {
    name: string;
  };
}

export interface NewsApiResponse {
  totalResults: number;
  articles: Article[];
}
