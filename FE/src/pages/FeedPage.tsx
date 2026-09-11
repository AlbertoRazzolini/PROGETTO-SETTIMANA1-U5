import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postsApi } from "../api/posts";
import type { PostResp } from "../api/types";
import { PostCard } from "../components/PostCard";
import { EmptyState, ErrorBanner, Loading } from "../components/StatusBanner";

export function FeedPage() {
  const [posts, setPosts] = useState<PostResp[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function fetchPosts() {
    postsApi
      .getAll()
      .then((data) => setPosts(data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch((e) => setError(e instanceof Error ? e.message : "Errore nel caricamento dei post"));
  }

  function retry() {
    setError(null);
    setPosts(null);
    fetchPosts();
  }

  useEffect(fetchPosts, []);

  return (
    <div className="container">
      <div className="row-between" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26 }}>Feed</h1>
        <Link to="/nuovo-post" className="btn">
          + Nuovo post
        </Link>
      </div>

      {error && <ErrorBanner message={error} onRetry={retry} />}
      {!error && posts === null && <Loading label="Caricamento post…" />}
      {!error && posts?.length === 0 && (
        <EmptyState title="Ancora nessun post" subtitle="Crea il primo post per iniziare a popolare il feed." />
      )}
      {!error && posts && posts.length > 0 && (
        <div className="stack">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
