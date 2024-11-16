import { useEffect } from 'react';
import { useState } from 'react';
import { SearchResult } from '../api/search/actions';
import { getOpenGraphMetadata } from '../api/search/actions';
import type { OgObject } from 'open-graph-scraper/types';

interface SearchResultsProps {
  results: SearchResult[];
  resultRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>;
  activeReference: number | null;
}



export const SearchResults = ({ results, resultRefs, activeReference }: SearchResultsProps) => {
    const [openGraphMetadata, setOpenGraphMetadata] = useState<OgObject[]>([]);

    useEffect(() => {
        // Clear previous metadata when results change
        setOpenGraphMetadata([]);
        
        results.forEach((result) => {
            getOpenGraphMetadata(result.url).then((metadata) => {
                setOpenGraphMetadata((prev) => [...prev, metadata as OgObject]);
                console.log(metadata);
            });
        });
    }, [results]);

    const getFaviconUrl = (url: string) => {
        return `https://www.google.com/s2/favicons?domain=${url}`;
    };

    const getWebsiteName = (url: string) => {
        try {
            const hostname = new URL(url).hostname;
            return hostname.replace('www.', '').split('.')[0];
        } catch {
            return '';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {results.map((result, idx) => (
                <a
                    key={idx}
                    ref={(el) => { resultRefs.current[idx] = el }}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors flex flex-col h-full ${
                        activeReference === idx + 1 ? 'ring-2 ring-primary' : ''
                    }`}
                >
                    {openGraphMetadata[idx]?.ogImage?.[0]?.url && (
                        <div className="mb-4">
                            <img
                                src={openGraphMetadata[idx].ogImage[0].url} 
                                alt={result.title}
                                className="w-full h-40 object-cover rounded-lg"
                                width={300}
                                height={300}
                            />
                        </div>
                    )}
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold mb-2 w-4/5">{result.title}</h3>
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-content">
                            {idx + 1}
                        </span>
                    </div>
                    <div className="mt-auto text-sm opacity-70 flex items-center gap-2">
                        <img 
                            src={getFaviconUrl(result.url)} 
                            alt=""
                            className="w-4 h-4"
                            width={16}
                            height={16}
                        />
                        <span>{getWebsiteName(result.url)}</span>
                    </div>
                </a>
            ))}
        </div>
    );
};