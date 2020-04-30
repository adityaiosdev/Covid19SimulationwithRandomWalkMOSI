let penularan = 0.05; //
let sembuh = 0.0005; //on each screen draw
let meninggal = 0.00004; //on each screen draw
let jumlahIndividu = 200; //jumlah individu
let diam = 20; //menentukan diameter dari lingkaran yang merepresentasikan individu/orang
let SocialDistancing = 0.8; //probabilitas individu bergerak
let width=1000;//lebar layar
let height=700;//tinggi layar

let status = {
  "sehat": "#000000",
  "terinfeksi": "#ff0000",
  "sembuh": "#00B000",
  "meninggal": "#000090"
};
let individu = [];

function setup() {
  createCanvas(width,height);
  background(0);
  for (var i = 0; i < jumlahIndividu; i++) {
    individu[i] = new Orang(
      i, //ID number
      random(width), //memulai koordinat x
      random(height), //memulai koordinat y
      random(-8, 8), //memulai kecepatan x
      random(-8, 8), //memulai kecepatan y
      (i > SocialDistancing * jumlahIndividu), //bergerak atau tidak
      individu //individu yang lain
    );
  }
  frameRate(120);
  mouseClicked();
}

function draw() {
  background(170);
  for (i = 0; i < jumlahIndividu; i++) {
    if (individu[i].stat != "meninggal") {
      if (individu[i].moving) {
        individu[i].move();
      }
      individu[i].bertemu();
    }
    if (individu[i].stat == "terinfeksi") {
      if (random() <sembuh) {
        individu[i].stat = "sembuh";
      } else if (random() < meninggal) {
        individu[i].stat = "meninggal";
      }
    }
    individu[i].display();
    textSize(18);
    stroke(0);
    fill(255, 204, 0);
    text("Terinfeksi = " + count() , 40, 20);
    stroke(0);
    fill(255, 204, 0);
    text("Sembuh = "+ pulih() ,40,40);
    stroke(0);
    fill(255, 204, 0);
    text("Belum Terpapar = "+ belumterpapar() ,40,60);
    stroke(0);
    fill(255, 204, 0);
    text("Meninggal = "+ mati() ,40,80);
    fill(255, 204, 0);
    text("Social Distancing = "+ socialDistance() ,40,100);
    textSize(20);
    fill('red');
    text("Running time "+ int(millis())/1000 +"s", 780, 20);
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText("COVID-19 Simulation ", 350, 40);
  }
  if (count()==0) {
    noLoop();
  }
}

function mouseClicked() {//untuk menambahkan berapa orang yang terkena covid dengan mouseclicked
  var thisOne = floor(random(jumlahIndividu));
  individu[thisOne].stat = "terinfeksi";
}

function count() {//untuk menghitung real time berapa orang yang terinfeksi covid
  var total = 0;
  for (var i = 0; i < jumlahIndividu; i++) {
    if (individu[i].stat == "terinfeksi") {
      total++;
    }
  }
  return total;
}

function pulih() {//untuk menghitung real time berapa orang yang berhasil sembuh
  var total = 0;
  for (var i = 0; i < jumlahIndividu; i++) {
    if (individu[i].stat == "sembuh") {
      total++;
    }
  }
  return total;
}

function mati() {//untuk menghitung real time berapa orang yang mati 
  var total = 0;
  for (var i = 0; i < jumlahIndividu; i++) {
    if (individu[i].stat == "meninggal") {
      total++;
    }
  }
  return total;
}

function belumterpapar() {
  var total = 0;
  for (var i = 0; i < jumlahIndividu; i++) {//untuk menghitung real time berapa orang yang belum terpapar
    if (individu[i].stat == "sehat") {
      total++;
    }
  }
  return total;
}
function socialDistance() {//untuk menghitung real time berapa orang yang melakukan social distancing
  var total = 0;
  for (var i = 0; i < jumlahIndividu+1; i++) {
    if (i > SocialDistancing * jumlahIndividu) {
      total++;
    }
  }
  return total;
}

class Orang {//untuk membuat sebuah ellipse yang merepresentasikan orang/individu
  constructor(
    id_ = 0,
    x_,
    y_,
    vx_ = random(-10, 10),
    vy_ = random(-10, 10),
    moving_ = true,
    others_= []) {
    this.id = id_;
    this.x = x_;
    this.y = y_;
    this.vx = vx_;
    this.vy = vy_;
    this.moving = moving_;
    this.others = others_;
    this.stat = "sehat";
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
    //membuat boundary agar class orang tidak keluar dari layar
    if (this.x < 0 || this.x > width) {
      this.vx = -1 * this.vx;
    }
    if (this.y < 0 || this.y > height) {
      this.vy = -1 * this.vy;
    }
    //membangkitkan gerakan random walk
    if (random()<=0.25){
        this.x+= this.vx;
    }
    else if (random()<=0.50){
        this.y-= this.vy;
    }
    else if (random()<=0.75){
        this.x-= this.vx;
    }
    else {
        this.y+= this.vy;
    }
  }

  bertemu() {//method untuk mengubah status individu jika bertemu dengan orang yang terinfeksi
    for (var i = this.id + 1; i < jumlahIndividu; i++) {
      var dx = this.others[i].x - this.x;
      var dy = this.others[i].y - this.y;
      var dist = sqrt(dx * dx + dy * dy);
      if (dist < 0.5 * diam) {
        if (random() < penularan) {
          if (this.stat == "terinfeksi" && this.others[i].stat == "sehat") {
            this.others[i].stat = "terinfeksi";
          }
          if (this.stat == "sehat" && this.others[i].stat == "terinfeksi") {
            this.stat = "terinfeksi";
          }
        }
      }
    }
  }

  display() {//method untuk menampilkan bola yang merepresentasikan sebagai individu
    fill(color(status[this.stat]));
    ellipse(this.x, this.y, diam / 2, diam / 2);
  }
}