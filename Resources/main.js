var camera, scene, renderer, player, gem, Arwing;
var mouse = new THREE.Vector2();
var enemies = [];
var enemySpeed = 3;
var scoreDiv = document.getElementById("score");
var bestScoreDiv = document.getElementById("bestScore");
var sphereRadius = 10;
var enemyRangeX = 550;
var enemyRangeY = 700;
var gemRange = 500;
init();
animate();

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
  
  //Light
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 20, -45, -500 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  
  spotLight.power = 5;

  scene.add( spotLight );
  
  //Arwing
  var loader = new THREE.JSONLoader();
  loader.load('images/Arwing.json', addModel);
  
  function addModel( geometry,  materials ) {
    var material = new THREE.MeshPhongMaterial( materials );
			
    Arwing = new THREE.Mesh( geometry, material );
    Arwing.scale.set(32,32,32)
    Arwing.rotation.x = 135;
    scene.add( Arwing );            
  }
  
  // mesh properties
  geometry = new THREE.SphereGeometry(sphereRadius);
  texture = THREE.ImageUtils.loadTexture('images/crate.gif');
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
  gem = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0xFF0000
  }));
  gem.position.set(gemRange / 2 - gemRange * Math.random(),
    gemRange / 2 - gemRange * Math.random(),
    0.0);
  scene.add(gem);
  
  // player
  /*player = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  scene.add(player);*/
  
  container.addEventListener('mousemove', onMouseMove, false);
}

function onMouseMove(event) {
  mouse.x = ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;
  Arwing.position.set(275 * mouse.x, 275 * -mouse.y, -5);
}

var minus = true;

function animate() {
  requestAnimationFrame(animate);
  
  // update enemies
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].position.z < -enemyRangeY / 2) { // if the enemy has moved in front of the container
      enemies[i].position.x = enemyRangeX / 2 - enemyRangeX * Math.random(); //set new x-coord for variety
      enemies[i].position.z = enemyRangeY / 2; // set z-coord at back of container
    } else {
      if (enemies[i].position.distanceTo(Arwing.position) < 2 * sphereRadius) { // if there's a player-enemy collision
        scoreDiv.innerHTML = "0"; //reset score
        enemySpeed = 3;
      }
      enemies[i].position.z -= enemySpeed; // translate enemy towards container
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
  
  /*if ( scoreDiv.innerHTML == 10 && minus) {
    enemySpeed -= 5;
    minus = false;
  }
  if (minus === false && scoreDiv.innerHTML != 10) {
    minus = true;
  }*/
  
  renderer.render(scene, camera);
}
