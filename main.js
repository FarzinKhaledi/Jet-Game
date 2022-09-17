window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.heigth = 500;

  // input Handeler class will keep track of user input
  //
  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener('keydown', (e) => {
        if (
          (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === ' ') {
          this.game.player.shootTop();
        }
        console.log(this.game.keys);
      });
      window.addEventListener('keyup', (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
        console.log(this.game.keys);
      });
    }
  }

  // projectTitle class will keep track of players lasers
  //
  class ProjectTitle {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 7;
      this.heigth = 3;
      this.speed = 3;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = 'yellow';
      context.fillRect(this.x, this.y, this.width, this.heigth);
    }
  }

  //keep track of falling screws
  //
  class Particale {}

  //player class will controol the main character
  //
  class Player {
    constructor(game) {
      this.game = game;
      this.width = 20;
      this.heigth = 50;
      this.x = 20;
      this.y = 100;
      this.speedY = -1;
      this.maxSpeed = 5;
      this.projectiles = [];
    }
    // controls the spped of the player
    update() {
      if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowDown'))
        this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });

      //handel projectTitle
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
    }

    /*this will specify which canavas element we want to draw
    in case our game has multipul canavas and layers
    */
    draw(context) {
      context.fillStyle = 'green';
      context.fillRect(this.x, this.y, this.width, this.heigth);
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    shootTop() {
      this.projectiles.push(new ProjectTitle(this.game, this.x, this.y));
      console.log(this.projectiles);
    }
  }

  //class enemy its handelin diffrent enemy types
  //
  class Enemy {}

  // will handel diffrent background layers
  //
  class Layer {}

  // backgrouud class will put all objects together
  //
  class Background {}
  // Ui classs will draw score timer and all the information to be display for the user
  //
  class UI {}

  // this is the main class the brain of the game
  class Game {
    constructor(width, heigth) {
      this.width = width;
      this.heigth = heigth;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.keys = [];
    }
    update() {
      this.player.update();
    }
    draw(context) {
      this.player.draw(context);
    }
  }

  const game = new Game(canvas.heigth, canvas.width);

  //animation loop

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.heigth);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
