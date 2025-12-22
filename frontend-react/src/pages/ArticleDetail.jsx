import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function ArticleDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/articles/${id}`)
            .then(res => res.json())
            .then(data => {
                setArticle(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch article:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!article) {
        return <div className="min-h-screen bg-gray-900 text-white p-8">Article not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-20 px-8 border-b border-gray-800">
                <div className="max-w-4xl mx-auto">
                    <Link to="/" className="text-gray-400 hover:text-white mb-8 inline-block">&larr; Back to Articles</Link>

                    <div className="flex gap-4 mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {article.status}
                        </span>
                        {article.is_updated && (
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                AI Enhanced ✨
                            </span>
                        )}
                    </div>

                    <h1 className="text-5xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        {article.title}
                    </h1>

                    <div className="text-gray-400 flex items-center gap-4 text-sm">
                        <span>Published: {new Date(article.created_at).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span>Source: <a href={article.source_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{new URL(article.source_url || 'https://example.com').hostname.replace('www.', '')}</a></span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-8 py-12">
                <article className="prose prose-invert prose-lg max-w-none">
                    <div className="whitespace-pre-wrap">{article.content}</div>
                </article>
            </div>

            {/* References */}
            {article.references && article.references.length > 0 && (
                <div className="max-w-3xl mx-auto px-8 py-8 border-t border-gray-800">
                    <h3 className="text-xl font-bold mb-4 text-gray-300">AI References</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-400">
                        {article.references.map((ref, idx) => (
                            <li key={idx}>
                                <a href={ref} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors truncate block">
                                    {ref}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ArticleDetail
