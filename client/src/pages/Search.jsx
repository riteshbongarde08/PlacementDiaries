import { TextInput, Select, Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'placement',
        branchName: ''
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort') || 'desc';
        const categoryFromUrl = urlParams.get('category') || 'placement';
        const branchNameFromUrl = urlParams.get('branchName') || '';

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl || branchNameFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
                branchName: branchNameFromUrl,
            })
        }
        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 10) {
                    setShowMore(true);
                }
                else {
                    setShowMore(false);
                }
            }
        }
        fetchPosts();
    }, [location.search]);

    const handleChange = async (e) => {
        if (e.target.id === 'searchTerm') {
            const searchTermTrimed = e.target.value.trim();
            setSidebarData({ ...sidebarData, searchTerm: searchTermTrimed })
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order });
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'placement';
            setSidebarData({ ...sidebarData, category })
        }
        if (e.target.id === 'branchName') {
            const branchName = e.target.value || '';
            setSidebarData({ ...sidebarData, branchName })
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        urlParams.set('branchName', sidebarData.branchName);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            }
            else {
                setShowMore(false);
            }
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2 '>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <TextInput placeholder='Search...' id='searchTerm' type='text' value={sidebarData.searchTerm} onChange={handleChange} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <Select className='' onChange={handleChange} value={sidebarData.sort} id='sort'>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <Select className='' onChange={handleChange} value={sidebarData.category} id='category'>
                            <option value="placement">Placement</option>
                            <option value="internship">Internship</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Branch:</label>
                        <Select className='' onChange={handleChange} value={sidebarData.branchName} id='branchName'>
                            <option value="">All</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="EnTC">EnTC</option>
                            <option value="Civil">Civil</option>
                            <option value="Chemical">Chemical</option>
                            <option value="Mechanical">Mechanical</option>
                        </Select>
                    </div>
                    <Button type='submit' outline gradientDuoTone='purpleToPink'>
                        Apply Filters
                    </Button>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Post results:</h1>
                <div className='p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        !loading && posts.length === 0 && (<p className='text-xl text-gray-500'>No posts found.</p>)
                    }
                    {
                        loading && (<p className='text-xl text-gray-500'>Loading...</p>)
                    }
                    {
                        !loading && posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
                <div>
                    {
                        showMore && (<button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>Show more</button>)
                    }
                </div>
            </div>
        </div>
    )
}
