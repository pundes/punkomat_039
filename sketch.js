var flock;
var noise;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);


  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 220; i++) {
    var b = new Boid(random(width),random(height));
    flock.addBoid(b);
  }
  noise = new Noise();
}

function draw() {
  background(149, 165, 166);
  flock.run();
}

// SOUND
function Noise() {
  var freqs = T(function(count) {
    return [1550][count % 0.001];
  });
  var noise = T("fnoise", {freq:freqs, mul:0.01}).play();
  T("interval", {interval:freqs}, freqs).start();
}
