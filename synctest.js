function asyncOperation () {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{resolve("hi")}, 3000)
    })
}

async function asyncFunction () {
    return await asyncOperation();
}

function topDog() {
    console.log("before inner")
    asyncFunction().then((res) => {
        console.log(res);
    });
    console.log("After inner")
}
console.log("before top dog")
topDog()
console.log("After top dog")