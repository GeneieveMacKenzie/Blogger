import express from 'express'
import BloggerService from '../services/BloggerService';
import { Authorize } from '../middleware/authorize.js'
import CommentService from '../services/CommentService';

let _commentService = new CommentService().repository
let _bloggerService = new BloggerService().repository

export default class BloggerController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .get('', this.getAll)
            .get('/:id', this.getById)
            .get('/:id/comments, this.getComments')
            .use(Authorize.authenticated)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getAll(req, res, next) {
        try {
            let data = await _bloggerService.find({})
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _bloggerService.findById(req.params.id)
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }


    async getComments(req, res, next) {
        try {
            let data = await _commentService.findById(req.params.id)
            res.send(data)
        } catch (error) { next(error)

        }
    }

    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.authorId = req.session.uid
            let data = await _bloggerService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await _bloggerService.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid}, req.body, { new: true })
            if (data) {
                return res.send(data)
            }
            throw new Error("invalid id")
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            await _bloggerService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
            res.send("deleted value")
        } catch (error) { next(error) }

    }

}