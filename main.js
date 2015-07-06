var gameVar = { 
    state: 'desktop', //the game is either in "desktop" mode or "sidescroller" mode depending on if you're on the desktop screen or investigating a directory
    level: '1', //desktop and sidescroller mode each go through 5 levels, until level 6 ends the game on the desktop
    reading: false, //if the dialoge box is on the screen and the player is reading
    paused: '', //whether the game is paused or not
    story: [], //array that stores the text that will go in the dialouge box
    score: 0, //the player accumulates a score that can be used to buy upgrades
    music: null, //this variable is the background music, not sound effects
    gameSprites: [], //array that holds indivisual animates that are parsed off the spritesheet.png
    text: false, //the current text that will be on the dialogue box
    muted: false, //boolean for whether the game can make sound or not
    cutScene: 0, //cut sceen from desktop to sidescrolelr uses a javascript callback that is ended when it is no longer needed, this varaible holds the id of that callback
    mapArray: [], //array that holds the maps for the sidescroller mode of the game
    currentMap: '', //the index for the current map that is on the screen
    nextMap: '', //the index for the next map that is spawned off screen
    boss: false //boolean for whether the boss is on the screen or not
}
var playerStats = {
    stepCount: 0, //the step count is used to cycle through player animations
    health: 12, //player stock health, used to represent health bar fill and when 0 player dies
    ammo: 15, //player stock ammo, used to represent ammo bar and player can't shoot if it's not greater than 0
    jump:2, //gives player finite jumps, resets when the player touches the ground
    state: '' //state includes things like jumping, used to know what animation to use for the player
}
var playerVar = {}; //playerStats are stock stats but each level parses temp stats for that level, so the original is not altered
var upgrades = []; //boolean that holds possible upgrades and their cost in score
	upgrades['jumpButton'] = false; //triple jump
	upgrades['ammoButton'] = false; //extra ammo
	upgrades['healthButton'] = false; //extra health
	upgrades['discsButton'] = false; //exploding discs
	upgrades['jumpCost'] = 8000;
	upgrades['ammoCost'] = 4000;
	upgrades['healthCost'] = 4000;
	upgrades['discsCost'] = 10000;
$(document).ready(function(){ //preforms actions when the page is ready
    setSprites(); //sets the sprites based off the master sprite
    setStory(); //prepares story text 
    $("#playground").playground({height: 600, width: 600, keyTracker: true}); //initializes the playground, the playground is a gameQuery object that holds the sprites
	$('#startButton').click(function(){ //starts the game when you hit the start button
		if($(this).hasClass('loaded')){
			$('#welcomeScreen').fadeTo(1000,0,function(){ //removes the welcome start screen when the start button is pressed
					$(this).remove();
				});
			$('#playground').append('<div id="difficultyScreen"></div>'); //adds the difficulty selection screen
			$('#difficultyScreen').append('<div class="difficultyButton" id="1" style="left:15px;top:210px;"><strong>EASY</strong></div>');
			$('#difficultyScreen').append('<div class="difficultyButton" id="2" style="left:165px;top:210px;"><strong>NORMAL</strong></div>');
			$('#difficultyScreen').append('<div class="difficultyButton" id="3" style="left:315px;top:210px;"><strong>HARD</strong<</div>');
			$('#difficultyScreen').append('<div class="difficultyButton" id="4" style="left:458px;top:210px;"><strong>INSANE</strong></div>');
		}
	
		});	
});
$(document).on ("click", ".difficultyButton", function () { //the difficulty level button function for when you select difficulty, normal mode uses stock health and ammo and other difficulties alter the stock health and ammo
	if(this.id === '1'){
		playerStats.health +=3;
		playerStats.ammo +=4;
	}
	if(this.id === '3'){
		playerStats.health -=3;
		playerStats.ammo -=4;
	}
	if(this.id === '4'){
		playerStats.health -=6;
		playerStats.ammo -=7;
	}
	$.playground().startGame(function(){ //functions that starts the game
		    gameVar.music = document.getElementById('desktop'); //sets the background music
		    gameVar.music.volume = .3; //the desktop track originally is very loud
		    makeDesktop(1); //makes the level one desktop
			$('#difficultyScreen').fadeTo(1000,0,function(){ //removes the difficulty start screen when a difficulty is selected
				$(this).remove();
			});
			callBack(); //callback function that has triggers events throughout the span of the game
			setMapArray(); //prepares maps for sidescoller mode of the game
		});
});
jQuery(window).load(function(){ //preforms an action when the page is loaded
    $("#startButton").text("");
    $("#startButton").append("<b></br>Time to Fix a Computer!</b>"); //changes the text of the start button
    $('#startButton').addClass('loaded'); //used to know if the game is loaded before someone can start it
});
$("html").on("keydown", function (e) { //prevents the button SPACE from scrolling the page, a default function that some browsers have
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code === 32){ //[space] key
		e.preventDefault();
	}
});
$("html").on("keydown", function (e) { //pause button
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code === 80){ //the [p] key
		if(getState() === 'paused'){ //if p is pressed and the game is already paused it unpauses
			$('#pause').fadeTo(300,0,function(){
				$('#pause').remove(); //removes the pause screen
				changeState(gameVar.paused); //changes the state of the game back to sidescroller or desktop
			});
			$('#audio').remove(); //gets rid of the mute button
		} else{ //pauses the game
			gameVar.paused = getState(); //holds the state that the game was in
			changeState('paused');
			$('#playground').append('<div id="pause"></div>'); //adds pause screen
			$('#pause').fadeTo(500,1);
			$('#playground').append('<div id="audio"></div>'); //adds mute button
			if(gameVar.muted === true) $('#audio').css('background-image','url(Images/audioOff.png)');
		}
	}
});
$("html").on("keydown", function (e) { //upgrades button (SPACE)
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code === 32 && (gameVar.state === 'desktop' || gameVar.state === 'upgrades')){
		if(getState() === 'upgrades'){ //if the upgrades button is pressed and the game was already in that state
			$('#upgrades').fadeTo(300,0,function(){ //changes the game back to desktop mode
				$('#upgrades').remove(); 
				changeState('desktop');
			});
		} else{ //changes the game to upgrades mode
			changeState('upgrades');
			$('#playground').append('<div id="upgrades"></div>');
			$('#upgrades').fadeTo(500,1,function(){
				$('#upgrades').append('<div id="score"></div>'); //shows the player score
				$('#score').text('SCORE: '+getScore().toString());
			});
			$('#upgrades').append('<div id="jumpButton" class="upgradesButton" style="left:480px;top:60px"></div>');
			$('#upgrades').append('<div id="ammoButton" class="upgradesButton" style="left:480px;top:150px"></div>');
			$('#upgrades').append('<div id="healthButton" class="upgradesButton" style="left:480px;top:240px"></div>');
			$('#upgrades').append('<div id="discsButton" class="upgradesButton" style="left:480px;top:330px"></div>');
			$(".upgradesButton").each(function(){
				if(upgrades[this.id]) $(this).css('background-color','#00FF00'); //if that upgrade has been bought the button is green	
			});
		}
	}
});
$(document).on ("click", ".upgradesButton", function () { //clicking on an upgrades button
	if(upgrades[this.id] === false){ //if that upgrades was previously not bought
		if(this.id === 'jumpButton' && getScore() >= upgrades['jumpCost']){ //checks to see if the player has enough score to afford that upgrade
			upgrades[this.id] = true; //changes the upgrades variable to true so it can't be bought again in the future
			$(this).css('background-color','#00FF00'); //changes its button from red to green
			playerStats.jump = 3; //changes the jump stock stat to three so now the player can triple jump instead of double jump for the rest of the game
			addScore(-upgrades['jumpCost']); //subtracts the cost of the upgrade from the total score
			music(true,'levelUp'); //sound effect
			$('#score').text('SCORE: '+getScore().toString()); //changes the score displayed to the player
		} else if(this.id === 'ammoButton' && getScore() >= upgrades['ammoCost']){
			upgrades[this.id] = true;
			$(this).css('background-color','#00FF00');
			playerStats.ammo = 19;
			addScore(-upgrades['ammoCost']);
			music(true,'levelUp');
			$('#score').text('SCORE: '+getScore().toString());
		} else if(this.id === 'healthButton' && getScore() >= upgrades['healthCost']){
			upgrades[this.id] = true;
			$(this).css('background-color','#00FF00');
			playerStats.ammo = 15;
			addScore(-upgrades['healthCost']);
			music(true,'levelUp');
			$('#score').text('SCORE: '+getScore().toString());
		} else if(this.id === 'discsButton' && getScore() >= upgrades['discsCost']){
			upgrades[this.id] = true;
			$(this).css('background-color','#00FF00');
			addScore(-upgrades['discsCost']);
			music(true,'levelUp');
			$('#score').text('SCORE: '+getScore().toString());
		}
	}
});
$(document).on ("click", "#restartButton", function () { //the restart level button function for when you die in the game
	$(this).remove();
    $('#titleButton').remove();
    $('#playground').css('background-image','url(Images/Background'+getLevel()+'.png)'); //changes the background image
	makeSidescroller(getLevel()); //remakes the sidecroller level player was on
});
$(document).on ("click", "#titleButton", function () { //the back to title screen button
	location.reload(); //reloads the page
});
$(document).on ("click", "#audio", function () { //audio button
	if(gameVar.muted){ //if the game was already muted
	    $(this).css('background-image','url(Images/audio.png)'); //changes the mute button image
	    if(gameVar.music !== null) gameVar.music.play(); //restarts the music
	} else{ //mutes the game
        $(this).css('background-image','url(Images/audioOff.png)'); //changes the image 
        if(gameVar.music !== null) gameVar.music.pause(); //pauses the music
    }
    gameVar.muted = !gameVar.muted; //mute boolean switches from true to false or false to true
});