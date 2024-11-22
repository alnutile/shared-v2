import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardCopy, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { getShare } from '../lib/api';

export function ViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const data = await getShare(id);
        if (!data || data.status === 'expired') {
          setExpired(true);
          return;
        }
        setContent(data.text);
      } catch (error) {
        console.error('Failed to fetch content:', error);
        setExpired(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, navigate]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-500 mb-4">Share Expired</h1>
          <p className="text-gray-400 mb-6">This share has expired or doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
          >
            Create New Share
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Share2 className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              ShareText
            </h1>
          </div>

          <button
            onClick={copyToClipboard}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-gray-800 hover:bg-gray-700 transition-colors",
              copied && "text-green-400"
            )}
          >
            <ClipboardCopy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <pre className="whitespace-pre-wrap break-words text-gray-100 font-mono">
            {content}
          </pre>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          This link will expire in 1 hour
        </p>
      </div>
    </div>
  );
}