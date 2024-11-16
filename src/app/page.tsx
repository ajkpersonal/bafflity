// app/page.tsx
'use client';

import React, { useState} from 'react';
import Sidebar from './components/Sidebar';
import { search } from './api/search/actions';
import { SearchResult } from './api/search/actions';
import { getOpenAIResponse } from './api/openai/actions';
import ReactMarkdown, { Components } from 'react-markdown';
import { SearchResults } from './components/SearchResults';
import { SearchForm } from './components/SearchForm';
import { useCitations } from './hooks/useCitations';

const Home = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearch, setCurrentSearch] = useState<{
    query: string;
    response: string;
    numberedResults: { id: number; title: string; url: string }[];
  } | null>(null);
  
  const { activeReference, resultRefs, handleCitationClick, resetActiveReference } = useCitations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchResults([]);
    setCurrentSearch(null);
    
    const results = await search(query);
    setSearchResults(results);
    const openaiResponse = await getOpenAIResponse(results, query);
    setCurrentSearch({
      query: query,
      response: openaiResponse.message.content || '',
      numberedResults: openaiResponse.numberedResults
    });
    setQuery('');
    setLoading(false);
  };

  const citationTags: Partial<Components> = {
    p: ({ children }) => <p className="mb-4">{children}</p>,
    a: ({ children, href }) => {
      if (href?.startsWith('#citation-')) {
        const citationNumber = href.replace('#citation-', '');
        return (
          <button
            onClick={() => handleCitationClick(parseInt(citationNumber))}
            className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-content mx-1 hover:bg-primary-focus cursor-pointer"
          >
            {citationNumber}
          </button>
        );
      }
      return <a href={href} className="text-primary hover:text-primary-focus">{children}</a>;
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      resetActiveReference();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div 
        className="flex-1 flex flex-col h-screen bg-base-200"
        onClick={handleContainerClick}
      >
        <div className="flex-1 overflow-auto p-4 border rounded-lg bg-white">
          {loading ? (
            <div className="rounded-lg p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : currentSearch && (
            <>
              <h1 className="text-2xl font-bold mb-6">{currentSearch.query.charAt(0).toUpperCase() + currentSearch.query.slice(1)}</h1>
              
              {searchResults.length > 0 && (
                  <SearchResults
                    results={searchResults}
                    resultRefs={resultRefs}
                    activeReference={activeReference}
                  />
              )}

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown components={citationTags}>{currentSearch.response}</ReactMarkdown>
              </div>
            </>
          )}
        </div>
        <SearchForm
          query={query}
          loading={loading}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Home;
