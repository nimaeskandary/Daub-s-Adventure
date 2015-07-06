/* NAVIGATING IS MADE EASIER BY USING CONTROL+F (COMMAND+F FOR MAC) AND SEARCHING FOR FUNCTIONS ON THE API 
OR FOR SEARCHING FOR ONE OF THESE FOUR TAGS:
	- GAME: MORE UNIVERSAL FUNCTIONS
	- DESKTOP: FUNCTIONS FOR THE DESKTOP MODE OF THE GAME
	- SIDESROLLER: FUNCTIONS FOR THE SIDESCROLLER MODE OF THE GAME
	- TYPEWRITER: FUNCTIONS FOR THE DIALOGUE BOX SYSTEM
	- MAPS: ARRAYS FOR THE SIDESCROLLER MAPS
*/
//////////////////////////////////////////////GAME
var addScore = function(input){ //increments the player's score
	gameVar.score += input;
	playerVar.score += input;
}
var callBack = function(){ //gamequery callback loop, the loop is called every 15 milliseconds
    $.playground().registerCallback(function(){
		input(); //keytracking function
		if(getState() === 'desktop') callBackD(); //calls a seperate desktop function if the game is in desktop mode
		else if(getState() === 'sidescroller') callBackS(); //calls a seperate sidescroller function if the game is in sidescroller mode
		if(getText() !== false) callBackR(); //calls a seperate typewriter function if the game is in typewriter mode
	},15); 
}
var changeState = function(s){ //switches the state of the game between DESKTOP and SIDESCROLLER
	gameVar.state = s;
}
var getLevel = function(){ //returns the game's level
	return gameVar.level;
}
var getPlayerSC = function(){ //returns player's step count
	return playerStats.stepCount;
}
var getScore = function(){ //returns the player's score
	return gameVar.score;
}
var getSprite = function(name){ //returns a specefic sprite
	return gameVar.gameSprites[name];
}
var getState = function(){ //returns the state of the game
	return gameVar.state;
}
var getStory = function(){ //returns text for the dialogue box, removes story elements after they are used 
	var temp = gameVar.story[0];
	if(gameVar.story.length > 1)gameVar.story = gameVar.story.splice(1,gameVar.story.length);
	return temp;
}
var input = function(){ //the keytracking function
	if(jQuery.gameQuery.keyTracker[27]){ //esc key to reload page
			location.reload();
    	}
    if(getText() !== false) advanceText(); //checks to see if dialogue box has to be advanced
	else if(getState() === 'desktop'){ //seperate block for desktop mode of the game
		if(jQuery.gameQuery.keyTracker[65] && jQuery.gameQuery.keyTracker[87]){ //left (a) + up(w)
			movePlayerD(-3.54, -3.54); 
			animatePlayerD("Up");
		} else if(jQuery.gameQuery.keyTracker[68] && jQuery.gameQuery.keyTracker[87]){ //right (d) + up(w)
			movePlayerD(3.54, -3.54);
			animatePlayerD("Up");
		} else if(jQuery.gameQuery.keyTracker[65] && jQuery.gameQuery.keyTracker[83]){ //left (a) + down(s)
			movePlayerD(-3.54, 3.54);
			animatePlayerD("Down");
		} else if(jQuery.gameQuery.keyTracker[68] && jQuery.gameQuery.keyTracker[83]){ //right (d) + down(s)
			movePlayerD(3.54, 3.54);
			animatePlayerD("Down");
		} else if(jQuery.gameQuery.keyTracker[65] && jQuery.gameQuery.keyTracker[68]){ //left (a) + right (d)
			movePlayerD(0, 0);	 //because player is attempting to move in opposite directions no movement occurs
		} else if(jQuery.gameQuery.keyTracker[87] && jQuery.gameQuery.keyTracker[83]){ //up (w) + down (s)
				movePlayerD(0, 0);  //because player is attempting to move in opposite directions no movement occurs
		} else{
			if(jQuery.gameQuery.keyTracker[65]){ //left (a)
				movePlayerD(-5, 0);
				animatePlayerD("Left");
			} 
			if(jQuery.gameQuery.keyTracker[68]){ //right (d)
				movePlayerD(5, 0);
				animatePlayerD("Right");
			} 
			if(jQuery.gameQuery.keyTracker[87]){ //up (w)
				movePlayerD(0, -5);
				animatePlayerD("Up");
			} 
			if(jQuery.gameQuery.keyTracker[83]){ //down (s)
				movePlayerD(0, 5);
				animatePlayerD("Down");
			}
		}
	} else if(getState() === 'sidescroller'){ //seperate block for sidescroller mode of the game
		if(jQuery.gameQuery.keyTracker[68] && isValid('player','right')){ //right (d)
			if($('#playerSprite').x() < 175) movePlayerS(5); //doesnt move the player past a specefic point on the screen, this is because the map scrolls
			else scroll(); //scrolls the map
			animatePlayerS('Right');
		}
		if(jQuery.gameQuery.keyTracker[65] && isValid('player','left')){ //left (a)
			movePlayerS(-5);
			animatePlayerS('Left');
		}
		if(jQuery.gameQuery.keyTracker[87]){ //up (w)
			jQuery.gameQuery.keyTracker[87] = false; //so the key isn't sticky
			jump();
		} 
		if(jQuery.gameQuery.keyTracker[32]){ //shoot (space)
			jQuery.gameQuery.keyTracker[32] = false; //so the key isnt sticky
			playerShoot();
		} 
	}
}
var music = function(effect,name){ //(if true will not overwrite background music,name of sound) name of sound can be none to pause music
	if(gameVar.muted === false){ //checks to see if the game is muted
		if(effect){ //if effect is true then the sound is only a brief sound effect
			var bit = document.getElementById(name);
			if(bit.duration > 0 && !bit.paused){ //already playing
                bit.pause();
                bit.currentTime = 0;
                bit.play();
            }else{ //not playing
                bit.play();    
            }
		} 
		else if(name==='none') gameVar.music.pause(); //pauses the background music if name is none
		else { //changes the background music
			gameVar.music.pause();
			gameVar.music = document.getElementById(name);
			gameVar.music.play();
		}
	}
}
var nextLevel = function(){ //increments the game's level
	gameVar.level = (parseInt(gameVar.level)+1).toString();
}
var setPlayerSC = function(){ //increments player's step count if < 12, else sets it as 0
	if(getPlayerSC() > 12 ) playerStats.stepCount = 0;
	else playerStats.stepCount++; 
}
var setSprites = function(){ //prepares many sprites that will be used throughout the game
	gameVar.gameSprites["icon1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:124,offsety:62});
	gameVar.gameSprites["icon2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:185,offsety:62});
	gameVar.gameSprites["icon3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:124,offsety:184});
	gameVar.gameSprites["icon4"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:246,offsety:123});
	gameVar.gameSprites["icon5"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:124,offsety:123});
	gameVar.gameSprites["extra1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:246,offsety:62});
	gameVar.gameSprites["extra2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:185,offsety:123});
	gameVar.gameSprites["playerUp1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:1,offsety:62});
	gameVar.gameSprites["playerUp2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:42,offsety:62});
	gameVar.gameSprites["playerUp3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:83,offsety:62});
	gameVar.gameSprites["playerDown1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:1,offsety:1});
	gameVar.gameSprites["playerDown2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:42,offsety:1});
	gameVar.gameSprites["playerDown3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:83,offsety:1});
	gameVar.gameSprites["playerRight1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:1,offsety:184});
	gameVar.gameSprites["playerRight2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:42,offsety:184});
	gameVar.gameSprites["playerRight3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:83,offsety:184});
	gameVar.gameSprites["playerLeft1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:1,offsety:123});
	gameVar.gameSprites["playerLeft2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:42,offsety:123});
	gameVar.gameSprites["playerLeft3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:83,offsety:123});
	gameVar.gameSprites["playerSRight1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:124,offsety:1});
	gameVar.gameSprites["playerSRight2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:155,offsety:1});
	gameVar.gameSprites["playerSRight3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:186,offsety:1});
	gameVar.gameSprites["playerSLeft1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:6,offsety:123});
	gameVar.gameSprites["playerSLeft2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:45,offsety:123});
	gameVar.gameSprites["playerSLeft3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:87,offsety:123});
	gameVar.gameSprites["playerSJump"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:248,offsety:1});
	gameVar.gameSprites["playerSDamage"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:217,offsety:1});
	gameVar.gameSprites["playerSShoot"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:279,offsety:1});
	gameVar.gameSprites["Lv2L1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:1,offsety:245});
	gameVar.gameSprites["Lv2L2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:32,offsety:245});
	gameVar.gameSprites["Lv2L3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:63,offsety:245});
	gameVar.gameSprites["Lv2R1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:1,offsety:306});
	gameVar.gameSprites["Lv2R2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:32,offsety:306});
	gameVar.gameSprites["Lv2R3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:63,offsety:306});
	gameVar.gameSprites["Lv1F"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:94,offsety:245});
	gameVar.gameSprites["Lv1L"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:94,offsety:307});
	gameVar.gameSprites["Lv1R"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:94,offsety:276});
	gameVar.gameSprites["Lv3F"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:125,offsety:245});
	gameVar.gameSprites["Lv3L"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:186,offsety:308});
	gameVar.gameSprites["Lv3R"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:125,offsety:306});
	gameVar.gameSprites["bossProjectile"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:94,offsety:338});
	gameVar.gameSprites["bossF"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:1,offsety:367});
	gameVar.gameSprites["bossL"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:123,offsety:367});
	gameVar.gameSprites["bossR"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:62,offsety:367});
	gameVar.gameSprites["black"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:217,offsety:184});
	gameVar.gameSprites["floor1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:186,offsety:215});
	gameVar.gameSprites["floor2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:186,offsety:246});
	gameVar.gameSprites["floor3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:186,offsety:277});
	gameVar.gameSprites["floor4"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:248,offsety:215});
	gameVar.gameSprites["floor5"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:248,offsety:246});
	gameVar.gameSprites["floorTop1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:217,offsety:215});
	gameVar.gameSprites["floorTop2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:217,offsety:246});
	gameVar.gameSprites["floorTop3"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:217,offsety:277});
	gameVar.gameSprites["floorTop4"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:279,offsety:215});
	gameVar.gameSprites["floorTop5"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:279,offsety:246});
	gameVar.gameSprites["health"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:279,offsety:277});
	gameVar.gameSprites["ammo"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:186,offsety:184});
	gameVar.gameSprites["wire1"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:248,offsety:184});
	gameVar.gameSprites["wire2"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:279,offsety:184});
	gameVar.gameSprites["platform"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:248,offsety:277});
	gameVar.gameSprites["coin"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:248,offsety:307});
	gameVar.gameSprites["explosion"] = new $.gQ.Animation({imageURL:'Images/spritesheet.png',offsetx:279,offsety:307});
	gameVar.gameSprites["binary"] = new $.gQ.Animation({imageURL:'Images/binary2.png'});
}
var setStory = function(){ //sets the story elements for the dialogue in order of how they will be called
	gameVar.story[0] = [ //when the game starts level 1
			new text('Whoa....','.............................','Where am I?','.............................','green',false),
			new text('Hello! Let me introduce myself,','My name is Professor Daub, and I am your creator','','','blue',false),
			new text('Let\'s see, what should we name you?','Oh, I know!: The Dynamic Automaton (that) Unearths Bugs...','AKA, D.A.U.B','I created you for one purpose: to battle computer infections','blue',false),
			new text('Battling infections can be nasty business','When you\'re ready, you\'ll be doing so on your own','I\'ll help you out for now','','blue',false),
			new text('Press [P] at any time to pause and view game instructions','Take a look now!','When you\'re done, go check out the downloads folder [WASD]','','blue',false),
			new text('Okay got it Professor!','','*Use W A S and D to navigate to the Downloads folder','','green',false)
		];
	gameVar.story[1] = [ //touch downloads folder level 1
			new text('WARNING: INFECTION DETECTED', 'Are you ready to investigate?','','YES [E] <-------> NO [D]','red','icon1')
		];
	gameVar.story[2] = [ //enter downloads folder level 1
			new text('What just happened?','I don\'t think I\'m on Desktop of this computer anymore...','','','green',false),
			new text('You\'re right D.A.U.B., welcome to level 1!','You\'ve traveled deep into the contents of the downloads folder','It appears this directory has been infected by some sort of malware','It\'s your job D.A.U.B, to purge them','blue',false),
			new text('Press [P] to view the intructions','Watch out for malware, because touching them will corrupt your RAM','If you run of RAM, you\'re process will be terminated!','Collect power-ups to replenish RAM and AMMO, Good luck!','blue',false),
			new text('Okay Professor, I\'m ready!','*Use A and D to move, and W to jump','*Don\'t forget to press W twice to double jump','*Use SPACE to fire discs at malware to destroy them','green',false)
		];
	gameVar.story[3] = [ //back to desktop level 2
			new text('Wow D.A.U.B, I\'m impressed!','It appears that a powerful web bot virus has infected this computer','That directory was the first of many to be infected by his minions','Do what you have to do D.A.U.B, and find a way to destroy him!','blue',false),
			new text('I understand my true purpose now','I\'ll do whatever it takes to find that web bot!','*Continue investigating directories on this Desktop','*After enough have been purged, the virus will be found','green',false)
		];
	gameVar.story[4] = [ //touch launcher icon level 2
			new text('WARNING: INFECTION DETECTED', 'Are you ready to investigate?','','YES [E] <-------> NO [D]','red','icon2')
		];
	gameVar.story[5] = [ //enter launcher icon level 2
			new text('I\'ve entered the contents of some sort of Internet Browser','First the Downloads Folder and now this...','I suppose it could just be a coincidence, time for level 2.','','green',false),
			new text('No D.A.U.B, unlikely, there\'s a clear pattern here:','Our web bot virus found entrance to the computer through this browser','It would explain why the Downloads folder','was one of the first infected sites','blue',false),
			new text('*Gasp* What an insidious mechanism','To prey on an unwitting user\'s internet habits','I\'ll make sure to purge this directory with extra special care','*Collect coins and destroy minions to accumulate a higher score','green',false)
		];
	gameVar.story[6] = [ //back to desktop level 3
			new text('Great work D.A.U.B','It seems you\'re getting the hang of this','I\'m sure that web bot virus is shaking in his','hard drive partition right about now','blue',false),
			new text('He better be','It\'s time to clear out another directory of his minions','I\'d bet my bytes he\'s infected somewhere containing user data...','','green',false)
		];
	gameVar.story[7] = [ //touch sd level 3
			new text('WARNING: INFECTION DETECTED', 'Are you ready to investigate?','','YES [E] <-------> NO [D]','red','icon3')
		];
	gameVar.story[8] = [ //enter sd level 3
			new text('Yep, I was right', 'Looks like he\'s been snooping around','Profesor Daub\'s removable SD card...','','green',false),
			new text('WhAt!?!?','Get these minions out of here right now!','This is absurd...','O, and try not to look around too much while you\'re at it','blue',false),
			new text('Yeah sure thing Profesor....','Time for level 3!','','','green',false)
		];
	gameVar.story[9] = [ //back to desktop level 4
			new text('Wow what a relief D.A.U.B','Let\'s just forget about that whole episode','There\'s one more directory you have to purge','before finding the web bot','blue',false)
		];
	gameVar.story[10] = [ //touch trash level 4
			new text('WARNING: INFECTION DETECTED', 'Are you ready to investigate?','','YES [E] <-------> NO [D]','red','icon4')
		];
	gameVar.story[11] = [ //enter trash level 4
			new text('Ha, I bet that virus never thought you\'d look in the trash','Good thinking!','','','blue',false),
			new text('Thanks..','But something about all this makes me feel a little dirty','I\'ll have to reformat my partition when this is all over','Here I come, level 4!','green',false)
		];
	gameVar.story[12] = [ //back to desktop level 5
			new text('You\'ve come a long way D.A.U.B','Now that all the directories have been purged of','his minions, you can finally go after that dastardly fiend','','blue',false),
			new text('Hmm.. this web bot won\'t go down easy','He\'s likely positioned himself in a directory containing','data critical to the user','','green',false)
		];
	gameVar.story[13] = [ //touch tax level 5
			new text('WARNING: INFECTION DETECTED', 'Are you ready to investigate?','','YES [E] <-------> NO [D]','red','icon5')
		];
	gameVar.story[14] = [ //enter tax level 5
			new text('My tax deductable!..this must be the 5th and final level.','What a sophisticated web bot boss...','He\'s had access to my credentials this whole time...','Good luck D.A.U.B! I have to go call my bank.','blue',false)
		];
	gameVar.story[15] = [ //enter desktop level 6
			new text('WOW! You defeated that web bot all by yourself!','My precious creation..so clean, so fast.','If only you could get my life savings back, too!','Oh well! You\'ve done quite well D.A.U.B','blue',false),
			new text('But don\'t think you\'re finished yet!','There\'s one thing left for you to do','Head on over to Sublime and take a look at your source code.','Thank you. I am forever grateful.','blue',false)
		];
}
//////////////////////////////////////////////END GAME
//////////////////////////////////////////////DESKTOP
var animatePlayerD = function(direction){ //player animate function [desktop], uses step count to space out the animation of the player, makes it look like player is walking
		$('#playerSprite').setAnimation(getSprite("player" + direction + "1")); //sprites are named in a system that allows for them to easily be called in order
		if(getPlayerSC() > 4 && getPlayerSC() < 9){
			$('#playerSprite').setAnimation(getSprite("player" + direction + "2"));
		} else if(getPlayerSC() >= 9){
			$('#playerSprite').setAnimation(getSprite("player" + direction + "3"));
		}
		setPlayerSC();
}
var callBackD = function(){ //branches off main callback that is called every 15 milliseconds
	collisionD(); //checks for collisions on desktop
}
var collisionD = function(){ //checks for collisions with icons
	var collided = $('#playerSprite').collision();
	if(collided.length > 0 && getText() === false){
		if(collided[0].id === 'icon6' && getLevel() === '6'){ //credits on level 6
					changeState('paused');
					$('#playground').append('<div id="credits"></div>'); //adds credits scene
					$('#credits').fadeTo(500,1);
				}
		else if(collided[0].id === ('icon' + getLevel())){ //if the icon touched matches the level's specefic icon it triggers the story which will eventually propell the game to the sidescroller mode
			dialogue();
		}
	}
}
var checkTime = function(i){ //updates the time for the realtime clock on the desktop
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
var makeDesktop = function(level){ //makes the desktop for a given level
	removeBars(); //removes health and ammo bars
	music(false,'desktop'); //changes the background music
	if(getLevel() === '6') music(false,'won');
	$('#playground').css('background-image','url(Images/desktop.png)'); //changes the background image
	$.playground().addGroup('desktop',{height: 600, width: 600}) //adds the actors of desktop to the game
		.addGroup('actors',{height: 600, width: 600})
			.addSprite('icon1', {animation:getSprite('icon1'),width:60,height:60, posx: 60, posy:60})
			.addSprite('icon2', {animation:getSprite('icon2'),width:60,height:60, posx: 60, posy:180})
			.addSprite('icon3', {animation:getSprite('icon3'),width:60,height:60, posx: 60, posy:300})
			.addSprite('icon4', {animation:getSprite('icon4'),width:60,height:60, posx:500, posy:60})
			.addSprite('icon5', {animation:getSprite('icon5'),width:60,height:60, posx: 60, posy:420})
			.addSprite('extra1', {animation:getSprite('extra1'),width:60,height:60, posx: 180, posy:60})
			.addSprite('icon6', {animation:getSprite('extra2'),width:60,height:60, posx: 180, posy:180})
			.addSprite('playerSprite',{animation:getSprite('playerDown1'),width:40,height:60,posx:600/2,posy:600/2})
		.end()
	.end();
	dialogue(); //starts the story
	startTime(); //starts the realtime clock on the bottom right of the screen
}
var movePlayerD = function(xdis, ydis){ //player move function	[desktop]
	if(($('#playerSprite').x()+xdis) > 0 && ($('#playerSprite').x()+xdis) < 600 - 40) //boundaries for the left side of the screen
			$('#playerSprite').x($('#playerSprite').x()+parseInt(xdis)); //changes the x coordinate of the player
	if(($('#playerSprite').y()+ydis) > 0 && ($('#playerSprite').y()+ydis) < 600 - 90) //boundaries for the right side of the screen
			$('#playerSprite').y($('#playerSprite').y()+parseInt(ydis)); //changes the y coordinate of the player
}
var startTime = function(){ // the clock for the desktop
	$('#desktop').append('<div id="time"></div>');
	try{
    	var today=new Date();
    	var h=today.getHours();
    	if(h > 12) h = (h-12);
    	var m=today.getMinutes();
    	var s=today.getSeconds();
    	m = checkTime(m);
    	s = checkTime(s);
    	document.getElementById('time').innerHTML = '<strong>' + h+":"+m+":"+s + '</strong>';
    	var t = setTimeout(function(){startTime()},500); //constantly changes the time after the initial calling of startTime
	} catch(err){ 
		
	}
}
//////////////////////////////////////////////END DESKTOP
//////////////////////////////////////////////SIDESCROLLER
//****************************WORLD
var callBackS = function(){ //function that branches off main callback that is called every 15 milliseconds
	gravity(); 
	interactionCheck();
	discmovement();
	fillBars();
	animateEnemies();
	enemyAI();
	bossProjectileMovement();
}
var cutScene = function(){ //scales up the binary image slowly before going from desktop to sidescoller
	var i = 4;
	gameVar.cutScene = setInterval(function(){ //scales up the image gradually
		$('#done').scale(i);
		if(i-15<1 && i-15>0) $('#playground').fadeTo(50,.1,function(){$('#playground').fadeTo(100,1);});
		if(i<20) i+=.1;
		else{
			$('#desktop').remove();
			$('#playground').css('background-image','url(Images/Background'+getLevel()+'.png)'); //changes the background image
			makeSidescroller(getLevel()); //makes the sidecroller for a given level
			dialogue(); //starts the story
		}
	},10);
}
var createWorld = function(first,blank){ //first true if initialiing world for first time, blank will spawn a clean map
	if(blank){
			$('#sidescroller').addTilemap('mapArray0', getMapArray(0), getMapAnimations(),{width: 30, height: 30, sizex: 20, sizey: 20, posx: 600}); 
			gameVar.nextMap=0;
	} else{
	if(first){ //makes the starting map scene
		$('#sidescroller').addTilemap('mapArray0', getMapArray(0), getMapAnimations(),{width: 30, height: 30, sizex: 20, sizey: 20, posx: 0}); 
    	gameVar.currentMap = 0;
	}
	var i;
	if(parseInt($('#progressBar').width())<590 || $('#progressBar').width() === null){ //stops spawing maps if the player reached the end of a level
		i = gameVar.currentMap; 
		while(i === gameVar.currentMap){ //makes sure the next map is not the same as the previous map
			i = Math.floor(Math.random() * 10) + 1;
		}
	} else if(getLevel() === '5'){ //if the player goes through the normal ammount of maps but its the boss level the boss map is added on
		i = 12;
	} else i = 11;
	$('#sidescroller').addTilemap('mapArray'+i.toString(), getMapArray(i), getMapAnimations(),{width: 30, height: 30, sizex: 20, sizey: 20, posx: 600}); //spawns the next map off screen
    gameVar.nextMap = i; //saves the index
    addEnemies(i); //adds the enemies on that map
	}
}
var gameOver = function(){ //if the player dies
	removeBars(); //removes the health and ammo bars
	addScore(-playerVar.score); //removes the points acquired that level
	music(false,'none'); //stops the background music
	music(true,'lost'); //sound effect for losing
	changeState('gameover'); 
	$('#sidescroller').remove();
	$('#playground').css('background-image','url(Images/gameover.png)'); //changes the background image
	$('#playground').append('<div id="restartButton">RESTART LEVEL</div>');
	$('#playground').append('<div id="titleButton">TITLE SCREEN</div>');
}
var getMapAnimations = function(){ //each number in a map array refers to a sprite on the spritesheet
	var temp = [];
	temp[0] = getSprite('black');
	temp[1] = getSprite('floor'+getLevel());
	temp[2] = getSprite('floorTop'+getLevel());
	temp[3] = getSprite('platform');
	temp[4] = getSprite('wire1');
	temp[5] = getSprite('wire2');
	temp[6] = getSprite('health');
	temp[7] = getSprite('ammo');
	temp[8] = getSprite('coin');
	temp[9] = getSprite('Lv1F');
	temp[10] = getSprite('Lv2L1');
	temp[11] = getSprite('Lv3F');
	temp[12] = getSprite('bossF');
	return temp;
}
var getMapArray = function(i){ //returns a map array, but gets rid of numbers that refer to enemies beacause another function adds them
	var temp = [];
	for(var j=0;j<gameVar.mapArray[i].length;j++){
			temp[j] = gameVar.mapArray[i][j].slice();
	}
	for(var y=0;y<temp.length;y++){
		for(var x=0;x<temp[y].length;x++){
			if(temp[y][x]>9) temp[y][x] = 0;
		}
	}
	return temp;
}
var makeBars = function(){ //health bar, ammo bar, level progression bar, score display
	$('#playground').append('<div id="progressDiv"><div id="progressBar"></div></div>');
	$('#playground').append('<div id="healthDiv"><div id="healthBar"></div></div>');
	$('#playground').append('<div id="ammoDiv"><div id="ammoBar"></div></div>');
	$('#playground').append('<img class="barIcon" src="Images/health.png" style="left:30px;top:10px;position:absolute;"/>');
	$('#playground').append('<img class="barIcon" src="Images/ammo.png" style="left:300px;top:10px;position:absolute;"/>');
	$('#playground').append('<div id="score"></div>');
}
var fillBars = function(refill){ //refill partially refills a bar, otherwise the bars fill width is changed depending the health, ammo, or score of the player
	if(refill === 'health'){
		playerVar.health += (playerStats.health / 2);
		if (playerVar.health > playerStats.health) playerVar.health = playerStats.health;
	} else if(refill === 'ammo'){
		playerVar.ammo += (playerStats.ammo / 2);
		if (playerVar.ammo > playerStats.ammo) playerVar.ammo = playerStats.ammo;
	}
	var healthPercent = (playerVar.health / playerStats.health * 100).toString() + '%';
	var ammoPercent = (playerVar.ammo / playerStats.ammo * 100).toString() + '%';
	$('#healthBar').css('width',healthPercent);
	$('#ammoBar').css('width',ammoPercent);
	$('#score').text('SCORE: '+getScore().toString());
	if(playerVar.health<=0) gameOver();
}
var makeSidescroller = function(level){ //makes the sidescroller for a given level
	playerVar.health = playerStats.health; //sets the level health to be the stock health
	playerVar.ammo = playerStats.ammo;
	playerVar.jump = playerStats.jump;
	playerVar.score = 0; //score for a specific level starts at zero
	clearInterval(gameVar.cutScene); //stops the loop that was scaling up the cutScene image
	changeState('sidescroller'); //changes the state from desktop to sidescroller
	if(getLevel() !== '5') music(false,'sidescroller'); 
	else music(false,'boss'); //boss level has special music
	$.playground().addGroup('sidescroller',{height: 600, width: 600}); //adds a new group for the sidescroller stage of the game
	$('#sidescroller').addSprite('playerSprite',{animation:getSprite('playerRight1'),width:30,height:60,posx:175,posy:200}); //adds the player sprite
	$('#playerSprite').addClass('playerClass'); //gives the player a special class
	createWorld(true); //spawns the maps
	makeBars(); //adds the health, ammo, and level progress bars and the score
}
var removeBars = function(){ //removes the bars
	$('#progressDiv').remove();
	$('#healthDiv').remove();
	$('#ammoDiv').remove();
	$('.barIcon').remove();
	$('#score').remove();
}
var scroll = function(){ //scrolls the map and the enemies to simulate player movement
	if(gameVar.boss === false || parseInt($('#progressBar').width())<655.55){
		for(var i=0;i<5;i++){
			if(isValid('player','right')){ //if the player can move
				$('#mapArray'+gameVar.currentMap.toString()).x($('#mapArray'+gameVar.currentMap.toString()).x()-3);
				$('#mapArray'+gameVar.nextMap.toString()).x(600+$('#mapArray'+gameVar.currentMap.toString()).x()); //the current map is off screen at this point so really it is subtracting from 600
				if($('#mapArray'+gameVar.nextMap.toString()).x()<=0){
				$('#mapArray'+gameVar.currentMap.toString()).remove();
					var pixels = (parseInt($('#progressBar').width()) + 65.55).toString() + 'px';
					$('#progressBar').css('width',pixels);
					gameVar.currentMap = gameVar.nextMap;
					if(parseInt($('#progressBar').width())<655.55) createWorld(false);
					else createWorld(false,true);
				}
				$('.enemyClass').each(function(){
					$(this).x($(this).x()-3);
					if($(this).x() < 0) $(this).remove();
				});
				$('.explodingDisc').each(function(){
					$(this).x($(this).x()-3);
					if($(this).x() < 0) $(this).remove();
				});
			}
		}
	}
}
var cType = { //classes of actors on the screen
	black: "gQ_tile gQ_tileType_0",
	floor: "gQ_tile gQ_tileType_1",
	floorTop: "gQ_tile gQ_tileType_2",
	platform: "gQ_tile gQ_tileType_3",
	wire1: "gQ_tile gQ_tileType_4",
	wire2: "gQ_tile gQ_tileType_5",
	health: "gQ_tile gQ_tileType_6",
	ammo: "gQ_tile gQ_tileType_7",
	coin: "gQ_tile gQ_tileType_8",
	enemy: "enemyClass"
}
var checkCollisions = function(collisions,itemArray){ //takes in an array of collisions and an array of actors to check against
	for(var j=0;j<collisions.length;j++){
		for(var k=0;k<itemArray.length;k++){
			if($(collisions[j]).hasClass(itemArray[k])) return [true,$('#'+collisions[j].id),collisions[j]]; //if there is a collision returns true, the actor it collidided with, and that actors id
		}
	}
	return [false]; 
}
var isValid = function(actor,direction){ //checks to see if the movement from an actor in a given direction is valid
	if(actor === 'player'){
		if(direction === 'down' && $('#playerSprite').collision({w:28,y:$('#playerSprite').y()+5}).length === 0) return true;
		else if(direction === 'right' && $('#playerSprite').collision({x:$('#playerSprite').x()+3}).length === 0) return true;
		else if(direction === 'left' && $('#playerSprite').collision({x:$('#playerSprite').x()-5}).length === 0 && $('#playerSprite').x() > 0) return true;
		else if(direction === 'up' && ($('#playerSprite').collision({y:$('#playerSprite').y()-10}).length === 0 || $($('#playerSprite').collision({y:$('#playerSprite').y()-10})[0]).hasClass("gQ_tile gQ_tileType_8"))) return true;
	} else if($(actor).hasClass('disc')){
		if(direction === 'right'){
			if($(actor).collision({x:$(actor).x()+2}).length === 0 || checkCollisions($(actor).collision({x:$(actor).x()+2}),['explodingDisc'])[0]) return true;
		}
	} else if($(actor).hasClass('enemyClass')){
		if(direction === 'right'){
			if($(actor).collision({x:$(actor).x()+5}).length === 0 && $(actor).collision({w:1,h:1,x:$(actor).x()+5,y:$(actor).y()+$(actor).height()+1}).length !== 0) return true;
		} else if($(actor).collision({x:$(actor).x()-5}).length === 0 && $(actor).collision({w:1,h:1,x:$(actor).x()-5,y:$(actor).y()+$(actor).height()+1}).length !== 0) return true;
	}
	return false;
}
//****************************END WORLD
//****************************PLAYER
var animatePlayerS = function(direction){ //player animate function
	if((direction === 'Right' || direction === 'Left') && isValid('player','down') === false){ //checks to see that player is not jumping or falling	
		$('#playerSprite').setAnimation(getSprite("playerS" + direction + "1")); //first cycle of 3 image animation
		if(getPlayerSC() > 4 && getPlayerSC() < 9){	//uses step count variable to animate
			$('#playerSprite').setAnimation(getSprite("playerS" + direction + "2"));
		} else if(getPlayerSC() >= 9){
			$('#playerSprite').setAnimation(getSprite("playerS" + direction + "3"));
		}
		setPlayerSC(); //resets step count
	}
}
var interactionCheck = function(){ //checks to see what the player is colliding with
	var playerCollisions = $('#playerSprite').collision({x:$('#playerSprite').x()-5,y:$('#playerSprite').y()-5,w:40,h:70}); //an array of actors the player is touching
	if(checkCollisions(playerCollisions,[cType.black])[0]) gameOver(); //fell into hole
	if(checkCollisions(playerCollisions,[cType.wire2])[0]){ //exit wire for a level goes back to desktop and advances the level
		if(getLevel() !== '5') gameVar.story[0].unshift(new text('Score: ' + gameVar.score.toString(),'Press [SPACE] to view availiable upgrades','All upgrades will remain active for the remainder of the game','','red',false));
		changeState('');
		makeDesktop(nextLevel()); //creates the subsequent level instance of the desktop
		changeState('desktop');
		$('#sidescroller').remove();	
	}
	if(checkCollisions(playerCollisions,[cType.health])[0]){ //health box
		fillBars('health');
		checkCollisions(playerCollisions,[cType.health])[1].remove();
		music(true,'powerup');
	}
	if(checkCollisions(playerCollisions,[cType.ammo])[0]){ //ammo box
		fillBars('ammo');
		checkCollisions(playerCollisions,[cType.ammo])[1].remove();
		music(true,'powerup');
	}
	if(checkCollisions(playerCollisions,[cType.enemy])[0] && checkCollisions(playerCollisions,[cType.enemy])[2] !== $('#playerSprite').collision({y:$('#playerSprite').y()+5})[0]){ //enemy
		playerVar.health--;
		$('#playerSprite').setAnimation(getSprite('playerSDamage'));
		injuryJump();
		music(true,'damage');
	}
	if(checkCollisions(playerCollisions,[cType.coin])[0]){ //coin
		addScore(100);
		checkCollisions(playerCollisions,[cType.coin])[1].remove();
		music(true,'coin');
	}
}
var discmovement = function(){ //moves the player's discs
	try{$(".disc").each(function(){ //loops through every disc
		for(var i=0;i<5;i++){
			if(isValid(this,'right')) $(this).x($(this).x()+2); //if valid moves a disk by 2 pixels
		}
		if($(this).x()>600) $(this).remove(); //removes a disc if it goes off screen
		if(checkCollisions($(this).collision({w:34}),[cType.floor,cType.floorTop,cType.wire1,cType.wire2,cType.health,cType.ammo,cType.platform,cType.coin])[0]) $(this).remove(); //if the disc collides with a map item it gets destroyed
		if(checkCollisions($(this).collision({w:34}),[cType.enemy])[0]){ //if the disc collides with an enemy
			if(upgrades['discsButton']){ //if the exploding disc upgrade was bought an explosion is added to screen
				music(true,'explosion');
				$(this).setAnimation(getSprite('explosion'));
				$(this).removeClass('disc');
				$(this).addClass('explodingDisc');
				var discID = '#'+this.id;
				var s = 2;
				var enlarge = setInterval(function(){ //explosions scales up gradually
					$(discID).scale(s);
					s+=.75;
				},50);
				setTimeout(function(){ //stops disc from enlarging after 500 milliseconds
					clearInterval(enlarge);
					var collisions = $(discID).collision();
					for(var i=0;i<collisions.length;i++){
						if($(collisions[i]).hasClass('enemyClass')) enemyArray[collisions[i].id].health-=2;
					}
					$(discID).remove();
					music(true,'hit');
				},500);
			}
			else{ //removes disc, does damage to enemy
				music(true,'hit');
				enemyArray[$(this).collision({w:34})[0].id].health--;
				$(this).remove();
			}
		}
	})}catch(err){ //catches errors which do not effect gameplay
		
	}
}
var gravity = function(){ //gravity for the player, moves the player 5 pixels down if nothing is below him
	if(isValid('player','down')){ 
		$('#playerSprite').y($('#playerSprite').y()+5);
		$('#playerSprite').setAnimation(getSprite("playerSJump"));
	}
	else{
		if(playerVar.jump !== playerStats.jump) $('#playerSprite').setAnimation(getSprite("playerSRight1"));
		playerVar.jump = playerStats.jump;
	}
}
var jump = function(){ 
	if(playerVar.jump > 0){ //if the player has remaining jumps and nothing is above him he'll jump a max of 100 pixels
		music(true,'jump');
		for(var i=0;i<10;i++){ //gradually rises so doesn't clip into anything
			if(isValid('player','up')) $('#playerSprite').y($('#playerSprite').y()-10);
			$('#playerSprite').setAnimation(getSprite("playerSJump"));
		}
		playerVar.jump--; //decreases avaliable jumps, resets when player touches the ground
	}
}
var injuryJump = function(){ //if the player is damaged he turns red and gets knocked back a bit
		for(var i=0;i<3;i++){
			if(isValid('player','up')) $('#playerSprite').y($('#playerSprite').y()-5);
			if(isValid('player','left')) $('#playerSprite').x($('#playerSprite').x()-5);
		}
}
var movePlayerS = function(xdis){ //player move function
	if(($('#playerSprite').x()+xdis) > 0) //boundaries
			$('#playerSprite').x($('#playerSprite').x()+xdis); //changes the x coordinate of the player
}
var playerShoot = function(){ //shoots dics
	if(playerVar.ammo > 0){
		var name = Math.floor(Math.random()*999999999).toString(); //creates a random id for each disc
		$('#sidescroller').addSprite(name,{animation:getSprite('ammo'),posx:$('#playerSprite').x()+33,posy:$('#playerSprite').y()+25,width:30,height:30}); //adds a disc sprite
		$('#'+name).addClass('disc'); //gives the disc just created a disc class
		if($('#'+name).collision({w:32}).hasClass('disc')) $('#'+name).remove(); //if it is spawned in on another disc gets removed
		else{
			music(true,'disc');
			playerVar.ammo -= 1;
			$('#playerSprite').setAnimation(getSprite('playerSShoot'));
		}
	}
}
//****************************END PLAYER
//****************************ENEMIES
function enemyObject(level){ //enemy object
	this.level = level.toString(); //enemy level
	this.stepCount = 0; //enemy step count, similar animation system to player 
	this.direction = 'left'; //enemy walking direction
	if(level !== 4){ 
		this.shoot = false;
		this.health = level;
	} else {
		this.health = 11; //boss gets 8 health
	}
}
var enemyArray = []; //array that holds all enemies
var addEnemies = function(i){ //function that adds enemies for each new map
    var array = gameVar.mapArray[i];
    for(var y = 0; y<array.length; y++){ //maps are 2d arrays of numbers that reference tiles or enemies
        for(var x = 0; x<array[y].length; x++){
            if(array[y][x] === 10){ // level one enemy is 10 in the map array
                var name = (Math.floor((Math.random() * 999999999))).toString(); //creates a unique name for each new enemy
                $('#sidescroller').addSprite(name,{animation: getSprite('Lv1F'),width: 30, height: 30, posx: x*30 + 600, posy: y*30}); //creates a new enemy at a position corresponding to its location on the array
                $('#'+name).addClass('enemyClass'); //groups all enemies together
                enemyArray[name] = new enemyObject(1); //creates a new level one object
            } else if(array[y][x] === 11){ //level two enemy : 11
                var name = (Math.floor((Math.random() * 999999999))).toString(); 
                $('#sidescroller').addSprite(name,{animation: getSprite('Lv2L1'),width: 30, height: 60, posx: x*30 + 600, posy: y*30}); 
                $('#'+name).addClass('enemyClass');
                enemyArray[name] = new enemyObject(2); 
            } else if(array[y][x] === 12){ //level three enemy: 12
                var name = (Math.floor((Math.random() * 999999999))).toString(); 
                $('#sidescroller').addSprite(name,{animation: getSprite('Lv3F'),width: 60, height: 60, posx: x*30 + 600, posy: y*30}); 
                $('#'+name).addClass('enemyClass'); 
                enemyArray[name] = new enemyObject(3); 
            } else if(array[y][x] === 13){  //web bot boss : 13
                var name = (Math.floor((Math.random() * 999999999))).toString(); 
                $('#sidescroller').addSprite(name,{animation: getSprite('bossF'),width: 60, height: 120, posx: x*30 + 600, posy: y*30}); 
                $('#'+name).addClass('enemyClass'); 
                enemyArray[name] = new enemyObject(4);
                gameVar.boss = true;
            }
        }
    }
}
var animateEnemies = function(){
	$('.enemyClass').each(function(){
		var e = enemyArray[this.id];
		if(e.level === '1'){	// level one enemy animations
			if(e.stepCount < 4) $(this).setAnimation(getSprite('Lv1F'));
			else if(e.stepCount < 9) $(this).setAnimation(getSprite('Lv1R'));
			else $(this).setAnimation(getSprite('Lv1L'));
		} else if(e.level === '2'){	// level two enemy animations
			if(e.direction === 'right'){
				if(e.stepCount < 4) $(this).setAnimation(getSprite('Lv2R1'));
				else if(e.stepCount < 9) $(this).setAnimation(getSprite('Lv2R2'));
				else $(this).setAnimation(getSprite('Lv2R3'));
			} else { 
				if(e.stepCount < 4) $(this).setAnimation(getSprite('Lv2L1'));
				else if(e.stepCount < 9) $(this).setAnimation(getSprite('Lv2L2'));
				else $(this).setAnimation(getSprite('Lv2L3'));
			}
		} else if(e.level === '3'){ // level three enemy animations
			if(e.stepCount < 4) $(this).setAnimation(getSprite('Lv3F'));
			else if(e.stepCount < 9) $(this).setAnimation(getSprite('Lv3R'));
			else $(this).setAnimation(getSprite('Lv3L'));
		} else if(e.level === '4'){ // web bot boss animations
			if(e.stepCount <= 6) $(this).setAnimation(getSprite('bossF'));
			else if(e.stepCount > 6 && e.stepCount <=13 ) $(this).setAnimation(getSprite('bossR'));
			else if(e.stepCount > 13 && e.stepCount <=20 ) $(this).setAnimation(getSprite('bossL'));
			else if(e.stepCount > 20 && e.stepCount <=27 ) $(this).setAnimation(getSprite('bossF'));
			else if(e.stepCount > 27 && e.stepCount <=34 ) $(this).setAnimation(getSprite('bossR'));
			else if(e.stepCount > 34 && e.stepCount <=40 ) $(this).setAnimation(getSprite('bossL'));
			if(e.stepCount > 40) enemyArray[this.id].stepCount = 0;
			setTimeout(function(){ //causes boss battle to begin only after player has had enough time to prepare
				e.shoot = true;
			},4000);
		}
		enemyArray[this.id].stepCount++;
		if(e.stepCount > 12 && e.level !== '4') enemyArray[this.id].stepCount = 0;
		
	});
}
var enemyAI = function(){ // handles enemy movement
	$('.enemyClass').each(function(){
		if($(this).x()<600){ //checks if enemy is on the screen
			var e = enemyArray[this.id];
			if(enemyArray[this.id].level !== '4'){ 
				if(isValid(this,e.direction)){
					if(e.direction === 'right') $(this).x($(this).x()+5);
					else $(this).x($(this).x()-5);
				} else if(e.direction === 'right') enemyArray[this.id].direction = 'left';
				else enemyArray[this.id].direction = 'right';
			} else if(e.shoot){
				bossProjectileMovement(); // handles the movement of the boss projectiles
				if(e.stepCount === 4 || e.stepCount === 8 || e.stepCount === 20 || e.stepCount === 26) bossProjectileLaunch(); // simulates burst fire
			}
			if(e.health<=0){ //if the enemy is exterminated
				addScore(parseInt(enemyArray[this.id].level)*200);
				if(enemyArray[this.id].level === '4') gameVar.boss = false;
				$(this).remove();
			}
		}
	});
}
var bossProjectileLaunch = function(){ // spawns the boss projectile
		var name = Math.floor(Math.random()*999999999).toString();
		$('#sidescroller').addSprite(name,{animation:getSprite('bossProjectile'),posx:400,posy:180,width:20,height:20}); //adds to screen at specified spawn point
		$('#'+name).addClass('bossProjectile');
		music(true,'powerup');

}
var bossProjectileMovement = function(){ // moves the boss projectile
	$('.bossProjectile').each(function(){
		var y = ($("#playerSprite").y() - $(this).y()) * .07; 
		$(this).x($(this).x()-3);
		$(this).y($(this).y()+(0.5)*y);
		if($(this).x() < 0) $(this).remove();
		if(checkCollisions($(this).collision({w:24}),[cType.floor,cType.floorTop,cType.platform])[0]) $(this).remove();
		if($($(this).collision()[0]).hasClass('playerClass')){ // handles collision between boss projectile and player
			$(this).remove(); //removes boss projectile
			playerVar.health--; //subtracts player health
			$('#playerSprite').setAnimation(getSprite('playerSDamage'));
			injuryJump(); //damage knock back
			music(true,'damage');
		} else if($($(this).collision()[0]).hasClass('disc')){ // handles collision between boss projectile and discs
			if(upgrades['discsButton']) music(true,'explosion');
			else music(true,'hit');
			$($(this).collision()[0]).remove(); //removes disc
			$(this).remove(); //removes boss projectile
			
		}
	});
}

//****************************END ENEMIES
//////////////////////////////////////////////END SIDESCROLLER
//////////////////////////////////////////////TYPEWRITER
var advanceText = function(){ //advances to the next text object with e
    	if(jQuery.gameQuery.keyTracker[69]){ //(e) 
    		jQuery.gameQuery.keyTracker[69] = false; //so the key is not sticky
			if(getText().length > 1){ 
				$('#dialogue span').text(''); //clears dialogue box text
				$('#dialogue span').append('</br>');
				setText(getText().splice(1,getText().length));
			} else{
				if(getText()[0].root === 'icon' + getLevel()) cutScene(); //if the player is at a point in the story in which the game goes from desktop to sidescroller
				setText(false);
				$('#dialogue').remove();
			} 
			npc(); 
		} else if(jQuery.gameQuery.keyTracker[68] && getText()[0].root === 'icon' + getLevel()){ //(d) player can refuse to investigate
			jQuery.gameQuery.keyTracker[68] = false;
			if(getText()[0].one === false){
				if(getText()[0].root === 'icon' + getLevel()){
					$('#dialogue span').text('');
					$('#dialogue span').append('</br>');
					setText([new text('I don\'t think you understand D.A.U.B,','You HAVE to investigate..It\'s why I made you!','Are you ready to investigate?','YES [E] <-------> NO [D]','blue','icon'+getLevel())]);
				}
			}
		}
}
var callBackR = function(){ //branches off main callback, called every 15 milliseconds when the dialogue box is active
	npc(); 
	var temp = getText();
	if(temp[0].one !== false){ //prints out the text from the story character by character, line by line
		$('#dialogue').css('color',getText()[0].color); //changes text color
		if(temp[0].one.length === 0){
			$('#dialogue span').append('</br>'); //skips a line
			temp[0].one = temp[0].two;
			temp[0].two = temp[0].three;
			temp[0].three = temp[0].four;
			temp[0].four = false;
		} else {
			$('#dialogue span').append(temp[0].one.substring(0,1));
			temp[0].one = temp[0].one.substring(1,temp[0].one.length);
		}
		setText(temp);
	} else if(temp[0].root === false){ //prompts the user to press e to continue
		$('#dialogue span').append('<span style=;color:#FF0000;font-size:90%;><center>PRESS [E] TO CONTINUE</center></span>');
		temp[0].root = true;
	}
}
var dialogue = function(){ //starts a dialogue box
	var arr = getStory(); //gets the story object the player is at
	if(arr[0].root === 'icon' + getLevel()){ //if this is false then an icon did not trigger the dialogue box, so it is not part of the story that takes player to sidsecroller
		$('#icon'+getLevel()).setAnimation(getSprite('binary'));
		$('#icon'+getLevel()).scale(4);
		document.getElementById(arr[0].root).id = 'done'; //changes the id of whatever started the dialogue so it can't start it again later
	} 
	$('#playground').append('<div id="dialogue"><span></span></div>');  //adds the dialogue boce
	$('#dialogue span').append('</br>');
	setText(arr);
}
var getText = function(){ 
	return gameVar.text;
}
var npc = function(){ //adds and removes npc's (Animations of DAUB and profesor daub that hover over the dialogue box)
	$('.prof').remove();
	$('.daub').remove();
	$('.prof2').remove();
	$('.daub2').remove();
	if(getText()){
		if(getText()[0].color === '#33CCFF'){ //blue color text means profesor is talking
			$('#playground').append('<div class="prof"></div>');
			$('#playground').append('<div class="daub2"></div>');
		}
		else if(getText()[0].color === '#00FF00'){ //green text means daub is talking
			$('#playground').append('<div class="daub"></div>');
			$('#playground').append('<div class="prof2"></div>');
		}
	}
}
var setText = function(arr){
	gameVar.text = arr;
}
function text(one,two,three,four,color,root){ //four strings, red blue or green, the id of an icon that started the dialogue (optional, set to false if no icon prompted it)
	this.one = '>> '+one;
	this.two = '>> '+two;
	this.three = '>> '+three;
	this.four = '>> '+four;
	this.root = root; //the id of an icon that started the dialogue (optional, set to false if no icon prompted it)
	if(color === 'blue') this.color = '#33CCFF';
	else if(color === 'green') this.color = '#00FF00';
	else if(color === 'red') this.color = '#FF0000';
}
//////////////////////////////////////////////END TYPEWRITER
//////////////////////////////////////////////MAPS
/*

The maps for sidescroller are encoded into 2d arrays, where each number will refer to a sprite. For example, a 0 is a 30x30 empty space, a 2 is 30x30 floor tile, and an 11 is a 30x60 level two enemy
black 1
floor 2
floor top 3
platform 4
wire1 5
wire2 6
health 7
ammo 8
coin 9
lv1 10
lv2 11
lv3 12
boss 13
*/
var setMapArray = function(){ //adds all the maps to the maparray in gameVar, main.js
	gameVar.mapArray[0] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[1] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 4, 4, 4, 4, 7, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[2] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 10, 3, 0, 0],
                [ 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3],
                [ 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[3] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 8, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[4] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 10, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[5] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[6] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[7] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[8] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[9] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    gameVar.mapArray[10] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 8, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
	gameVar.mapArray[11] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

//////////////////////////////////////////////BOSS MAP
	gameVar.mapArray[12] =  [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 5, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
                [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
                [ 0, 0, 0, 0, 8, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 6, 0],
                [ 0, 0, 0, 7, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
                [ 0, 0, 8, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0],
                [ 0, 7, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0],
                [ 0, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
                [ 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                [ 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
	
}
//////////////////////////////////////////////END MAPS

