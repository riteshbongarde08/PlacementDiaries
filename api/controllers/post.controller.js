import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import { sendEmail } from '../utils/emailService.js';
import Comment from "../models/comment.model.js";

/* */
export const create = async (req, res, next) => {
    if (!req.user.canPost) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        const subject = 'Thank You for Your Post';
        // const postUrl = `${process.env.CLIENT_DEV}/post/${savedPost.slug}`
        const postUrl = `${process.env.CLIENT_PROD}/post/${savedPost.slug}`
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Post</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #28a745;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            line-height: 1.6;
            margin: 10px 0;
        }
        .email-footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
        .email-footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Placement Diaries</h1>
        </div>
        <div class="email-body">
            <p>Dear User,</p>

            <p>Thank you for sharing your post with PlacementDiaries! We appreciate your contribution and look forward to seeing more amazing content from you.</p>

            <p>Your post is now live and available for others to enjoy.</p>

            <p><a href="${postUrl}" class="post-title">Click here to view your post</a></p>

            <p>If you have any questions or need assistance, feel free to reach out to us.</p>

            <p>Best regards,<br>Placement Diaries Team</p>
        </div>
        <div class="email-footer">
            <p>Need help? Contact us at <a href="mailto:placementdiariestkiet@gmail.com">placementdiadirestkiet@gmail.com</a>.</p>
        </div>
    </div>
</body>
</html>
`;

        await sendEmail(req.body.email, subject, htmlContent);

        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

/* */
export const getallposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find()
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};

/* */
export const getposts = async (req, res, next) => {
    try {

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.subcategory && { subcategory: req.query.subcategory }),
            ...(req.query.branchName && { branchName: req.query.branchName }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .populate('userId', 'profilePicture')  // Populate the userId field and select only profilePicture
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);


        // Transform the posts to include the user object in the desired format
        const transformedPosts = posts.map(post => {
            const postObject = post.toObject();

            return {
                ...postObject,
                user: {
                    id: postObject.userId._id,
                    profilePicture: postObject.userId.profilePicture
                },
                userId: undefined  // Remove the original userId field
            };
        });

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts: transformedPosts,
            lastMonthPosts,
            totalPosts,
        });

    } catch (error) {
        next(error);
    }
};

/* */
export const deletepost = async (req, res, next) => {
    if ((!req.user.canPost && !req.user.isAdmin) || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post.'));
    }
    try {
        // Delete all comments associated with the post
        await Comment.deleteMany({ postId: req.params.postId });

        // Delete the post
        await Post.findByIdAndDelete(req.params.postId);

        res.status(200).json('The post and its comments have been deleted');
    } catch (error) {
        next(error);
    }
};

/* */
export const updatepost = async (req, res, next) => {
    if ((!req.user.canPost && !req.user.isAdmin) || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post.'));
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                title: req.body.title,
                category: req.body.category,
                subcategory: req.body.subcategory,
                content: req.body.content,
                youtubeUrl: req.body.youtubeUrl,
            }
        }, { new: true })
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};


