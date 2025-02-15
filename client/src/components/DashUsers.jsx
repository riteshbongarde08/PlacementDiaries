import { Button, Modal, Table } from 'flowbite-react';
import React, { Children, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [access, setAccess] = useState({});
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (access.adminAceess) {
            fetchUsers();
        }
    }, [currentUser._id, access]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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

    const handleTogglePostAccess = async (userId) => {
        try {
            const res = await fetch(`/api/user/updateUserAccess/${userId}`, {
                method: 'PUT',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                setUsers((prev) => prev.map((user) => user._id === userId ? { ...user, canPost: !user.canPost } : user));
            }
        } catch (error) {
            console.log(error.message);
        };
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                access.adminAceess && users.length > 0 ? (
                    <>

                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date created</Table.HeadCell>
                                <Table.HeadCell>user image</Table.HeadCell>
                                <Table.HeadCell>username</Table.HeadCell>
                                <Table.HeadCell>email</Table.HeadCell>
                                <Table.HeadCell>post access</Table.HeadCell>
                                <Table.HeadCell>delete</Table.HeadCell>
                            </Table.Head>
                            {
                                users.map((user) => {
                                    return (
                                        <Table.Body className='divide-y' key={user._id}>
                                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                                <Table.Cell>
                                                    <img src={user.profilePicture}
                                                        alt={user.username}
                                                        className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                                                </Table.Cell>
                                                <Table.Cell>{user.username}</Table.Cell>
                                                <Table.Cell>{user.email}</Table.Cell>
                                                <Table.Cell>
                                                    <label className="switch">
                                                        <input type="checkbox" checked={user.canPost} onChange={() => handleTogglePostAccess(user._id)} />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span onClick={() => {
                                                        setShowModal(true);
                                                        setUserIdToDelete(user._id);
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
                    <p>You have no users yet !</p>
                )
            }
            <Modal show={showModal} onClick={() => { setShowModal(false) }} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user ?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => { setShowModal(false) }}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}
