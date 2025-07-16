"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Page = () => {
  interface NewsItem {
    title: string;
    description?: string;
    link: string;
    source_id: string;
    publishedAt?: string;
    source?: { name?: string };
    [key: string]: unknown;
  }
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data.results);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5">
      <h1 className="text-4xl font-extrabold text-center mb-8">
        <span className='text-glow'>Latest Scam & Fraud News</span> <span>📰</span>
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search news..."
          className="px-4 py-2 rounded-lg border border-border bg-muted text-foreground w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-muted h-48 rounded-xl"
              ></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group border border-border bg-card/60 backdrop-blur-md p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <h2 className="font-bold text-xl text-foreground group-hover:text-blue-400 transition-colors">
                {item.title}
              </h2>
              <p className="text-muted-foreground mt-2">
                {item.description || 'No description available.'}
              </p>

              <div className="flex justify-between items-center mt-4">
                <a
                  href={item.link}
                  target="_blank"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Read more →
                </a>
                <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full capitalize">
                  {item.source_id}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* HIBP Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-foreground">🔐 Check if You&apos;ve Been Pwned</h2>
        <p className="text-muted-foreground mb-4">
          Enter your email to check if your credentials have been exposed in a data breach.
        </p>
        <a
          href="https://haveibeenpwned.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
        >
          Go to Have I Been Pwned →
        </a>
      </div>
    </div>
  );
};

export default Page;
