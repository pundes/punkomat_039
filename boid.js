function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;
  this.maxforce = 0.05;

  var val;
  var rx, ry, lx1, ly1, lx2, ly2;
  var black, grey, yellow;

  black = color(0, 0, 0);
  yellow = color(149, 165, 16);
  grey = color(149, 165, 166);

  rx = 5;
  ry = 5;
  lx1 = (rx + 10) - 1;
  ly1 = (ry + 10) - 1;
  lx2 = 75;
  ly2 = (ry + 10) - 1;

  this.run = function(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  this.applyForce = function(force) {
    this.acceleration.add(force);
  }

  this.flock = function(boids) {
    var sep = this.separate(boids);
    var coh = this.cohesion(boids);

    sep.mult(15);
    coh.mult(5);

    this.applyForce(sep);
    this.applyForce(coh);
  };

  this.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  };

  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  };

  this.render = function() {
    var min = 0;
    var max = 360;
    val = Math.round(Math.random() * (max - min)) + min;

    if(val === 100) {
      rx = -5;
      ry = -5;
      lx1 = rx + 1;
      ly1 = ry + 1;
      lx2 = -75;
      ly2 = rx + 1;
    } else if(val === 111) {
      rx = 5;
      ry = -5;
      lx1 = (rx + 10) - 1;
      ly1 = ry + 1;
      lx2 = (rx + 10) - 1;
      ly2 = -75;
    } else if(val === 313) {
      rx = 5;
      ry = 5;
      lx1 = (rx + 10) - 1;
      ly1 = (ry + 10) - 1;
      lx2 = 75;
      ly2 = (ry + 10) - 1;
    } else if(val === 248) {
      rx = -5;
      ry = 5;
      lx1 = rx + 1;
      ly1 = (ry + 10) - 1;
      lx2 = rx + 1;
      ly2 = 75;
    }

    push();
    translate(this.position.x, this.position.y);
    stroke(black);
    line(lx1, ly1, lx2, ly2);
    fill(grey);
    rect(0, 0, 10, 10);
    fill(black);
    stroke(yellow);
    rect(rx, ry, 10, 10)
    pop();
    pop();
  };

  this.borders = function() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }


  this.separate = function(boids) {
    var desiredseparation = 25.0;
    var steer = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < desiredseparation)) {
        var diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  this.cohesion = function(boids) {
    var neighbordist = 50;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position, boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); 
    } else {
      return createVector(0, 0);
    }
  }
}
