const bbs = require('./bbs.js')
const board = new bbs('posting.db')

board.WriteComment("이거 좋네요 ㅋㅋㄹㅋㅋ",1234,8,0)
board.WriteComment("와 진짜 전설이다...",1234,8,0)
board.WriteComment("ㄹㅇㅋㅋ",1234,8,0)

board.WriteComment("안녕하세요 무플방지위원회",1234,9,0)
board.WriteComment("ㅋㅋㄹㅃㅃ",1234,9,0)