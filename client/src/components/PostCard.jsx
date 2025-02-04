import React from 'react'
import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
    return (
        <div className='flex flex-col flex-1 border border-teal-500 hover:border-2 h-[350px] overflow-hidden rounded-lg transition-all'>
            <Link to={`/post/${post.slug}`} className='flex items-center justify-center h-1/2 pt-10'>
                <img
                    src={post?.user?.profilePicture}
                    alt='post cover'
                    className='h-[170px] w-[170px] rounded-full   object-cover transition-all duration-300 z-20 '
                />
            </Link>
            <div className='p-2  flex justify-end flex-col gap-1 h-1/2 '>
                <div className='flex flex-col m-2'>
                    <p className='text-lg font-semibold line-clamp-1'>{post?.title}</p>
                    <span className='italic text-sm'>{post?.category}</span>
                </div>
                <Link
                    to={`/post/${post?.slug}`}
                    className=' border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
                >
                    Read article
                </Link>
            </div>
        </div>
    );
}