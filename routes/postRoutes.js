const express = require("express")
const router = express.Router()

let Post = require('../models/postModel')
//create
router.post('/', async (req, res) => {
    try {
        const { title, content, author, isPublished, tags } = req.body
        if (!title || !content) {
            return res.status(400).json({ message: "제목과 내용을 입력하시오" })
        }
        const newPost = new Post({
            title,
            content,
            author,
            isPublished: isPublished ?? false,
            tags
        })
        const savePost = await newPost.save()
        res.status(200).json({ message: "포스트 등록 완료", char: savePost })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})
//select all
router.get('/', async (req, res) => {
    try {
        const post = await Post.find()
        res.status(200).json({ message: "전체 포스트 불러오기", post })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})
//select
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: "해당 포스트 없음" })
        res.status(200).json({ message: "해당 포스트 불러오기", post })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { title, content, author, isPublished, tags } = req.body
        if (!title || !content) {
            return res.status(400).json({ message: "제목과 내용을 입력하시오" })
        }
        const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                author,
                isPublished: isPublished ?? false,
                tags
            }, {
            new: true, runValidators: true
        }
        )
        if (!updatePost) return res.status(404).json({ message: "포스트 없음" })
        res.status(200).json({ message: "포스트 수정 완료", char: updatePost })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const postId = req.params.id
        const deletePost = await Post.findByIdAndDelete(postId)
        if (!deletePost) return res.status(404).json({ message: "포스트 없음" })
        const posts = await Post.find()
        res.status(200).json({ message: "삭제 완료", posts })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})

module.exports = router