import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';

export default function CanPostPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
    const [access, setAccess] = useState({});
    const navigate = useNavigate();

    const fetchUsersAccess = async () => {
        try {
            const res = await fetch(`/api/user/getUserAccess/${currentUser._id}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.ok) {
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

    useEffect(() => {
        if (currentUser && access.postAceess !== undefined) {
            if (!access.postAceess) {
                navigate('/sign-in');
            }
        }
    }, [currentUser, navigate]);

    return currentUser && access.postAceess ? <Outlet /> : null;
}
