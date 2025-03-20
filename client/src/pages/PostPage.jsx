import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getPosts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const getYouTubeVideoId = (url) => {
    const regex =
      /(?:youtube\.com(?:\/[^\/]+\/\S+|\/(?:v|e(?:mbed)?)\/|\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen ">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
            {post && post.title}
        </h1>
        <Link
            to={`/search?category=${post && post.category}`}
            className="self-center mt-5"
        >
            <Button color="gray" pill size="xs">
                {post && post.category}
            </Button>
        </Link>
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="italic">
                {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
        </div>
        <div
            className="p-3 max-w-2xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        {/* Show the youtube url thumbnail */}
        {post && post.youtubeUrl && post.youtubeUrl.trim() !== "" && (
            <div className="flex justify-center mt-5">
                <a
                    href={post.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-2xl"
                >
                    <img
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                            post.youtubeUrl
                        )}/0.jpg`}
                        alt="YouTube Thumbnail"
                        className="w-full h-96 object-cover"
                    />
                </a>
            </div>
        )}

        <CommentSection postId={post?._id} />
        <div className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-xl mt-5">Recent articles</h1>
            <div className="flex flex-wrap gap-5 mt-5 justify-center">
                {recentPosts &&
                    recentPosts.map((post) => <PostCard key={post?._id} post={post} />)}
            </div>
        </div>
    </main>
);
}
