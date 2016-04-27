var camera, scene, renderer, player, gem;
var mouse = new THREE.Vector2();
var enemies = [];
var enemySpeed = 3;
var scoreDiv = document.getElementById( "score" );
var bestScoreDiv = document.getElementById( "bestScore" );
var sphereRadius = 10;
var enemyRangeX = 550;
var enemyRangeY = 700;
var gemRange = 500;
init();
animate();
function init() {
	// renderer
	var container = document.getElementById( "container" );
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( container.clientWidth, container.clientHeight );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );
	// camera
	camera = new THREE.PerspectiveCamera( 70, container.clientWidth / container.clientHeight, 1, 1000 );
	camera.position.z = 400;
	// scene
	scene = new THREE.Scene();
	// mesh properties
	var geometry = new THREE.SphereGeometry( sphereRadius );
	var texture = THREE.ImageUtils.loadTexture( 'Resources/imgs/crate.gif' );
	texture.anisotropy = renderer.getMaxAnisotropy();
	var material = new THREE.MeshBasicMaterial( { map: texture } );
	// enemies
	var nBoxes = 30;
	for ( var i = 0; i < nBoxes; i++ ) {
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( enemyRangeX/2 - enemyRangeX * Math.random(),
						   enemyRangeY/2 - enemyRangeY * Math.random(),
						   0.0);
		scene.add( mesh );
		enemies.push( mesh );
	}
	// gem
	gem = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xFFFF00} ) );
	gem.position.set( gemRange/2 - gemRange * Math.random(),
					  gemRange/2 - gemRange * Math.random(),
					  0.0);
	scene.add( gem );
	// player
	player = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial() );
	scene.add( player );
	container.addEventListener( 'mousemove', onMouseMove, false );
}
function onMouseMove( event ) {
	mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
	mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
	player.position.set( 275 * mouse.x, 275 * mouse.y, 0.0 );
}
function animate() {
	requestAnimationFrame( animate );
	// update enemies
	for ( var i = 0; i < enemies.length; i++ ){
		if ( enemies[i].position.y < -enemyRangeY/2 ) { // if the enemy has moved below the container
			enemies[i].position.x = enemyRangeX/2 - enemyRangeX * Math.random(); //set new x-coord for variety
			enemies[i].position.y = enemyRangeY/2; // set y-coord at top of container
		} else {
			if ( enemies[i].position.distanceTo( player.position ) < 2 * sphereRadius) { // if there's a player-enemy collision
				scoreDiv.innerHTML = "0"; //reset score
			}
			enemies[i].position.y -= enemySpeed; // translate enemy downwards
		}
	}
	// check for player-gem collision
	if ( player.position.distanceTo( gem.position ) < 2 * sphereRadius ) {
		gem.position.x = gemRange/2 - gemRange * Math.random();// give the gem a random xy coord
		gem.position.y = gemRange/2 - gemRange * Math.random();
		var score = Number(scoreDiv.innerHTML) + 1; // increase score
		scoreDiv.innerHTML = score.toString();
		var best = bestScoreDiv.innerHTML.split(' ');
		if ( score > Number( best[1] ) ) {
			bestScoreDiv.innerHTML = best[0] + " " + score.toString();
		}
	}
	renderer.render( scene, camera );
}
