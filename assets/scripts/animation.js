
function fadeSideText(){
    sideText.classList.toggle("d-none");
    searchResults.classList.remove("d-none");
    let id = setInterval(frame, 10);
    let pos = 10;
    let opacity = 0;
    function frame(){
        if(pos <= 0){
            console.log("stopped anim");
            clearInterval(id);
            sideText.style.display = "none";
        }
        else{
            opacity+=10;
            pos--;
            searchResults.style.opacity = opacity + "%"
            searchResults.style.transform = `translateY(${pos}rem)`
        }
    }
}