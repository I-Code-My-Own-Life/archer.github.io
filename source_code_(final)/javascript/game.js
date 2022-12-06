let canvas = document.getElementById("canvas");
// Setting canvas's width and height : 
canvas.width = innerWidth;
canvas.height = innerHeight;
// Our canvas context variable : 
let c = canvas.getContext("2d");

// Setting the level that we want to play : 
let currentLevel = 1;
// Our Crossbow image : 
let crossbow = new Image();
crossbow.src = "../../images/crossbow.png";
// Our arrow's Image : 
let arrowImage = new Image();
arrowImage.src = "../../images/arrow.png";
let arrowWidth = 105;
let arrowHeight = 25;
let arrowSpeed = 12;
let arrowUpImg = new Image();
arrowUpImg.src = "../../images/arrowUp.png";
// Our star image : 
let starImg = new Image();
starImg.src = "../../images/star.png";
// Our Background image : 
let background = new Image();
background.src = "../../images/background.png";
// Our mouse's x and y positions will be stored in this object : 
let mouse = {
    x:undefined,
    y:undefined
} 
// Our target's x and y coordinates will be stored in this target object :
let targetPos = {
    x:undefined,
    y:undefined
}
let stopTimer = false;
let goToTheNextLevel = false;
let angle = 0;
let angleForTarget = 0;
let arrows = [];
let arrowsLeft = [];
let seconds = 60;
let minutes = 4;
let stars = 0;
// Our Arrow : 
class Arrow{
    constructor({img,x,y,width,height,ammo}){
        this.img = img;
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;
        this.angleForTarget = 0;
        this.velocity = {
            x:0,
            y:0
        }
        this.gravity = 0.06;
        this.ammo = ammo;
        this.radius = 10;
    }
    shoot(){
        if(!this.ammo){
            c.save();
            c.translate(this.x,this.y);
            c.rotate(this.angleForTarget);
            c.fillStyle = "rgba(0,0,0,0.01)"
            c.beginPath();
            c.arc(0 + this.width,15,this.radius,0,Math.PI * 2,false);
            c.fill();
            c.closePath();
            c.drawImage(this.img,0,0,this.width,this.height);
            c.restore();
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            // Remove these lines if you want the arrow to go into the direction without falling down or tilting : (REMOVE THESE TWO LINES if you don't want to add GRAVITY to the ARROW ) 
            this.velocity.y += this.gravity;
            this.angleForTarget += this.gravity / arrowSpeed;
        }
        else{
            c.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }
}
let velocityY = 2;
class Target{
    constructor({x,y,radius,color,i}){
        this.position = {
            x:x,
            y:y
        }
        this.radius = radius;
        this.color = color;
        this.i = i;
        this.width = this.radius;
        this.height = this.radius * 2;
    }
    update(){
        // Circle target : 
        if(this.i == 0){
            c.beginPath();
            c.fillStyle = this.color;
            c.save()
            c.translate(this.position.x,this.position.y);
            c.rotate(-1.59); 
            c.arc(0,0,this.radius,0,Math.PI,false);
            c.fill();
            c.closePath();
            c.restore();
        }
        // Rectangle target : 
        else{
            c.fillStyle = this.color;
            c.fillRect(this.position.x,this.position.y,this.width,this.height);
        }
    }

}

// Pushing ammos in the arrowsLeft array : 
let x = 50;
for(let i = 0; i < 5; i++){
    arrowsLeft.push(new Arrow({img:arrowUpImg,x:x,y:100,width:arrowHeight,height:arrowWidth,ammo:true}));
    x+= 50
}

let bullEye = new Target({x:innerWidth - 400,y:500 - 6 * 2 / 2,radius:6,color:"#f9801d",i:1});
let middleTarget = new Target({x:innerWidth - 400,y:500 - 30 * 2 / 2,radius:30,color:"#3c44a9",i:1});
let outerTarget = new Target({x:innerWidth - 400,y:500 - 50 * 2 / 2,radius:50,color:"#5d7c15",i:1});
let second1 = "0";
let level = 1;
function animate(){
    // These things are going to be in each level so I am putting them outside of the if statement :
    // Our background : 
    c.drawImage(background,0,0,canvas.width,canvas.height);
    // Our crossbow : 
    c.drawImage(crossbow,100,innerHeight - 200,100,100);
    // Our timer :
    c.fillStyle = "black"
    c.font = "25px minecraftia"
    c.fillText("Time Left   --",canvas.width - 350,155);
    c.font = "20px minecraftia"
    c.fillText(`${minutes}:`,canvas.width - 130,150);
    c.font = "20px minecraftia"
    if(seconds < 10 && seconds >= 1){
        second1 = "0";
    }
    else{
        second1 = "";
    }
    c.fillText(`${second1}${seconds}`,canvas.width - 100,150);
    // Drawing our star : 
    c.drawImage(starImg,canvas.width / 2 - 50,150,50,50);
    c.font = "20px minecraftia"
    c.fillText(`${stars}`,canvas.width / 2 - 35,145);
    c.font = "25px minecraftia"
    c.fillText(`Level ${level}`,canvas.width / 2 - 70,260);
    // Displaying our target :
    outerTarget.update(); 
    middleTarget.update();
    bullEye.update();
    // Shooting arrows : 
    arrows.forEach((arrow) => {
        arrow.shoot();
        if(arrow.x > canvas.width || arrow.y > canvas.height){
            arrows.splice(arrows.indexOf(arrow),1);
        }
    });
    // Collision detection between arrow and our targets :
    arrows.forEach((arrow,index) => {
        // Collision for bull's eye Target : 
        if(arrow_target_collision(arrow.x + arrow.width,arrow.y,bullEye.position.x,bullEye.position.y,bullEye.width,bullEye.height)){
            arrows.splice(index,1);
            stars+=3;
        }
        // Collision for middle Target : 
        else if(arrow_target_collision(arrow.x + arrow.width,arrow.y,middleTarget.position.x,middleTarget.position.y,middleTarget.width,middleTarget.height)){
            arrows.splice(index,1);
            stars+=2;
        }
        // Collision for outerTarget : 
        else if(arrow_target_collision(arrow.x + arrow.width,arrow.y,outerTarget.position.x,outerTarget.position.y,outerTarget.width,outerTarget.height)){
            arrows.splice(index,1);
            stars++;
        }
    })
    arrowsLeft.forEach((ammo) => {
        ammo.shoot();
    });
    if(arrowsLeft.length == 0){
        c.fillStyle = "black"
        c.font = "20px minecraftia"
        c.fillText("No   Arrows   Left",50,50);
    }

    // Setting our stars and our time (Score in the local Storage ) :
    // Looping through every account in localStorage and checking which one is logged in right now : 
    Object.keys(localStorage).forEach((key) => {
        if(JSON.parse(localStorage.getItem(key)).loggedIn == "true"){  
            // Adding a new property named stars to it :  
            let obj = JSON.parse(localStorage.getItem(key));
            obj.stars = stars;
            obj.time = `${minutes} : ${seconds}`;
            localStorage.setItem(key,JSON.stringify(obj));
        }
    });
                                            // Level 1 :
    if(currentLevel == 1){
        // If the ammo finishes we go to the next level :  
        if(arrowsLeft.length == 0 && arrows.length == 0){
            c.fillStyle = "black"
            c.font = "20px minecraftia"
            c.fillText("No   Arrows   Left",50,150);
            resetScreen();
            currentLevel = 2;
            level++;
        }
    }
                                            // Level 2 : 
    else if(currentLevel == 2){
        // Moving target : 
        if(outerTarget.position.y > innerHeight / 2 + 100 || outerTarget.position.y < 100){
            velocityY = -velocityY               
        }
        outerTarget.position.y += velocityY;
        middleTarget.position.y += velocityY;
        bullEye.position.y += velocityY;
        // If the ammo finishes we go to the next level :  
        if(arrowsLeft.length == 0 && arrows.length == 0){
            c.fillStyle = "black";
            c.font = "20px minecraftia";
            c.fillText("No   Arrows   Left",50,150);
            // Increasing the speed of the moving target :
            resetScreen();
            velocityY = 6;
            currentLevel = 3;
            level++;
        }
    }
    else if(currentLevel == 3){
        // Increasing the speed of the target in level 3 : 
        // Moving target : 
        if(outerTarget.position.y > innerHeight / 2 + 100 || outerTarget.position.y < 100){
            velocityY = -velocityY               
        }
        outerTarget.position.y += velocityY;
        middleTarget.position.y += velocityY;
        bullEye.position.y += velocityY;
    }
    requestAnimationFrame(animate);
}

animate();

// Our resize event listener : 
window.addEventListener("resize",(e)=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

addEventListener("mousemove",(e)=>{
    mouse.x = e.x;
    mouse.y = e.y;
})
let i = 5;
addEventListener("click",(e) => {
    targetPos.x = e.x;
    targetPos.y = e.y;
    let arrow = new Arrow({img:arrowImage,x:200 ,y:innerHeight - 210,width:arrowWidth,height:arrowHeight,ammo:false});
    // Ok, so here's some difficult MATHS written : 
    arrow.angleForTarget = Math.atan2(targetPos.y - (arrow.y + 8),targetPos.x - (arrow.x + 8));
    let dx = Math.cos(arrow.angleForTarget) * arrowSpeed;
    let dy = Math.sin(arrow.angleForTarget) * arrowSpeed;
    arrow.velocity.x = dx;
    arrow.velocity.y = dy;
    if(arrowsLeft.length > 0){
        arrows.push(arrow);
    }
    i--;
    arrowsLeft.splice(i,1);
});
let j = 0;

setInterval(()=>{
    if(seconds == 0 && minutes < 0 ){
        minutes = 0;
        seconds = "00";
        stopTimer = true;
    }
    if(seconds <= 0){
        seconds = 60;
    }
    if(!stopTimer){
        seconds--;
    }
    else{
        minutes = 0;
        seconds = "00"
    }
},1000);

setInterval(()=>{
    if(!stopTimer){
        minutes--;
    }
},60000);

function arrow_target_collision(arrowx, arrowy, targetx, targety, targetwidth, targetheight) {
    if (arrowx >= targetx &&         // right of the left edge AND
        arrowx <= targetx + targetwidth &&    // left of the right edge AND
        arrowy >= targety &&         // below the top AND
        arrowy <= targety + targetheight) // above the bottom
    {
        return true;
    }
    else {
        return false;
    }
}

x = 50;
// This will reset the screen when going to the next level :
function resetScreen(){
    seconds = 60;
    minutes = 4;
    stopTimer = false;
    i = 5;
    // Pushing ammos in the arrowsLeft array again for the next level : 
    for(let i = 0; i < 5; i++){
    arrowsLeft.push(new Arrow({img:arrowUpImg,x:x,y:100,width:arrowHeight,height:arrowWidth,ammo:true}));
    x+= 50
}
}

