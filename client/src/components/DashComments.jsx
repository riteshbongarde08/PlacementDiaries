import { Button, Modal, Table } from 'flowbite-react';
import React, { Children, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [access, setAccess] = useState({});
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getComments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (access.adminAceess) {
            fetchComments();
        }
    }, [currentUser._id, access]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/getComments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setCommentss((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
                setShowModal(false);
            }
            else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchUsersAccess = async () => {
        try {
            const res = await fetch(`/api/user/getUserAccess/${currentUser._id}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                setAccess(data.access);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUsersAccess();
        }
    }, [currentUser]);

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                access.adminAceess && comments.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date updated</Table.HeadCell>
                                <Table.HeadCell>Comment content</Table.HeadCell>
                                <Table.HeadCell>number of likes</Table.HeadCell>
                                <Table.HeadCell>username</Table.HeadCell>
                                <Table.HeadCell>Post title</Table.HeadCell>
                                <Table.HeadCell>delete</Table.HeadCell>
                            </Table.Head>
                            {
                                comments.map((comment) => {
                                    return (
                                        <Table.Body className='divide-y' key={comment._id}>
                                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                                <Table.Cell>
                                                    {comment.content}
                                                </Table.Cell>
                                                <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                                <Table.Cell>{comment.userId?.username}</Table.Cell>
                                                <Table.Cell>{comment.postId}</Table.Cell>
                                                <Table.Cell>
                                                    <span onClick={() => {
                                                        setShowModal(true);
                                                        setCommentIdToDelete(comment._id);
                                                    }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    )
                                })
                            }
                        </Table>
                        {
                            showMore && (<button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>)
                        }
                    </>
                ) : (
                    <p>You have no comments yet !</p>
                )
            }
            <Modal show={showModal} onClick={() => { setShowModal(false) }} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete comment ?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => { setShowModal(false) }}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}
