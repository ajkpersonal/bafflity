'use server';

import Exa from "exa-js"
const exa = new Exa(process.env.EXA_API_KEY);
import ogs from 'open-graph-scraper';

export type SearchResult = {
    title: string;
    url: string;
    author: string;
    summary: string;
    score: number;
};

export async function search(query: string) {
  return exa.searchAndContents(query, {
    type: "neural",
    useAutoprompt: true,
    summary: true,
    numResults: 4,
  }).then((res) => res.results as SearchResult[]);
}

// Get open graph metadata from a url
export async function getOpenGraphMetadata(url: string) {
  const options = { url };
  const res = await ogs(options);
  return res.result;
}

