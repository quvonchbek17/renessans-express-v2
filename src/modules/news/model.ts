import { Schema, Types, model} from "mongoose";

const newsSchema  = new Schema({
    id: {
        type: Types.ObjectId,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    desc: {
       type: String
    },
    imgUrl: {
        type: String
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
}, {
    collection: "news"
})

export default model("News", newsSchema)