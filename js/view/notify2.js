window.addEventListener("DOMContentLoaded", function() {
    var imgDom = document.getElementById("itemImg"),
        titleDom = document.getElementById("itemPreTitle");
    var msgArr = JSON.parse(localStorage.getItem('msgs'));
    var msg = msgArr[0];

    imgDom.src = msg.img;
    titleDom.innerHTML = msg.htmlText || msg.text;

    msgArr.shift();
    localStorage.setItem('msgs', JSON.stringify(msgArr));

}, false);