import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function NewsDetails() {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/news/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch news details:", err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-5">
      {post.imageUrl && (
        <img
          src={`http://localhost:5000${post.imageUrl}`}
          alt={post.title}
          className="w-full rounded-xl mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-slate-500 mb-4">
        By {post.authorName || "Unknown Author"} ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-lg leading-relaxed text-justify">{post.content}</p>
    </div>
  );
}
