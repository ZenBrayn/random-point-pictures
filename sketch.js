
function preload() {
  img = loadImage("http://138.68.31.61:3838/imgs/test.jpg");
}

function setup() {
  createCanvas(img.width, img.height);
  print(img.width, img.height);
  img.loadPixels();
  color_points = [];

  // Setup the logging table
  log_table = new p5.Table();

  log_table.addColumn('frame_count');
  log_table.addColumn('num_points');
  log_table.addColumn('img_diff');
}

//--- Main drawing function
function draw() {
  drawColorSip();

  if (color_points.length % 100 == 0) {
    saveCanvas("pt_img-" + color_points.length, "png");
    saveTable(log_table, "img_log.csv");
  }
}

function drawColorSip() {
  // // First display the current color point
  // // state and compute the image difference
  background(255);
  displayColorPoints();
  loadPixels();
  var img_diff_1 = computeImgDiff(img);
  
  // Now compute a new point and display
  pt = new ColorPoint();
  // Get a random position and size, but "sip"
  // the color from the image
  pt.assignRandomPosition();
  pt.assignRandomSize();
  pt.assignColor(color(imgPixelColor(Math.round(pt.x), Math.round(pt.y), img)));
  color_points.push(pt);
  background(255);
  displayColorPoints();
  loadPixels();
  var img_diff_2 = computeImgDiff(img);

  // reject the new point if the image difference increases
  var current_diff = img_diff_2;

  if (img_diff_2 > img_diff_1) {
    color_points.pop();
    current_diff = img_diff_1;
  }

  print(color_points.length + " " + img_diff_2 + " " + frameRate());
  var log_entry = log_table.addRow();
  log_entry.setNum("frame_count", frameCount);
  log_entry.setNum("num_points", color_points.length);
  log_entry.setNum("img_diff", current_diff);
}

function drawRandom() {
  // // First display the current color point
  // // state and compute the image difference
  background(255);
  displayColorPoints();
  loadPixels();
  var img_diff_1 = computeImgDiff(img);
  
  // Now compute a new point and display
  pt = new ColorPoint();
  pt.assignRandomAttrs();
  color_points.push(pt);
  background(255);
  displayColorPoints();
  loadPixels();
  var img_diff_2 = computeImgDiff(img);

  // reject the new point if the image difference increases
  if (img_diff_2 > img_diff_1) {
    color_points.pop();
  }

  print(color_points.length + " " + img_diff_2 + " " + frameRate());
}

function computeImgDiff(inp_img) {
  var color_diff;
  var img_diff = 0;
  for (var i = 0; i < inp_img.width; i++) {
    for (var j = 0; j < inp_img.height; j++) {
      // img_diff += colorDiff(pixelColor(i, j), pixelColor(i, j, img));
      img_diff += colorDiff(canvasPixelColor(i, j), imgPixelColor(i, j, img));
    }
  }
  return(img_diff);
}

function colorDiff(pixel1, pixel2) {
  var diff = 0;
  for (var i = 0; i < 3; i++) {
    diff += (pixel1[i] - pixel2[i]) * (pixel1[i] - pixel2[i]);
  }
  return(diff);
}

function displayColorPoints() {
  for (var i = 0; i < color_points.length; i++) {
    color_points[i].display();
  }
}

function canvasPixelColor(x, y) {
  var d = pixelDensity();
  var off = 4 * ((y * d) * width * d + (x * d));
  return([pixels[off], pixels[off+1], pixels[off+2], pixels[off+3]]);
}

function imgPixelColor(x, y, inp_img) {
  var d = inp_img._pixelDensity;
  var off = 4 * ((y * d) * inp_img.width * d + (x * d));
  return([inp_img.pixels[off], inp_img.pixels[off+1], inp_img.pixels[off+2], inp_img.pixels[off+3]]);
}

// function pixelColor(x, y, inp_img = null) {
//   var off;
//   var d;

//   if (inp_img == null) {
//     // off = (y * width + x) * pixelDensity() * 4;
//     d = pixelDensity();
//     off = 4 * ((y * d) * width * d + (x * d));
//     return([pixels[off], pixels[off+1], pixels[off+2], pixels[off+3]]);
//   } else {
//     d = inp_img._pixelDensity;
//     off = 4 * ((y * d) * inp_img.width * d + (x * d));
//     return([inp_img.pixels[off], inp_img.pixels[off+1], inp_img.pixels[off+2], inp_img.pixels[off+3]]);
//   }
// }

// color point class
function ColorPoint() {

  this.assignAttrs = function(pt_color, pt_size, pt_x, pt_y) {
    this.color = pt_color;
    this.size = pt_size;
    this.x = pt_x;
    this.y = pt_y;
  }

  this.assignColor = function(pt_color) {
    this.color = pt_color;
  }

  this.assignRandomAttrs = function() {
    this.assignRandomPosition();
    this.assignRandomSize();
    this.assignRandomColor();
  }

  this.assignRandomPosition = function() {
    this.x = random(img.width);
    this.y = random(img.height);     
  }

  this.assignRandomSize = function() {
    this.size = random(50);
  }

  this.assignRandomColor = function() {
    this.color = color(random(256), random(256), random(256), 255);
  }

  this.display = function() {
    push();
    noStroke();
    fill(this.color)
    ellipse(this.x, this.y, this.size, this.size)
    pop();
  }
}









