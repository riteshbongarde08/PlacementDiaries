import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: 'https://i.postimg.cc/2j2q4cLr/101.png',
        },
        category: {
            type: String,
            required: true,
        },
        subcategory: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    }, { timestamps: true }
);


const Post = mongoose.model('Post', postSchema);

export default Post;