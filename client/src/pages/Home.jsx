import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard';
import backgroundImage from '../assets/college_drone.jpg';
import ImageCarousel from '../components/ImageCarousel';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b',
        'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b',
        'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b',
    ];

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <>
         <div class="homepage">
        <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '500px', margin: '20px', padding: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)' }}></div>
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto relative z-10'>
                <h1 className='text-white slide-in-text text-3xl font-bold lg:text-6xl transition-transform duration-500 transform hover:scale-105'>Welcome to TKIET's PlacementDiaries</h1>
                <p className='text-white slide-in-text text-xs sm:text-sm'>Here you'll find a variety of posts and insights on topics such as interview experiences, placement preparation, and internship journeys.</p>
                <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
                    View all posts
                </Link>
            </div>
        </div>
        </div>
        <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7 mt-10'>
            {
                posts && posts.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
        
        <ImageCarousel />
        </>
    )
}
