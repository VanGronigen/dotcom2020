/*
IDEAS AND TO DO

POWERS:
HALO: No damage, each hit gives player health
PYRAMID: No movement, bullets will aim directly at touch input xy
DIAMOND: Can't shoot, no damage, player "reflect bullets" shoots bullet x 5 speed immediately after being hit
Melee: Can't shoot but enemies are defeated by player colliding with enemy, Letter is not added to PassWord 

*/

var player;

Entity = function(type,id,x,y,width,height,img){
	var self = {
		type:type,
		id:id,
		x:x,
		y:y,
		width:width,
		height:height,
		img:img,
		
	};
	self.update = function(){
		self.updatePosition();
		self.draw();
	};
	self.draw = function(){
		ctx.save();
		var x = self.x - self.width/2;
		var y = self.y - self.height/2;
		//var x = self.x - player.x;
		//var y = self.y - player.y;
		
		//x += WIDTH/2;
		//y += HEIGHT/2;
		
		//x -= self.width/2;
		//y -= self.height/2;
		
		ctx.drawImage(self.img,
			0,0,self.img.width,self.img.height,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	};
	self.getDistance = function(entity2){	//return distance (number)
		var vx = self.x - entity2.x;
		var vy = self.y - entity2.y;
		return Math.sqrt(vx*vx+vy*vy);
	};

	self.testCollision = function(entity2){	//return if colliding (true/false)
		var rect1 = {
			x:self.x-self.width/2,
			y:self.y-self.height/2,
			width:self.width,
			height:self.height,
		};
		var rect2 = {
			x:entity2.x-entity2.width/2,
			y:entity2.y-entity2.height/2,
			width:entity2.width,
			height:entity2.height,
		};
		return testCollisionRectRect(rect1,rect2);
		
	};
	self.updatePosition = function(){};
	
	return self;
};

Player = function(){
	var self = Actor('player','myId',50,40,150,150,Img.player,10,1,0,2);
	
	
	var super_update = self.update;
	self.update = function(){
		super_update();
		if(self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp || self.touchDown)
			{self.spriteAnimCounter += 0.2;}
		if(self.pressingSpace)
			{
			 self.performAttack();
			pShoot.play();
			}
		if(self.pressingMouseRight)
			{self.performSpecialAttack();}
	};	
	
	self.updatePosition = function(){
		
		//self.x += velx;//velocityx;
		//self.y += vely;//velocityy;
		
		if(self.pressingRight)
			{self.x += 10;}
		if(self.pressingLeft)
			{self.x -= 10;}	
		if(self.pressingDown)
			{self.y += 10;}	
		if(self.pressingUp)
			{self.y -= 10;}
		
		
		//ispositionvalid
		
		if(self.x < self.width/2)
			{self.x = self.width/2;}
		if(self.x > WIDTH-self.width/2)
			{self.x = WIDTH - self.width/2;}
		if(self.y < self.height/2)
			{self.y = self.height/2;}
		if(self.y > HEIGHT - self.height/2)
			{self.y = HEIGHT - self.height/2;}
		
	};
	
	self.onDeath = function(){
		var timeSurvived = Date.now() - timeWhenGameStarted;		
		console.log("You lost! You survived for " + timeSurvived + " ms.");		
		startNewGame();
		pShoot.play();
	};
	self.pressingDown = false;
	self.pressingUp = false;
	self.pressingLeft = false;
	self.pressingRight = false;
	
	self.pressingMouseLeft = false;
	self.pressingMouseRight = false;
	
	return self;
	
};

Actor = function(type,id,x,y,width,height,img,hp,atkSpd){
	var self = Entity(type,id,x,y,width,height,img);
	
	self.hp = hp;
	self.hpMax = hp;
	self.atkSpd = atkSpd;
	self.attackCounter = 0;
	self.aimAngle = 90;
	self.spriteAnimCounter = 0;
	self.dir = -1;
	self.draw = function(){
		ctx.save();
		var x = self.x;// - player.x;
		var y = self.y;// - player.y;
		
		//x += WIDTH/2;
		//y += HEIGHT/2;
		
		x -= self.width/2;
		y -= self.height/2;
		
		var frameWidth = self.img.width/3;
		var frameHeight = self.img.height/3;
		
		var aimAngle = self.aimAngle;
		//if(aimAngle < 0)
			//{aimAngle = 360 + aimAngle;}
		
		var directionMod = 2;	//draw right
		if(aimAngle >= 45 && aimAngle < 135)	//down
			{directionMod = 2;}
		else if(aimAngle >= 135 && aimAngle < 225)	//left
			{directionMod = 1;}
		else if(aimAngle >= 225 && aimAngle < 315)	//up
			{directionMod = 0;}
		
		var walkingMod = Math.floor(self.spriteAnimCounter) % 2;//1,2
		
		ctx.drawImage(self.img,
			walkingMod*frameWidth,directionMod*frameHeight,frameWidth,frameHeight,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	};
	
	var super_update = self.update;
	self.update = function(){
		super_update();
		self.attackCounter += self.atkSpd;
		if(self.hp <= 0)
			{self.onDeath();}
	};
	self.onDeath = function(){};
	
	self.performAttack = function(){
		if(self.attackCounter > 5){	//150 every 6 sec
			self.attackCounter = 0;
			Bullet.generate(self);
			
			
		}
	};
	
	self.performSpecialAttack = function(){
		if(self.attackCounter > 50){	//every 1 sec
			self.attackCounter = 0;
			/*
			for(var i = 0 ; i < 360; i++){
				Bullet.generate(self,i);
			}
			*/
			Bullet.generate(self,self.aimAngle - 5);
			Bullet.generate(self,self.aimAngle);
			Bullet.generate(self,self.aimAngle + 5);
		}
	};

	
	return self;
};

//#####

Enemy = function(id,x,y,width,height,img,hp,atkSpd){
	var self = Actor('enemy',id,x,y,width,height,img,hp,atkSpd);
	Enemy.list[id] = self;
	
	self.toRemove = false;
	
	
	var super_update = self.update; 
	self.update = function(){
		super_update();
		self.spriteAnimCounter += 0.2;
		self.updateAim();
		self.performAttack()
	};
	self.updateAim = function(){
		var diffX = player.x - self.x;
		var diffY = player.y - self.y;
		
		self.aimAngle = Math.atan2(diffY,diffX) / Math.PI * 180
	};
	var super_draw = self.draw; 
	self.draw = function(){
		super_draw();
		var x = self.x - player.x;
		var y = self.y - player.y - self.height/2 - 20;
		
		ctx.save();
		ctx.fillStyle = 'red';
		var width = 100*self.hp/self.hpMax;
		if(width < 0)
			{width = 0;}
		ctx.fillRect(x-50,y,width,10);
		
		ctx.strokeStyle = 'black';
		ctx.strokeRect(x-50,y,100,10);
		
		ctx.restore();
	
	};
	
	self.onDeath = function(){
		self.toRemove = true;
	};
	
	self.updatePosition = function(){
		var diffX = player.x - self.x;
		var diffY = player.y - self.y;
		
		if(diffX > 0)
			{self.x += 3;}
		else
			{self.x -= 3;}
			
		if(diffY > 0)
			{self.y += 3;}
		else
			{self.y -= 3;}
	self.dir = 1;
	};
};

Enemy.list = {};

Enemy.update = function(){
	if(frameCount % 99 === 0)	//every 4 sec
		{Enemy.randomlyGenerate();}
	for(var key in Enemy.list){
		Enemy.list[key].update();
	}
	for(var key in Enemy.list){
		
		if(Enemy.list[key].toRemove)
			
			delete Enemy.list[key];
			
	}
}

Enemy.randomlyGenerate = function(){
	//Math.random() returns a number between 0 and 1
	var x = Math.random()*WIDTH;
	var y = Math.random()*HEIGHT/8-100;
	var height = 100;
	var width = 100;
	var id = Math.random();
	if(Math.random() < 0.30) //id,x,y,width,height,img,hp,atkSpd
		Enemy(id,x,y,width,height,Img.FOne,2,0.1);
	else if (0.3 < Math.random() < 0.55)
		Enemy(id,x,y,width,height,Img.FTwo,1,0.2);
	else if (0.55 < Math.random() < 0.75)
		Enemy(id,x,y,width,height,Img.FThree,1,0);
	else if (0.75< Math.random() < 0.90)
		Enemy(id,x,y,width,height,Img.FFour,1,0);
	else if (0.90 < Math.random() < 0.99)
		Enemy(id,x,y,width,height,Img.FFive,1,0);
	
}

//#####
Upgrade = function (id,x,y,width,height,category,img){
	var self = Entity('upgrade',id,x,y,width,height,img);
	
	self.category = category;
	Upgrade.list[id] = self;
}

Upgrade.list = {};

Upgrade.update = function(){
	if(frameCount % 2500 === 0)	//every 3 sec
		Upgrade.randomlyGenerate();
	for(var key in Upgrade.list){
		Upgrade.list[key].update();
		var isColliding = player.testCollision(Upgrade.list[key]);
		if(isColliding){
			if(Upgrade.list[key].category === 'score')
				score += 1000;
			if(Upgrade.list[key].category === 'atkSpd')
				player.atkSpd += 3;
			delete Upgrade.list[key];
		}
	}
}	

Upgrade.randomlyGenerate = function(){
	//Math.random() returns a number between 0 and 1
	var x = Math.random()*WIDTH;
	var y = Math.random()*HEIGHT;
	var height = 32;
	var width = 32;
	var id = Math.random();
	
	if(Math.random()<0.5){
		var category = 'score';
		var img = Img.upgrade1;
	} else {
		var category = 'atkSpd';
		var img = Img.upgrade2;
	}
	
	Upgrade(id,x,y,width,height,category,img);
}

//#####
Bullet = function (id,x,y,spdX,spdY,width,height,combatType){
	var self = Entity('bullet',id,x,y,width,height,Img.bullet);
	
	self.timer = 0;
	self.combatType = combatType;
	self.spdX = 0;
	self.spdY = spdY
	
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
		/*		
		if(self.x < 0 || self.x > WIDTH){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > HEIGHT){
			self.spdY = -self.spdY;
		}
		*/
	}
	
	
	Bullet.list[id] = self;
}

Bullet.list = {};

Bullet.update = function(){
	for(var key in Bullet.list){
		var b = Bullet.list[key];
		b.update();
		
		var toRemove = false;
		b.timer++;
		if(b.timer > 30){
			toRemove = true;
		}
		
		if(b.combatType === 'player'){	//bullet was shot by player
			for(var key2 in Enemy.list){
				if(b.testCollision(Enemy.list[key2])){
					toRemove = true;
					Enemy.list[key2].hp -= 1;
				}				
			}
		} else if(b.combatType === 'enemy'){
			if(b.testCollision(player)){
				toRemove = true;
				player.hp -= 1;
				console.log("console is consoling");
			}
		}	
		
		
		if(toRemove){
			delete Bullet.list[key];
		}
	}
}

Bullet.generate = function(actor,aimOverwrite){
	//Math.random() returns a number between 0 and 1
	var x = actor.x;
	var y = actor.y;
	var height = 50;
	var width = 50;
	var id = Math.random();
	
	 
	/*
	var angle;
	
	
	if(aimOverwrite !== undefined && actor.enemy)
		angle = aimOverwrite;
	else angle = actor.aimAngle;
	
	var spdX = Math.cos(angle/180*Math.PI)*55;
	var spdY = Math.sin(angle/180*Math.PI)*55;
	*/
	var spdX = 0 * actor.dir;
	var spdY = 50 * actor.dir;
	Bullet(id,x,y,spdX,spdY,width,height,actor.type);
}

/*
Change log
5/23 - added player.x/y to the eventlistener in html, commented out self.x/y + velx/y in Player class
5/24 - widened screen resolution from 900 x 1600 to 999 x 1600
*/
