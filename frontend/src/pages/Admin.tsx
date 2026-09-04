import { useEffect, useState } from 'react';

import {
  getAllUsersRequest,
  getAllPostsRequest,
  deletePostAdminRequest,
  getCommentsAdminRequest,
  deleteCommentAdminRequest,
} from '../services/admin.service';

import type {
  User,
  Post,
  Comment,
} from '../types';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<
    Record<number, Comment[]>
  >({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [
        usersResponse,
        postsResponse,
      ] = await Promise.all([
        getAllUsersRequest(),
        getAllPostsRequest(),
      ]);

      setUsers(usersResponse.data);
      setPosts(postsResponse.data.posts);

      const commentsData: Record<
        number,
        Comment[]
      > = {};

      for (const post of postsResponse.data.posts) {
        try {
          const response =
            await getCommentsAdminRequest(post.id);

          commentsData[post.id] =
            response.data.comments;
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

  const handleDeletePost = async (
    postId: number
  ) => {
    if (
      !confirm(
        '¿Eliminar esta publicación?'
      )
    ) {
      return;
    }

    try {
      await deletePostAdminRequest(postId);

      setPosts((current) =>
        current.filter(
          (post) => post.id !== postId
        )
      );

      setComments((current) => {
        const copy = { ...current };
        delete copy[postId];
        return copy;
      });

    } catch (error) {
      console.error(error);
      alert(
        'No se pudo eliminar la publicación'
      );
    }
  };

  const handleDeleteComment = async (
    commentId: number,
    postId: number
  ) => {
    if (
      !confirm(
        '¿Eliminar este comentario?'
      )
    ) {
      return;
    }

    try {
      await deleteCommentAdminRequest(
        commentId
      );

      setComments((current) => ({
        ...current,
        [postId]:
          current[postId]?.filter(
            (comment) =>
              comment.id !== commentId
          ),
      }));

    } catch (error) {
      console.error(error);
      alert(
        'No se pudo eliminar el comentario'
      );
    }
  };

  const totalComments =
    Object.values(comments).reduce(
      (total, list) =>
        total + list.length,
      0
    );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* HEADER */}

      <header className="admin-header">
        <div>
          <span className="admin-label">
            ADMIN
          </span>

          <h1>
            Panel de Administración
          </h1>

          <p>
            Gestiona usuarios, publicaciones
            y comentarios de la plataforma.
          </p>
        </div>

        <div className="admin-header-icon">
          ⚙️
        </div>
      </header>


      {/* ESTADÍSTICAS */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            👥
          </div>

          <div>
            <span>Usuarios</span>
            <strong>{users.length}</strong>
            <small>
              Total registrados
            </small>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            📝
          </div>

          <div>
            <span>Publicaciones</span>
            <strong>{posts.length}</strong>
            <small>
              Total de publicaciones
            </small>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            💬
          </div>

          <div>
            <span>Comentarios</span>
            <strong>{totalComments}</strong>
            <small>
              Total de comentarios
            </small>
          </div>
        </div>

      </section>


      {/* USUARIOS */}

      <section className="admin-panel">

        <div className="admin-panel-header">
          <div>
            <h2>Usuarios recientes</h2>
            <p>
              Usuarios registrados en la plataforma
            </p>
          </div>

          <span className="admin-count">
            {users.length} usuarios
          </span>
        </div>


        <div className="admin-users-table">

          <div className="admin-table-head">
            <span>Usuario</span>
            <span>Email</span>
            <span>Rol</span>
            <span>Estado</span>
          </div>


          {users.map((user) => (

            <div
              key={user.id}
              className="admin-table-row"
            >

              <div className="admin-user-cell">

                <img
                  src={
                    user.avatar ??
                    '/default-avatar.png'
                  }
                  alt={user.name}
                />

                <div>
                  <strong>
                    {user.name}
                  </strong>

                  <small>
                    ID #{user.id}
                  </small>
                </div>

              </div>


              <span className="admin-email">
                {user.email}
              </span>


              <span
                className={`admin-role ${
                  user.role === 'admin'
                    ? 'admin-role-admin'
                    : 'admin-role-user'
                }`}
              >
                {user.role === 'admin'
                  ? 'Administrador'
                  : 'Usuario'}
              </span>


              <span className="admin-status">
                <span className="status-dot" />
                Activo
              </span>

            </div>

          ))}

        </div>

      </section>


      {/* PUBLICACIONES */}

      <section className="admin-panel">

        <div className="admin-panel-header">

          <div>
            <h2>
              Publicaciones recientes
            </h2>

            <p>
              Gestiona el contenido publicado
            </p>
          </div>

          <span className="admin-count">
            {posts.length} publicaciones
          </span>

        </div>


        <div className="admin-posts">

          {posts.length === 0 ? (

            <div className="admin-empty">
              No hay publicaciones.
            </div>

          ) : (

            posts.map((post) => (

              <article
                key={post.id}
                className="admin-post-card"
              >

                <div className="admin-post-top">

                  <div className="admin-post-author">

                    <img
                      src={
                        post.User?.avatar ??
                        '/default-avatar.png'
                      }
                      alt={
                        post.User?.name ??
                        'Usuario'
                      }
                    />

                    <div>

                      <strong>
                        {post.User?.name ??
                          'Usuario'}
                      </strong>

                      <small>
                        Publicación #{post.id}
                      </small>

                    </div>

                  </div>


                  <button
                    className="admin-delete-button"
                    onClick={() =>
                      handleDeletePost(
                        post.id
                      )
                    }
                  >
                    🗑️ Eliminar
                  </button>

                </div>


                <p className="admin-post-content">
                  {post.content}
                </p>


                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="admin-post-image"
                  />
                )}


                <div className="admin-post-footer">

                  <span>
                    ❤️ {post.likesCount ?? 0}
                  </span>

                  <span>
                    💬 {post.commentsCount ?? 0}
                  </span>

                </div>


                {/* COMENTARIOS */}

                {comments[post.id]?.length >
                  0 && (

                  <div className="admin-comments">

                    <div className="admin-comments-title">
                      <span>
                        Comentarios
                      </span>

                      <strong>
                        {comments[
                          post.id
                        ].length}
                      </strong>
                    </div>


                    {comments[
                      post.id
                    ].map((comment) => (

                      <div
                        key={comment.id}
                        className="admin-comment"
                      >

                        <div className="admin-comment-user">

                          <img
                            src={
                              comment.User?.avatar ??
                              '/default-avatar.png'
                            }
                            alt={
                              comment.User?.name ??
                              'Usuario'
                            }
                          />

                          <div>

                            <strong>
                              {comment.User?.name ??
                                'Usuario'}
                            </strong>

                            <p>
                              {comment.content}
                            </p>

                          </div>

                        </div>


                        <button
                          className="admin-comment-delete"
                          onClick={() =>
                            handleDeleteComment(
                              comment.id,
                              post.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    ))}

                  </div>

                )}

              </article>

            ))

          )}

        </div>

      </section>

    </div>
  );
}