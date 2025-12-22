import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/articles')
            .then(res => res.json())
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch articles:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                        Vibe Coded News
                    </h1>
                    <p className="text-gray-400 text-xl">Curated by AI. Vibe check passed.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map(article => (
                            <Link to={`/article/${article.id}`} key={article.id} className="group">
                                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {article.status}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-4 leading-tight text-white/90 group-hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </h2>

                                    <p className="text-gray-400 mb-6 line-clamp-3 flex-grow">
                                        {article.content}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-sm text-blue-400 group-hover:underline flex items-center gap-1">
                                            Read More &rarr;
                                        </span>
                                        {article.is_updated && (
                                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">AI Enhanced ✨</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ArticleList
