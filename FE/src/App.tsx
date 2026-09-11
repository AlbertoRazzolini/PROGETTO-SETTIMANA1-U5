import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { DocumentiPage } from "./pages/DocumentiPage";
import { DocumentoDetailPage } from "./pages/DocumentoDetailPage";
import { FeedPage } from "./pages/FeedPage";
import { MapPage } from "./pages/MapPage";
import { NewPostPage } from "./pages/NewPostPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PostDetailPage } from "./pages/PostDetailPage";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/nuovo-post" element={<NewPostPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/mappa" element={<MapPage />} />
          <Route path="/documenti" element={<DocumentiPage />} />
          <Route path="/documenti/:documentoId" element={<DocumentoDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
