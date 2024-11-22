import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Share2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { createShare } from '../lib/api';

export function CreatePage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const id = await createShare(content);
      if (id) {
        navigate(`/${id}`);
      } else {
        setError('Failed to get a valid share ID');
      }
    } catch (error) {
      console.error('Failed to create share:', error);
      setError(error instanceof Error ? error.message : 'Failed to create share. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 hover:opacity-80 transition-opacity">
          <Share2 className="w-8 h-8 text-pink-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Shared
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="Paste your text here..."
            />
            <Sparkles className="absolute top-3 right-3 text-pink-500/20 w-5 h-5" />
          </div>

          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className={cn(
              "w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Create Share Link
              </>
            )}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Links automatically expire after 1 hour
          </p>
        </form>
      </div>
    </div>
  );
}