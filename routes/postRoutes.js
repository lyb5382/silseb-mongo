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
        const chars = await Char.find()
        res.status(200).json({ message: "전체 캐릭터 불러오기", chars })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})
//select
router.get('/:id', async (req, res) => {
    try {
        const charId = req.params.id
        const char = await Char.findById(charId)
        if (!char) return res.status(404).json({ message: "해당 캐릭터 없음" })
        res.status(200).json({ message: "해당 캐릭터 불러오기", char })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { name, level, isOnline } = req.body
        if (!name || typeof level !== 'number') {
            return res.status(400).json({ message: "이름과 레벨을 입력하시오" })
        }
        const updateChar = await Char.findByIdAndUpdate(
            req.params.id,
            {
                name,
                level,
                isOnline: isOnline ?? false
            }, {
                new: true, runValidators: true
            }
        )
        if (!updateChar) return res.status(404).json({ message: "캐릭터 없음" })
        res.status(200).json({ message: "캐릭터 수정 완료", char: updateChar })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const charId = req.params.id
        const deleteChar = await Char.findByIdAndDelete(charId)
        if (!deleteChar) return res.status(404).json({ message: "캐릭터 없음" })
        const chars = await Char.find()
        res.status(200).json({ message: "삭제 완료", chars })
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
})

module.exports = router