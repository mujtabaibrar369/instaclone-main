import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchedPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/post/search?query=${query}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (error) {
        console.error("Error searching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchSearchedPosts();
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Search Results for: <span className="text-blue-500">{query}</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
