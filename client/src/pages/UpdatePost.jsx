import { Alert, Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { postId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        try {
            const fetchPosts = async () => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPublishError(null);
                    setFormData(data.posts[0]);
                }
            };
            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/update-post/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
            <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title - (Company name - Your name)' required id='title' className='flex-1'
                        onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value })
                        }}
                        value={formData.title}
                    />
                    <Select
                        onChange={(e) => {
                            setFormData({ ...formData, category: e.target.value })
                        }}
                        value={formData.category}
                    >
                        <option value='uncategorized' hidden>Select a category</option>
                        <option value="placement">Placement</option>
                        <option value="internship">Internship</option>
                    </Select>
                    <Select
                        onChange={(e) => {
                            setFormData({ ...formData, subcategory: e.target.value })
                        }}
                        value={formData.subcategory}
                    >
                        <option value="uncategorized" hidden>Select a subcategory</option>
                        <option value="oncampus">On Campus</option>
                        <option value="offcampus">Off Campus</option>
                    </Select>
                    <Select
                        onChange={(e) => {
                            setFormData({ ...formData, branchName: e.target.value })
                        }}
                        value={formData.branchName}
                    >
                        <option value="" hidden>Select a branch</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="EnTC">EnTC</option>
                        <option value="Civil">Civil</option>
                        <option value="Chemical">Chemical</option>
                        <option value="Mechanical">Mechanical</option>
                    </Select>
                </div>
                <TextInput type='url' placeholder='YouTube URL (optional)' id='youtubeUrl' className='flex-1'
                    onChange={(e) => {
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                    }}
                    value={formData.youtubeUrl}
                />
                <ReactQuill theme='snow' placeholder='Write your experience here...' className='h-72 mb-12' required
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                    value={formData.content}
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>Update</Button>
                {
                    publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>
                }
            </form>
        </div>
    )
}
