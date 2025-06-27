'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const PAGE_SIZE = 10; // Number of articles per page

// Define Type for an Article
interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  author: string;
  publishedAt: string;
}

// Define Type for API Response
interface NewsAPIResponse {
  articles: Article[];
}

export default function NewsApp() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read search & page params from URL
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";

  // State variables
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState(searchQuery);
  
  // Fetch news from NewsAPI
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(false);

        const url = `https://newsapi.org/v2/everything?q=${searchQuery || "latest"}&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${'3b5bae68baa14bdcadc895bf39781897'}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch news");

        const data: NewsAPIResponse = await res.json();

        // Ensure data.articles is always an array
        setArticles(Array.isArray(data.articles) ? data.articles : []);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, searchQuery]);

  // Debounced Search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.push(`/?search=${search}&page=1`);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, router]);
  
  //for converting the time
  function timeAgo(publishedDate: string): string {
    const published = new Date(publishedDate);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - published.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  }
  

  return (
    <div className="container">

    <header>
        <h1 className="logo">News</h1>
        
    </header>

      <h1>📰 Latest News</h1>

      
      <input
        type="text"
        placeholder="Search news..."
        style={{marginBottom: '10px', borderRadius:'5px'}}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loading & Error Handling */}
      {loading && <p>Loading news...</p>}
      {error && <p style={{ color: "red" }}>Error fetching news. Please try again later.</p>}

      {/* Show Articles */}
      {!loading && !error && (
        <>
          <main className="featured">
            {articles.slice(0, 3).map((article, index) => (
              <div key={index} className="featured-item">
                <Link href={`/news/${encodeURIComponent(article.title)}`}>
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} width="100" />
                  )}
                  <h3>{article.title}</h3>
                  <p>{article.description.slice(0, 80)}</p>
                  <p>{article.author}</p>
                  <p>{timeAgo(article.publishedAt)}</p> 
                  
                </Link>
              </div>
            ))}
          </main>

          <section className="popular">
            <h2>Popular on News</h2>
            <div className="grid">
              {articles.slice(3, 8).map((article, index) => (
                <div key={index} className="grid-item">
                  <Link href={`/news/${encodeURIComponent(article.title)}`}>
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} width="100" />
                  )}
                  <h3>{article.title}</h3>
                  <p>{article.description.slice(0, 80)}</p>
                  <p>{article.author}</p>
                  <p>{timeAgo(article.publishedAt)}</p> 
                  
                </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Pagination */}
          <div>
            {page > 1 && (
              <Link href={`/?search=${search}&page=${page - 1}`}>
                Previous
              </Link>
            )}

            <span>Page {page}</span>

            {articles.length === PAGE_SIZE && (
              <Link href={`/?search=${search}&page=${page + 1}`}>
                Next
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}


