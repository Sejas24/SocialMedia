import { useEffect, useState } from 'react';
import { getFeedRequest, deletePostRequest } from '../services/post.service';
import type { Post } from '../types';
import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';

const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPosts = async (pageNumber: number) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getFeedRequest(pageNumber, 10);
            setPosts((prev) => (pageNumber === 1 ? data.posts : [...prev, ...data.posts]));
            setTotalPages(data.totalPages);
            setPage(data.page);
        } catch (err) {
            setError('No se pudo cargar el feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts(1);
    }, []);

    const handleCreated = (newPost: Post) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar esta publicación?')) return;
        try {
            await deletePostRequest(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert('No se pudo eliminar la publicación');
        }
    };

    const handleLoadMore = () => {
        loadPosts(page + 1);
    };

    return (
        <div>
            <CreatePostForm onCreated={handleCreated} />

            {error && <p className="error-text">{error}</p>}

            {posts.length === 0 && !loading && (
                <p className="empty-state">Aún no hay publicaciones. ¡Sé el primero en publicar!</p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}

            {loading && <p className="loading-state">Cargando...</p>}

            {!loading && page < totalPages && (
                <button onClick={handleLoadMore} className="btn btn-ghost load-more">
                    Cargar más
                </button>
            )}
        </div>
    );
};

export default Feed;