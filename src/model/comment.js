import {reactive, ref, computed} from 'vue';
import {nanoid} from "nanoid";
import {clone} from './Shape'

const _ = require('lodash');

const comment= {
    id:null,
    parent_id :null,
    user_id :null,
    user_name :null,//用户姓名
    comment_details:'',
    comment_date :'',
    content_flag :null,//文章标识（1：作者；2：普通用户）
    content_id :null,//文章ID
    reply_comment_id :null,//回复评论的ID
    reply_user_id :null,//回复用户ID
    reply_user_name:null,//回复用户姓名
    reply_list:null,
}
export class Comment {
    static newReplyComment(reply,user) {
        let ans = clone(reply)
        ans.id = nanoid()
        ans.parent_id = reply.parent_id ? reply.parent_id : ans.parent_id
        ans.user_id = user.user_id
        ans.user_name = user.user_name
        ans.reply_comment_id = reply.id
        ans.reply_user_id = reply.user_id
        ans.reply_user_name = reply.user_name
        return ans
    }

    static newContentComment(content,user) {
        let ans = clone(comment)
        ans.id = nanoid()
        ans.parent_id = null
        ans.user_id = user.user_id
        ans.user_name = user.user_name
        ans.reply_list=[]
        return ans
    }

}