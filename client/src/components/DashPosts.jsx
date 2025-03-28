import { Button, Modal, Table } from "flowbite-react";
import React, { Children, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [access, setAccess] = useState({});
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${encodeURIComponent(currentUser._id)}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (access.postAceess) {
      fetchPosts();
    }
  }, [currentUser._id, access]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsersAccess = async () => {
    try {
      const res = await fetch(`/api/user/getUserAccess/${currentUser._id}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
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

  const getYouTubeVideoId = (url) => {
    const regex =
      /(?:youtube\.com(?:\/[^\/]+\/\S+|\/(?:v|e(?:mbed)?)\/|\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {access.postAceess && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Subcategory</Table.HeadCell>
              <Table.HeadCell>Video</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
              <Table.HeadCell>
                <span>edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => {
              return (
                <Table.Body className="divide-y" key={post._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/post/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>{post.subcategory}</Table.Cell>
                    <Table.Cell>
                      {post &&
                        post.youtubeUrl &&
                        post.youtubeUrl.trim() !== "" && (
                          <div className="flex justify-center mt-5">
                            <a
                              href={post.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full"
                            >
                              <img
                                src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                                  post.youtubeUrl
                                )}/0.jpg`}
                                alt="YouTube Thumbnail"
                                className="w-20 h-16 object-cover"
                              />
                            </a>
                          </div>
                        )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline cursor-pointer"
                        to={`/update-post/${post._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet !</p>
      )}
      <Modal
        show={showModal}
        onClick={() => {
          setShowModal(false);
        }}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
