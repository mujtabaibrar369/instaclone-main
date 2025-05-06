import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import RightSidebar from "./RightSidebar"; // Import your existing RightSidebar component
import LeftSidebar from "./LeftSidebar"; // Import your existing LeftSidebar component

const PostCard = ({ post, query }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Left Sidebar */}
      <div className="lg:w-1/4 hidden lg:block">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search Results Heading */}
        {query && (
          <div className="w-full flex justify-center items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Search Results for: <span className="text-blue-500">{query}</span>
            </h2>
          </div>
        )}

        {/* Post Card */}
        <div
          onClick={() => navigate(`/post/${post._id}`)}
          className="border rounded-lg p-4 cursor-pointer hover:bg-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <Avatar>
              <AvatarImage src={post.user?.profilePicture} />
              <AvatarFallback>{post.user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.user?.username}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <p className="mb-2">{post.caption}</p>

          {post.mediaUrl && (
            <>
              {post.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <img
                  src={post.mediaUrl}
                  alt="post"
                  className="w-full max-h-80 object-contain rounded-md"
                />
              ) : post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  controls
                  className="w-full max-h-80 object-contain rounded-md"
                >
                  <source src={post.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:w-1/4 hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default PostCard;
