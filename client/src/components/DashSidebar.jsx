import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'
import { HiAnnotation, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice.js';
import { useSelector } from 'react-redux';
import { HiChartPie } from 'react-icons/hi';

export default function DashSidebar() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const [access, setAccess] = useState({});
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search, access]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                dispatch(signoutSuccess());
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
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>

                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {
                        currentUser && access.adminAceess && (
                            <Link to={'/dashboard?tab=dash'}>
                                <Sidebar.Item
                                    active={tab === 'dash' || !tab}
                                    icon={HiChartPie}
                                    as='div'
                                >
                                    Dashboard
                                </Sidebar.Item>
                            </Link>
                        )
                    }
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={access.adminAceess ? 'Admin' : 'User'} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {
                        access.postAceess && (<Link to='/dashboard?tab=posts'>
                            <Sidebar.Item
                                active={tab === 'posts'}
                                icon={HiDocumentText}
                                as='div'>
                                My Posts
                            </Sidebar.Item>
                        </Link>)
                    }
                    {
                        access.adminAceess && (<Link to='/dashboard?tab=allposts'>
                            <Sidebar.Item
                                active={tab === 'allposts'}
                                icon={HiDocumentText}
                                as='div'>
                                All Posts
                            </Sidebar.Item>
                        </Link>)
                    }
                    {
                        access.adminAceess && (
                            <>
                                <Link to='/dashboard?tab=users'>
                                    <Sidebar.Item
                                        active={tab === 'users'}
                                        icon={HiOutlineUserGroup}
                                        as='div'>
                                        Users
                                    </Sidebar.Item>
                                </Link>
                                <Link to='/dashboard?tab=comments'>
                                    <Sidebar.Item
                                        active={tab === 'comments'}
                                        icon={HiAnnotation}
                                        as='div'>
                                        Comments
                                    </Sidebar.Item>
                                </Link>
                            </>
                        )
                    }

                    <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
