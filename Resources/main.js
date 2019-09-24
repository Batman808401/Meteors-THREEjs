var camera, scene, renderer, player, gem, Arwing;
var mouse = new THREE.Vector2();
var loader = new THREE.JSONLoader();
var enemies = [];
var keysDown = {};
var enemySpeed = 3;
var scoreDiv = document.getElementById("score");
var bestScoreDiv = document.getElementById("bestScore");
var sphereRadius = 10;
var enemyRangeX = 550;
var enemyRangeY = 700;
var gemRange = 500;
var addPoint = false;
var liveScore = document.getElementById("liveScore");
var menu = document.getElementById("mainMenu");

//var Name = window.prompt("Create a name for your high score");
//function startGame() {
	init();
	animate();
//}

//function ran when play button is clicked
function playGame() {
	scene.add(Arwing);
	scene.add(gem);
	menu.style.opacity = "0";
	Arwing.position.x = 0;
	Arwing.position.y = 0;
	Arwing.position.z = 0;
	Arwing.rotation.y = 0;
	setTimeout(function(){liveScore.style.display = "block"}, 750);
	setTimeout(function(){menu.style.display = "none"}, 750);
	movement = true;
	playingGame = true;
}
function showScores() {
	menu.style.display = "none";
	document.getElementById("scoreMenu").style.display = "block";
}
function backFromScore () {
	menu.style.display = "block";
	document.getElementById("scoreMenu").style.display = "none";
}
function controlsMenu() {
	menu.style.display = "none";
}
function optionsMenu() {
	menu.style.display = "none";
}
function backToMenu() {
	scene.remove(Arwing);
	scene.remove(gem);
	liveScore.style.display = "none";
	menu.style.display = "block";
	menu.style.opacity = "1";
	playingGame = false
}

function init() {
	
  // renderer
  var container = document.getElementById("container");
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);
	
  // camera
  camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.y = -45;
  camera.position.z = -400;
  camera.rotation.x = 135;
	
  // scene
  scene = new THREE.Scene();
	
	//Keyboard
	addEventListener("keydown", function (e) { 
		keysDown[e.keyCode] = true; 
	}, false); 
	
	addEventListener("keyup", function (e) { 
		delete keysDown[e.keyCode]; 
	}, false); 
  
	//score board w/ local storage
	//see http://internationalschoolofhardknocks.com/APcsf/APcsfGame1BinaryHero/APcsfGAME.js
	/*if (localStorage.getItem('score')) {
		score = {
			userName: Name,
			highscore: 0
		};
	} else {
		score = JSON.parse(localStorage.getItem('score'));
		bestScoreDiv.innerHTML = score.highscore.toString;
	}
	currentScore = {
		userName: Name,
		highscore: 0
	};*/
	
	
  //Light
  var spotLight = new THREE.SpotLight( 0xffffff );
  var spotlight2 = new THREE.SpotLight();

  spotLight.position.set( 24, -45, -400 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  
  spotLight.power = 4;
  spotlight2.copy(spotLight,spotlight2);
  spotlight2.position.set(24, -45, 400);
  spotlight2.rotation.x = 180;

  scene.add(spotlight2); 
  scene.add( spotLight );
  
  //Arwing
  loader.load('Resources/imgs/Arwing.json', addModel);
  function addModel( geometry,  materials ) {
    var material = new THREE.MeshPhongMaterial( materials );
    Arwing = new THREE.Mesh( geometry, material );
    Arwing.scale.set(32,32,32);
    Arwing.rotation.x = 135;
    //scene.add( Arwing );            
  }
	
	//skyBox
	skyShape = new THREE.SphereGeometry(800,64,64);
	skyTexture = THREE.ImageUtils.loadTexture("Resources/imgs/skyTexture.png");
	skyTexture.anisotropy = renderer.getMaxAnisotropy();
	skyMaterial = new THREE.MeshBasicMaterial({map:skyTexture});
	skyMaterial.side = THREE.DoubleSide;
	skyBox = new THREE.Mesh(skyShape, skyMaterial);
  skyBox.position.y = -45;
  skyBox.position.z = -400;
	scene.add(skyBox);
  
  // mesh properties
  geometry = new THREE.SphereGeometry(sphereRadius,16, 12);
  texture = THREE.ImageUtils.loadTexture('Resources/imgs/crate.gif');
  texture.anisotropy = renderer.getMaxAnisotropy();
  material = new THREE.MeshPhongMaterial({
    map: texture
  });
  
  // enemies
  var nBoxes = 30;
  for (var i = 0; i < nBoxes; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(enemyRangeX / 2 - enemyRangeX * Math.random(),
      enemyRangeY / 2 - enemyRangeY * Math.random(), enemyRangeY / 2 - enemyRangeY * Math.random());
    scene.add(mesh);
    enemies.push(mesh);
  }
  
  // gem
  gem = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: 0xFF0000
  }));
  gem.position.set(gemRange / 2 - gemRange * Math.random(),
    gemRange / 2 - gemRange * Math.random(),
    0);
  //scene.add(gem);
  
  // upgrade
  upgrade = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: 0x0000FF
  }));
  upgrade.position.set(gemRange / 2 - gemRange * Math.random(),
    gemRange / 2 - gemRange * Math.random(),
    500);
  
  //conditions
  minus = true;
  upgradeReady = false;
	movement = false;
	playingGame = false;
  //addPoint = false;
	
	//container.addEventListener('mousemove', onMouseMove, false);
}

/*function saveScore(score) {
	localStorage.setItem('score', JSON.stringify({
			userName: Name,
			highscore: currentScore.highscore
	}));
}*/

/*function onMouseMove(event) {
  mouse.x = ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;
  Arwing.position.set(275 * mouse.x, 275 * -mouse.y, -5);
}*/

function animate() {
  requestAnimationFrame(animate);
  
  // update enemies
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].position.z < -enemyRangeY / 2) { // if the enemy has moved in front of the container
      enemies[i].position.x = enemyRangeX / 2 - enemyRangeX * Math.random(); //set new x-coord for variety
      enemies[i].position.y = enemyRangeY / 2 - enemyRangeY * Math.random(); //set new x-coord for variety
      enemies[i].position.z = enemyRangeY / 2; // set z-coord at back of container
    } else {
      if (enemies[i].position.distanceTo(Arwing.position) < 2 * sphereRadius && playingGame === true) { // if there's a player-enemy collision
        scoreDiv.innerHTML = "0"; //reset score
				//saveScore(currentScore);
        enemySpeed = 3;
      	enemies[i].position.x = enemyRangeX / 2 - enemyRangeX * Math.random(); //set new x-coord for variety
      	enemies[i].position.y = enemyRangeY / 2 - enemyRangeY * Math.random(); //set new x-coord for variety
     	 	enemies[i].position.z = enemyRangeY / 2; // set z-coord at back of container
				scene.remove(upgrade);
				backToMenu();
      }
      enemies[i].position.z -= enemySpeed; // translate enemy towards container
			enemies[i].rotation.x += 0.1;
    }
  }
	
	//currentScore.highscore = bestScoreDiv.innerHTML.replace( /^\D+/g, '');
	
	//control Arwing
	//check out http://learningthreejs.com/blog/2011/10/17/lets-make-a-3d-game-microphysics-js/ for acceleration

	if (movement === true) {
		if (87 in keysDown) {
			Arwing.position.y -= 5;
		}
		if (65 in keysDown) {
			Arwing.position.x -= 5;
		}
		if (83 in keysDown) {
			Arwing.position.y += 5;
		}
		if (68 in keysDown) {
			Arwing.position.x += 5;
		}
	}
	
	//boarder
	if (Arwing.position.x >= 270) {
		Arwing.position.x -= 5;
	}
	if (Arwing.position.x <= -270) {
		Arwing.position.x += 5;
	}
	if (Arwing.position.y >= 260) {
		Arwing.position.y -= 5;
	}
	if (Arwing.position.y <= -280) {
		Arwing.position.y += 5;
	}
	
	//Arwing rotation controls
	//W or S key pressed
	if (87 in keysDown || 83 in keysDown) {
		if (87 in keysDown) {
			Arwing.rotation.x += 0.06;
		}
		if (83 in keysDown) {
			Arwing.rotation.x -= 0.06
		}
	} else {
		if (Arwing.rotation.x !== 135) {
			if (Arwing.rotation.x >= 135) {
				Arwing.rotation.x -= 0.1
			}
			if (Arwing.rotation.x <= 135) {
				Arwing.rotation.x += 0.1
			} 
		}
	}
	//A or D key pressed
	if (65 in keysDown || 68 in keysDown) {
		if (65 in keysDown) {
			Arwing.rotation.z += 0.05;
			Arwing.rotation.y += 0.1;
		} 
		if (68 in keysDown) {
			Arwing.rotation.z -= 0.05;
			Arwing.rotation.y -= 0.1;
		}
	} else {
		if (Arwing.rotation.z !== 0) {
			if (Arwing.rotation.z >= 0) {
				Arwing.rotation.z -= 0.1;
			}
			if (Arwing.rotation.z <= 0) {
				Arwing.rotation.z += 0.1
			}
		} 
		if (Arwing.rotation.y !== 0) {
			if (Arwing.rotation.y >= 0) {
				Arwing.rotation.y -= 0.1
			}
			if (Arwing.rotation.y <= 0) {
				Arwing.rotation.y += 0.1
			}
		}
	}
	//Arwing rotation caps
	if (Arwing.rotation.z <= -0.8) {
		Arwing.rotation.z += 0.05
	}	
	if (Arwing.rotation.z >= 0.8) {
		Arwing.rotation.z -= 0.05
	}
	if (Arwing.rotation.y <= -1.2) {
		Arwing.rotation.y += 0.1
	}
	if (Arwing.rotation.y >= 1.2) {
		Arwing.rotation.y -= 0.1
	}
	if (Arwing.rotation.x >= 136.2) {
		Arwing.rotation.x -= 0.06
	}
	if (Arwing.rotation.x <= 133.8) {
		Arwing.rotation.x += 0.06
	}
	
	//Wwhen player collides with upgrade
	function upCollected() {
		console.log(upgrade.uuid);
  	scene.remove(upgrade);
  	enemySpeed -= enemySpeed / 2;
  	var score = Number(scoreDiv.innerHTML) + 10;
  	scoreDiv.innerHTML = score.toString();
    var best = bestScoreDiv.innerHTML.split(' ');
    if (score > Number(best[1])) {
      bestScoreDiv.innerHTML = best[0] + " " + score.toString();
    }
  }
  
  // check for player-gem collision
  if (Arwing.position.distanceTo(gem.position) < 2 * sphereRadius) {
    gem.position.x = gemRange / 2 - gemRange * Math.random(); // give the gem a random xy coord
    gem.position.y = gemRange / 2 - gemRange * Math.random();
    var score = Number(scoreDiv.innerHTML) + 1; // increase score
    scoreDiv.innerHTML = score.toString();
    enemySpeed += 0.1;
    var best = bestScoreDiv.innerHTML.split(' ');
    if (score > Number(best[1])) {
      bestScoreDiv.innerHTML = best[0] + " " + score.toString();
    }
  }
  
  //when the score is equal to 10
  if ( scoreDiv.innerHTML == 10 && minus) {
    scene.add(upgrade); //add the upgrade
    upgradeReady = true; //upgrade is ready to animate
    addPoint = true;
    //enemySpeed -= 3;
    minus = false;
  }
  if (minus === false && scoreDiv.innerHTML != 10) {
    minus = true;
  }
  
  if (upgradeReady) {
    upgrade.position.z -= enemySpeed * 0.5;
  }
  if (upgrade.position.z < -enemyRangeY / 2) {
    upgrade.position.x = enemyRangeX / 2 - enemyRangeX * Math.random();
    upgrade.position.y = enemyRangeY / 2 - enemyRangeY * Math.random();
    upgrade.position.z = enemyRangeY / 2
  } else {
    if (upgrade.position.distanceTo(Arwing.position) < 2 * sphereRadius && addPoint===true) {
			
      addPoint = false;

      upCollected();
    }
  }
	
	document.getElementById("user").innerHTML = document.getElementById("txtField").value
  
  renderer.render(scene, camera);
	
}
