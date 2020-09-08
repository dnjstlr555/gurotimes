const doc = document
const RawTime = doc.getElementById('table').getAttribute('data-time')
const RawTable = doc.getElementById('table').getAttribute('data-table')
const time=JSON.parse(RawTime)
const table=JSON.parse(RawTable)

const grade=Object.keys(table)
const gradeElement=doc.getElementById("grade")
gradeElement.innerHTML=""
for(let i=0;i<grade.length;i++) {
    gradeElement.innerHTML+=`
    <option value='${grade[i]}'>${grade[i]}학년</option>
    `
}
const classElement=doc.getElementById("class")


function onGradeChange() {
    console.log("LOL")
    const classSelect=Object.keys(table[gradeElement.value])
    classElement.innerHTML=""
    console.log(classSelect)
    for(let i=0;i<classSelect.length;i++) {
        classElement.innerHTML+=`
        <option value='${classSelect[i]}'>${classSelect[i]}반</option>
        `
    }
}
let tableinfo
function onClassChange() {
    tableinfo=table[gradeElement.value][classElement.value]
    let contents=[]
    let tmp
    for(let i=1;i<=7;i++) {
        tmp=[]
        for(let j=0;j<tableinfo.length;j++) {
            let fd = tableinfo[j].find(e=>e.class_time==i)
            tmp.push((fd)?fd:{empty:true})
            console.log(contents[i])
        }
        contents.push(tmp)
    }
    labels = doc.getElementsByClassName("subject")
    for(let i=0;i<contents.length;i++) {
        labels[i].innerHTML=`<td width="50" align="center"><font color="#000000">${i+1}</font></td>`
        for(let j=0;j<contents[i].length;j++) {
            labels[i].innerHTML+=`
            <td width="50" align="center">${(contents[i][j].empty!=true)?(contents[i][j].subject):""}</td>`
        }
    }
    console.log(contents)
}