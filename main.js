window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.heigth = 700;

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
      });
      window.addEventListener('keyup', (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
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
      this.speed = 4;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.9) this.markedForDeletion = true;
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
      if (this.game.keys.includes('ArrowUp') && this.y > 0)
        this.speedY = -this.maxSpeed;
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
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new ProjectTitle(this.game, this.x + 10, this.y + 5)
        );
      }
      this.game.ammo--;
    }
  }

  //class enemy its handelin diffrent enemy types
  //
  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.live = Math.floor(Math.random() * 5) + 1;
      this.score = this.live;
      this.speedX = Math.random() * -1.5 - 0.05;
      // this.directionX = Math.random() * 1 + 1;
      // this.directionY = Math.random() * 1 - 2.5;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speedX;
      // this.x -= this.directionX;
      // this.y += this.directionY;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = 'red';
      context.fillRect(this.x, this.y, this.width, this.heigth);
      context.fillStyle = 'black';
      context.font = '20 px Helvetica';
      context.fillText(this.live, this.x, this.y);
    }
  }
  class enemyChild extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228 * 0.2;
      this.heigth = 170 * 0.2;
      this.y = Math.random() * (this.game.heigth * 0.5 - this.heigth);
    }
  }
  // will handel diffrent background layers
  //
  class Layer {}

  // backgrouud class will put all objects together
  //
  class Background {}
  // Ui classs will draw score timer and all the information to be display for the user
  //
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = 'Helvetica';
      this.color = 'navy ';
    }
    draw(context) {
      //styleing
      context.save();
      context.fillStyle = this.color;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = 'white';
      context.font = this.fontSize + 'px' + this.fontFamily;

      //Score display info
      context.fillText('SCORE  ' + this.game.score, 50, 15);
      //Ammo display info
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(50 + 7 * i, 25, 4, 30);
      }
      //display game over message
      if (this.game.gameOver) {
        context.textAlign = 'center';
        let msg,
          msg1 = '';
        if (this.game.score > this.game.winningScore) {
          msg = 'YOU WIN ;)';
          msg1 = 'Congratulations';
        } else {
          msg = 'YOU LOST :(';
          msg1 = 'Try again';
        }
        context.font = '50px' + this.fontFamily;
        context.fillText(msg, this.game.width * 0.5, this.game.heigth * 0.1);
        context.font = '35px' + this.fontFamily;
        context.fillText(msg1, this.game.width * 0.5, this.game.heigth * 0.123);
      }
      context.restore();
    }
  }

  // this is the main class the brain of the game
  class Game {
    constructor(width, heigth) {
      this.width = width;
      this.heigth = heigth;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.ammo = 20;
      this.maxAmmo = 30;
      this.ammoTimer = 0;
      this.ammoInterval = 500;
      this.enemyTimer = 0;
      this.enemyInterval = 2000;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 10;
    }
    update(deltaTime) {
      this.player.update();
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.collision(this.player, enemy)) {
          enemy.markedForDeletion = true;
        }
        this.player.projectiles.forEach((projectile) => {
          if (this.collision(projectile, enemy)) {
            enemy.live--;
            projectile.markedForDeletion = true;
            if (enemy.live <= 0) {
              // this.enemies.splice(i, 1);
              // this.score += enemy.score;
              enemy.markedForDeletion = true;
              this.score += enemy.score;
              if (this.score > this.winningScore) this.gameOver = true;
            }
          }
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => enemy.draw(context));
    }
    addEnemy() {
      this.enemies.push(new enemyChild(this));
    }
    collision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y + rect2.y > rect2.heigth &&
        rect1.heigth + rect1.y > rect2.y
      );
    }
  }

  const game = new Game(canvas.width, canvas.heigth);
  let lastTime = 0;

  //animation loop

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.heigth);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate(0);
});
