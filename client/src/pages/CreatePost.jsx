import { Alert, Button, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreatePost() {
    const [formData, setFormData] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedFormData = { ...formData, email: currentUser.email };
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Something went wrong!');
        }
    };
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title - (Company name - Your name)' required id='title' className='flex-1'
                        onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value })
                        }}
                    />
                    <Select
                        onChange={(e) => {
                            setFormData({ ...formData, category: e.target.value })
                        }}
                    >
                        <option value='uncategorized' hidden>Select a category</option>
                        <option value="placement">Placement</option>
                        <option value="internship">Internship</option>
                    </Select>
                    <Select
                        onChange={(e) => {
                            setFormData({ ...formData, subcategory: e.target.value })
                        }}
                    >
                        <option value="uncategorized" hidden>Select a subcategory</option>
                        <option value="oncampus">On Campus</option>
                        <option value="offcampus">Off Campus</option>
                    </Select>
                </div>
                <ReactQuill theme='snow' placeholder='Write your experience here...' className='h-72 mb-12' required
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
                {
                    publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>
                }
            </form>
        </div>
    )
}
