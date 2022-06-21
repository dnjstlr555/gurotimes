const doc = document
let date = new Date()
const RawDate = doc.getElementsByClassName('date')
for(i=0;i<RawDate.length;i++) {
    date.setTime(RawDate[i].innerHTML)
    RawDate[i].innerHTML=`${date.toLocaleString("ko-KR", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, hour12:false, })}`
}