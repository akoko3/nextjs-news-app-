'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage?: string;
  author: string;
  publishedAt: string;
}

export default function NewsDetailPage() {
  const { id } = useParams(); // Get the article ID from the URL
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${id}&apiKey=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch article");

        const data = await res.json();

        if (data.articles && data.articles.length > 0) {
          setArticle(data.articles[0]);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading article...</p>;
  if (error || !article) return <p>Article not found.</p>;

  return (
    <div style={{backgroundColor:'white', maxWidth:'1300px', height:'120vh', paddingLeft:'50px', paddingRight:'500px' , marginTop:'0'}}>
      <h1>{article.title}</h1>
      {article.urlToImage && <img src={article.urlToImage} alt={article.title} style={{borderRadius: '5px'}} width="400" />}
      <p style={{color:'black'}}>{article.description}</p>
      <p style={{color:'black'}}>{article.author}</p>  
      <p style={{color:'black'}}>{article.content}</p>
      <p style={{color:'black'}}>{article.publishedAt}</p> 
      <a href={article.url} target="_blank" rel="noopener noreferrer">Read Full Article</a>
    </div>
  );
}
