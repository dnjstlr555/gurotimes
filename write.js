const doc = document
const belongid=doc.getElementById("belong").getAttribute("data")
document.getElementsByClassName("WritePost")[0].innerHTML+=`<input type="hidden" name="belongid" value="${belongid}">`