"use server";

import OpenAI from "openai";
import { SearchResult } from "../search/actions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getOpenAIResponse(
  searchResults: SearchResult[],
  query: string
) {
  const numberedResults = searchResults.map((result, index) => ({
    ...result,
    id: index + 1
  }));

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert at responding to user queries based on search results. Respond in markdown format, starting with an h1 header for Answer and then a more detailed breakdown of the response to the query. Each search result has an ID number. When citing information, use the format [id](#citation-id) where id is the number of the source. For example, [1](#citation-1) would be the first search result.",
      },
      {
        role: "user",
        content: `Search results:\n${JSON.stringify(numberedResults)}\n\nQuery: ${query}`,
      },
    ],
    model: "gpt-4o",
  });

  return {
    message: completion.choices[0].message,
    numberedResults
  };
}
