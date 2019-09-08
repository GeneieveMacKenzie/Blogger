import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({

    blogId: { type: ObjectId, ref: "Comment", required: true },
    body: { type: String },
    author: { // How could this data get.... populated 
        _id: { type: ObjectId, ref: "User", required: true },
        name: "Jim Bob"
    }
}, { timestamps: true })



export default class CommentService {
    get repository(){
        return mongoose.model('comment', _model)
    }
}

