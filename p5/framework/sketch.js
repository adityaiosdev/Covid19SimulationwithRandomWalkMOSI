let bola=[];
let jumlahbola=100;
let diam=10;

function setup() {
  createCanvas(1000,700);
  background(0);
  for (var i = 0; i < jumlahbola; i++) {
    bola[i] = new Balls(
      i, //ID number
      random(width), //start x coord
      random(height), //start y coord
      random(-8, 8), //start x velocity
      random(-8, 8), //start y velocity
      bola
    );
  }
  frameRate(120); 
}

function draw() {
  background(100);
  for (i = 0; i < jumlahbola; i++) {
        bola[i].move();
        bola[i].display();
      }
    }


class Balls {
  constructor(
    id = 0,
    x,
    y,
    vx = random(-8, 8),
    vy = random(-8, 8),
    others= []) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.others = others;
  }
  move() {
      if (this.x < 0 || this.x > width) {
        this.vx = -1 * this.vx;
      }
      if (this.y < 0 || this.y > height) {
        this.vy = -1 * this.vy;
      }
      this.x += this.vx;
      this.y += this.vy;
  }
  display() {
    fill(0);
    ellipse(this.x, this.y, 10, 10);
  }
}