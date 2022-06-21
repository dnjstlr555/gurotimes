const fs = require('fs')
const { debug } = require('console')
const DateLib = new Date();
const PostType = 0
const CommentType = 1
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = class bbs {
    /*
    0 게시글 1 댓글(type)
    id: 게시글 id
    title: 게시글 제목
    content: 게시글 내용
    password: 게시글 비번
    day: 게시글 작성 날자
    belong_id:게시판 속한곳
    */
    constructor(location) {
        this.location=location
        this.db=[]
        this.post=[]
        this.comment=[]
        this.UpdateDBFromFile()
    }
    UpdateDBFromFile() {
        try {
            this.db = JSON.parse(fs.readFileSync(this.location, 'utf8'))
        } catch(e) {
            readline.question('Error occured while loading data file.', answer => {
                if(answer=="y") {
                    fs.writeFileSync(this.location,JSON.stringify([]))
                }
                readline.close();
            });
        }
        this.UpdatePostComment()
    }
    UpdatePostComment() {
        this.post=[]
        this.comment=[]
        for(const thisData of this.db) {
            if(thisData.type==PostType) this.post.push(thisData)
            if(thisData.type==CommentType) this.comment.push(thisData)
        }
    }
    WriteDBToFile() {
        const send = JSON.stringify(this.db)
        fs.writeFileSync(this.location, send)
    }
    WriteComment(pContent, pPassword, pPostBelongId, pBelongId) {
        this.UpdateDBFromFile()
        const maxid=this.GetCommentMaxID()
        const now=Date.now()
        this.db.push({type:CommentType, id:maxid+1, PostId:pPostBelongId, content:pContent, password:pPassword, day:now, belong_id:pBelongId})
        this.WriteDBToFile()
    }
    WritePost(pTitle, pContent, pPassword, pBelongId) {
        this.UpdateDBFromFile()
        const maxid=this.GetPostMaxID()
        const now=Date.now()
        this.db.push({type:PostType, id:maxid+1, title:pTitle, content:pContent, password:pPassword, day:now, belong_id:pBelongId})
        this.WriteDBToFile()
        return maxid+1;
    }
    GetPost() {
        this.UpdateDBFromFile()
        return this.post
    }
    GetComment() {
        this.UpdateDBFromFile()
        return this.comment
    }
    GetPostMaxID() {
        let maxId = 0
        let posts = this.GetPost()
        for(const p of posts) {
            if(p.id>maxId) maxId=p.id
        }
        return maxId
    }
    GetCommentMaxID() {
        let maxId = 0
        let comments = this.GetComment()
        for(const c of comments) {
            if(c.id>maxId) maxId=c.id
        }
        return maxId
    }
    __ResetAll() {
        this.db=[]
        this.WriteDBToFile()
        console.log("Resetting all...")
    }
}