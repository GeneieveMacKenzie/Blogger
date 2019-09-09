import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({

    blogId: { type: ObjectId, ref: "comments", required: true },
    body: { type: String },
    author: { // How could this data get.... populated 
        _id: { type: ObjectId, ref: "User", required: true },
        name: {type: String}
    }
}, { timestamps: true })



export default class CommentService {
    get repository(){
        return mongoose.model('comments', _model)
    }
}

