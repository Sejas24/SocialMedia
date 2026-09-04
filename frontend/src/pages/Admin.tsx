import { useEffect, useState } from 'react';
import {
  getAllUsersRequest,
  getAllPostsRequest,
  deletePostAdminRequest,
  getCommentsAdminRequest,
  deleteCommentAdminRequest,
} from '../services/admin.service';

import type { User, Post, Comment } from '../types';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [usersResponse, postsResponse] = await Promise.all([
        getAllUsersRequest(),
        getAllPostsRequest(),
      ]);

      setUsers(usersResponse.data);
      setPosts(postsResponse.data.posts);

      const commentsData: Record<number, Comment[]> = {};

      for (const post of postsResponse.data.posts) {
        try {
          const response = await getCommentsAdminRequest(post.id);
          commentsData[post.id] = response.data.comments;
        } catch {
          commentsData[post.id] = [];
        }
      }

      setComments(commentsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('¿Eliminar esta publicación?')) return;

    try {
      await deletePostAdminRequest(postId);

      setPosts((current) =>
        current.filter((post) => post.id !== postId)
      );

      setComments((current) => {
        const copy = { ...current };
        delete copy[postId];
        return copy;
      });
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar la publicación');
    }
  };

  const handleDeleteComment = async (
    commentId: number,
    postId: number
  ) => {
    if (!confirm('¿Eliminar este comentario?')) return;

    try {
      await deleteCommentAdminRequest(commentId);

      setComments((current) => ({
        ...current,
        [postId]: current[postId]?.filter(
          (comment) => comment.id !== commentId
        ),
      }));
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el comentario');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Panel de Administración</h1>

      <div className="admin-stats">
        <div>
          <strong>{users.length}</strong>
          <span>Usuarios</span>
        </div>

        <div>
          <strong>{posts.length}</strong>
          <span>Publicaciones</span>
        </div>
      </div>

      <section className="admin-section">
        <h2>Usuarios</h2>

        <div className="admin-users">
          {users.map((user) => (
            <div key={user.id} className="admin-user">
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
                <small>
                  Rol: {user.role}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Publicaciones</h2>

        {posts.map((post) => (
          <div key={post.id} className="admin-post">
            <div>
              <strong>
                {post.User?.name}
              </strong>

              <p>{post.content}</p>
            </div>

            <button
              onClick={() => handleDeletePost(post.id)}
              className="admin-delete-button"
            >
              Eliminar publicación
            </button>

            <div className="admin-comments">
              <h4>Comentarios</h4>

              {comments[post.id]?.map((comment) => (
                <div
                  key={comment.id}
                  className="admin-comment"
                >
                  <div>
                    <strong>
                      {comment.User?.name}
                    </strong>

                    <p>{comment.content}</p>
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteComment(
                        comment.id,
                        post.id
                      )
                    }
                    className="admin-delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}