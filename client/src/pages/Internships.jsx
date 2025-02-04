// import React from 'react'

import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

// export default function Internships() {
//     return (
//         <div>
//             Internships
//         </div>
//     )
// }

// import React, { useState, useEffect } from 'react';

export default function Internships() {
    const [posts, setPosts] = useState([]); // State to hold all posts
    const [loading, setLoading] = useState(true); // State to manage loading

    useEffect(() => {
        // Fetch posts when the component mounts
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/post/getposts?category=internship'); // Replace with your API endpoint
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading spinner or message while fetching
    }

    if (posts.length === 0) {
        return <div>No posts available for the "Internship" category.</div>;
    }

    return (
        <div>
            <div className='p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
}
