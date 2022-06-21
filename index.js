const bbs = require('./bbs.js')
const board = new bbs('posting.db')
const fs = require('fs')
const http2 = require('http2')
const path = require('path')
const url = require('url');
//const Timetable = require('comcigan-parser')
//const timetable = new Timetable()
const boards = ['Common','FirstGrade','SecondGrade','ThirdGrade']
const SpecialPages = ['Future', 'GradeCalc', 'Calender','Files']
const Locale = {'Common':'전체게시판', 'FirstGrade':'1학년 게시판','SecondGrade':'2학년 게시판','ThirdGrade':'3학년 게시판','Future':'진로진학', 'GradeCalc':'내신계산기', 'Calender':'시간표','Files':'자료실'}

const server = http2.createSecureServer({
    key: fs.readFileSync('RootCA.key'),
    cert: fs.readFileSync('RootCA.pem')
});
server.on('error', (err) => console.error(err));

function AddressToPath(Address) {
    if(Address) {
        const RawPath = Address.split('/')
        let FinalPath = RawPath[1]
        if(RawPath && RawPath.length>=2) {
            FinalPath=path.join("template", FinalPath)
            for(let i=2;i<RawPath.length;i++) {
                FinalPath=path.join(FinalPath,RawPath[i])
            }
            console.log(FinalPath)
            if(fs.existsSync(FinalPath)) return FinalPath
        }
    }
    return null
}

let isTimetableReady=false
let timetableResult, timetableTime;
/*
async function TimeTableGet() {
    await timetable.init()
    await timetable.setSchool('랜덤고등학교')
    timetableResult = await timetable.getTimetable()
    timetableTime = timetable.getClassTime()
    isTimetableReady=true
    console.log("Timetable Ready")
}
TimeTableGet()

*/
server.on('stream', (stream, headers) => {
    const RawPath = decodeURI(headers[':path'])
    const Param = url.parse(RawPath,true);
    console.log(`${Param.path} / ${Param.pathname}`)
    const splited = Param.pathname.split('/')
    let BoardIndex=0
    let PageIndex=0
    if(splited[1]) {
        BoardIndex = boards.findIndex(e=>e==splited[1])
        PageIndex = SpecialPages.findIndex(e=>e==splited[1])
    }
    if(Param.search) {
        if(Param.pathname=='/WriteComment') {
            if(Param.query.content && Param.query.postid && Param.query.belongid) {
                board.WriteComment(Param.query.content, 1234, Param.query.postid, Param.query.belongid)
                stream.respond({
                    'Location': `/?postid=${Param.query.postid}`,
                    ':status': 302
                });
            } else {
                stream.respond({
                    'Location': `/?postid=${Param.query.postid}`,
                    ':status': 302
                });
            }
            stream.end()
        } else if(Param.pathname=='/WritePost') {
            if(Param.query.title && Param.query.article && Param.query.belongid) {
                const postid=board.WritePost(Param.query.title,Param.query.article,1234,Param.query.belongid)
                stream.respond({
                    'Location': `/?postid=${postid}`,
                    ':status': 302
                });
            } else {
                stream.respond({
                    'Location': `/${boards[Param.query.belongid]}`,
                    ':status': 302
                });
            }
            stream.end()
            
        }  else if(Param.query.postid) {
            const id=Param.query.postid
            const post=board.GetPost().find(e=>e.id==`${id}`)
            console.log(post)
            if(post!=undefined) {
                const indexpost=fs.readFileSync('template/post.html')
                const indexupper=fs.readFileSync('template/indexupper.html')
                stream.respond({
                    'content-type': 'text/html; charset=utf-8',
                    ':status': 200
                });
                stream.write(indexupper)
                const comments=board.GetComment().filter(e=>e.PostId==id)
                stream.write(`<div id='post' belong-id='${boards[post.belong_id]}' post-data='${JSON.stringify(post)}' comment-data='${JSON.stringify(comments)}'></div>`)
                stream.write(indexpost)
                
            } else {
                stream.respond({
                    ':status': 404
                });
            }
            stream.end()
        } else if(Param.pathname=='/post') {
            if(Param.query.belongid) {
                stream.respond({
                    'content-type': 'text/html; charset=utf-8',
                    ':status': 200
                });
                const indexwrite=fs.readFileSync("template/write.html")
                const indexupper=fs.readFileSync('template/indexupper.html')
                stream.write(indexupper)
                stream.write(`<div id='belong' data='${Param.query.belongid}'></div>`)
                stream.write(indexwrite)
            } else {
                stream.respond({
                    ':status': 400
                });
            }
            
            stream.end()
        } else {
            stream.respond({
                ':status': 404
            });
            stream.end()
        }
    } else {
        console.log(BoardIndex)
        if(BoardIndex!=-1 || PageIndex!=-1) {
            const indexupper=fs.readFileSync('template/indexupper.html')
            const indexfooter=fs.readFileSync('template/indexfooter.html')
            stream.respond({
                'content-type': 'text/html; charset=utf-8',
                ':status': 200
            });
            stream.write(indexupper)
            if(boards[BoardIndex] in Locale) {
                stream.write(`<div class='PostButton'> <a href='post?belongid=${BoardIndex}'>✏️</a></div><h3>${Locale[boards[BoardIndex]]}</h3>`)
            }
            if(BoardIndex!=-1) {
                const posts = board.GetPost().sort((a,b)=>{
                    return b.id-a.id
                })
                let BoardPosts=[]
                for(let i=0;i<posts.length;i++) {
                    if(posts[i].belong_id==BoardIndex) BoardPosts.push(posts[i])
                }
                for(let i=0;i<BoardPosts.length;i++) {
                    console.log(BoardPosts[i])
                    stream.write(`
                    <a class='PostPortal' href='${Param.pathname}?postid=${BoardPosts[i].id}'>
                        <div class="card">
                            <div class="profile"> 
                                <div class="circle">
                                    <img src="img/user.png" style="width:30px; margin-top: 13px;">
                                </div>
                                익명
                            </div>
                            <div class="title"> 
                                <b>${BoardPosts[i].title}</b>
                                <div class="date">${BoardPosts[i].day}</div>
                            </div>
            
                            <div class="content"> 
                                ${BoardPosts[i].content}
                            </div>
                        </div>
                    </a>
                    `)
                }
                stream.write(indexfooter);
            } else {
                switch(PageIndex) {
                    case 0: //Future
                        break;
                    case 1: //GradeCalc
                        const indexcalc=fs.readFileSync('template/calc.html')
                        stream.write(indexcalc)
                        break;
                    case 2: //Calender
                        if(isTimetableReady) {
                            const indextime=fs.readFileSync('template/time.html')
                            stream.write(`<div id='table' data-table='${JSON.stringify(timetableResult)}' data-time='${JSON.stringify(timetableTime)}'></div>`)
                            stream.write(indextime)
                            
                        }
                        break;
                    case 3: //files
                        break;
                }
                
            }
            stream.end()
        } else {
            const file=AddressToPath(RawPath)
            if(file) {
                stream.respond({':status': 200})
                const filetosend=fs.readFileSync(file)
                stream.end(filetosend)
            } else {
                stream.respond({':status': 404})
                stream.end()
            }
        }
    }
});

server.listen(8443);
console.log(board.GetPost())
console.log(board.GetComment())