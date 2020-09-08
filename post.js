const doc = document
const RawPost = doc.getElementById('post').getAttribute('post-data')
const RawComment = doc.getElementById('post').getAttribute('comment-data')
const Post=JSON.parse(RawPost)
const Comments=JSON.parse(RawComment)
const Belong=doc.getElementById('post').getAttribute('belong-id')
const Locale = {'Common':'전체게시판', 'FirstGrade':'1학년 게시판','SecondGrade':'2학년 게시판','ThirdGrade':'3학년 게시판','Future':'진로진학', 'GradeCalc':'내신계산기', 'Calender':'시간표','Files':'자료실'}

let date=new Date()
doc.getElementsByClassName("title")[0].innerHTML = Post.title
date.setTime(Post.day)
doc.getElementsByClassName("date")[0].innerHTML=`${date.toLocaleString("ko-KR", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, hour12:false, })}`
doc.getElementsByClassName("text")[0].innerHTML=Post.content
if(Belong in Locale) doc.getElementsByClassName("locate")[0].innerHTML=Locale[Belong]
doc.getElementsByClassName("WriteComment")[0].innerHTML+=`<input type="hidden" name="postid" value="${Post.id}"> <input type="hidden" name="belongid" value="${Post.belong_id}">`

const CommentSection=doc.getElementById("commentdiv")
for(let i=0;i<Comments.length;i++) {
    date.setTime(Comments[i].day)
    CommentSection.innerHTML+=`
    <div class="comment">
        <div class="profile"> 
            <div class="circle">
            <img src="user.png" style="width:30px; margin-top: 13px;">
            </div>
            익명
        </div>
        <div class="date">${date.toLocaleString("ko-KR", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, hour12:false, })}</div>
        <div class="content">${Comments[i].content}</div>
    </div>
    <hr>
    `
}