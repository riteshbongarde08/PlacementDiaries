import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard';

export default function Home() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch('/api/post/getposts');
            const data = await res.json();
            if (res.ok) {
                setPosts(data.posts);
            }
        }
        fetchPosts();
    }, []);
    return (
        <div>
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to PlacementDiaries</h1>
                <p className='text-gray-500 text-xs sm:text-sm'>Here you'll find a variety of posts and insights on topics such as interview experiences, placement preparation, and internship journeys.</p>
                <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
                    View all posts
                </Link>
            </div>
            <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7'>
                {
                    posts && posts.length > 0 && (
                        <div className="flex flex-col gap-6">
                            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4'>
                                {
                                    posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))
                                }
                            </div>
                            <Link to='/search' className='text-lg text-teal-500 hover:underline text-center'>
                                View all posts
                            </Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
