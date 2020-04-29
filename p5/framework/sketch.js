let penularan = 0.05; 
let sembuh = 0.002; 
let meninggal = 0.0001;
let numberOfPeople = 100; 
let diam = 20; 
let SocialDistancing = 0.80; 


let status = {
  "unexposed": "#000000",
  "infected": "#ff0000",
  "immune": "#00B000",
  "deceased": "#000090"
};
let people = [];

function setup() {
  createCanvas(1000, 700);
  for (var i = 0; i < numberOfPeople; i++) {
    people[i] = new Person(
      i, 
      random(width), 
      random(height), 
      random(-8, 8), 
      random(-8, 8), 
      
      0,
      (i > SocialDistancing * numberOfPeople), 
      people 
    );
  }
  frameRate(60);
  mouseClicked();
}


function draw() {
  background(150);

  for (i = 0; i < numberOfPeople; i++) {
    if (people[i].stat != "deceased") {
      if (people[i].moving) {
        people[i].move();
      }
      people[i].collide();
    }
    if (people[i].stat == "infected") {
      if (random() < sembuh) {
        people[i].stat = "immune";
      } else if (random() < meninggal) {
        people[i].stat = "deceased";
      }
    }
    
    people[i].display();
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText("Jumlah Terinfeksi: ", 60, 40);
    ctx.fillText((count()), 300, 40);
   }
  if (count() == 0) {
    noLoop();

  }
}

function mouseClicked() {
  var thisOne = floor(random(numberOfPeople));
  people[thisOne].stat = "infected";
}

function count() {
  var total = 0;
  for (var i = 0; i < numberOfPeople; i++) {
    if (people[i].stat == "infected") {
      total++;
    }
  }
  return total;
}
function date() {
  var date = 0;
  for (var i = 0; i < numberOfPeople; i++) {
    if (count() != 0) {
      date++;
    }
  }
  return date;
}


class Person {
  constructor(
    id_ = 0,
    x_,
    y_,
    vx_ = random(-10, 10),
    vy_ = random(-10, 10),
    day_,
    moving_ = true,
    others_ = []) {
    this.id = id_;
    this.x = x_;
    this.y = y_;
    this.vx = vx_;
    this.vy = vy_;
    this.moving = moving_;
    this.others = others_;
    this.stat = "unexposed";
    this.day = day_;
  }
  move() {
    // rand=random();
    // if(rand<=0.25){
    //     this.pos_x = pos_x + 1;
    // }//down
    // else if(rand<=0.50){ 
    //     this.pos_y = pos_y - 1;
    // }//left
    // else if(rand<=0.75){
    //     this.pos_x = pos_x - 1;
    // }//up
    // else{
    //     this.pos_y = pos_y + 1;
    // }
    if (this.x < 0 || this.x > width) {
      this.vx = -1 * this.vx;
    }
    if (this.y < 0 || this.y > height) {
      this.vy = -1 * this.vy;
    }
    this.x += this.vx;
    this.y += this.vy;
  }

  collide() {
    for (var i = this.id + 1; i < numberOfPeople; i++) {
      var dx = this.others[i].x - this.x;
      var dy = this.others[i].y - this.y;
      var dist = sqrt(dx * dx + dy * dy);
      if (dist < 0.71 * diam) {
        if (random() < penularan) {
          if (this.stat == "infected" && this.others[i].stat == "unexposed") {
            this.others[i].stat = "infected";
          }
          if (this.stat == "unexposed" && this.others[i].stat == "infected") {
            this.stat = "infected";
          }
        }
      }
    }
  }

  display() {
    fill(color(status[this.stat]));
    ellipse(this.x, this.y, diam / 2, diam / 2);
  }
}