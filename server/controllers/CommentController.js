import express from 'express'
import { Authorize } from '../middleware/authorize.js'
import CommentService from '../services/CommentService';


let _commentService = new CommentService().repository


export default class CommentController{
    constructor() {
        this.router = express.Router()
        .get('', this.getAll)
        .get('/:id', this.getById)
        .use(Authorize.authenticated)
        .post('', this.create)
        .put('/:id', this.edit)
        .delete('/:id', this.delete)
    }

    async getAll(req, res, next) {
        try {
            let data = await _commentService.find({}).populate("author", "name")
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _commentService.findById(req.params.id).populate("author", "name")
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }

    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.authorId = req.session.uid
            let data = await _commentService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await _commentService.findOneAndUpdate({ _id: req.params.id, author: req.session.uid}, req.body, { new: true })
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
            await _commentService.findOneAndRemove({ _id: req.params.id, author: req.session.uid })
            res.send("deleted value")
        } catch (error) { next(error) }

    }


}