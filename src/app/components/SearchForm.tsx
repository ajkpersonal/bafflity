interface SearchFormProps {
    query: string;
    loading: boolean;
    onQueryChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
  }
  
  export const SearchForm = ({ query, loading, onQueryChange, onSubmit }: SearchFormProps) => (
    <form onSubmit={onSubmit} className="py-4 bg-base-200">
      <div className="flex">
        <input
          type="text"
          className="input input-bordered flex-1"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit" className="btn btn-primary ml-2">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );