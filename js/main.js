// set up the
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000000000 );
camera.up.set(0,0,1); // Change the UP vector so it is not exactly opposite the direction we look

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// for detecting objects in view
var frustum = new THREE.Frustum();
var cameraViewProjectionMatrix = new THREE.Matrix4();

// create the renderer
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// ------------------------------------------------------------------ settings
// sun, 	1.988435e30 Kg
var solar_mass = 5
var G   = 1               //6.67384e-11;   // gravitational constant
var Fr  = 0.98            // frictie
var cnt = 0               // count
var u   = 1               // updatecount (c%u)
var civs = []             // num civilizations and years active
var yrs = 0               // number of civilized years (in 1000)
var t_yrs = 0             // total years
var stats_visible = true  // show stats

var key

var html = ""
var html2 = ""


// random number helper
var gr = function( _num ) {
  if ( _num == undefined ) _num = 2000
  return ( Math.random() * _num ) - _num/2
}

// ------------------------------------------------------------------ keys
// TODO set up a key system that allows for setting and getting the current
// 'key' or configuration (basically all the positions of the objects)
if ( key ) {}


// ------------------------------------------------------------------ the world
// create 3 'suns'

// alpha centauri a
var sun1_geometry = new THREE.SphereGeometry( 55, 32, 32 );
var sun1_material = new THREE.MeshBasicMaterial( { color: 0xffddcc } ); //0xffddcc
var sun1 = new THREE.Mesh( sun1_geometry, sun1_material );
sun1.position.set( gr(), 0, gr() )
sun1.velocity = { x: 0, y: 0, z: 0 }
sun1.mass = 1.1 * solar_mass
sun1.radius = 13
sun1.name = "Alpha Centauri A"
sun1.class = "star centauri_a"

// test with image sprites for more star-like stars
/*
var map = THREE.ImageUtils.loadTexture( "img/flare.png" );
var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true, needsUpdate: true, transparent: true,  blending: THREE.AdditiveBlending } );
material.blending = THREE.AdditiveBlending
var sprite = new THREE.Sprite( material );
sprite.position.set(sun1.position)
sprite.scale.set(160, 160, 1)
*/

// alpha centauri b
var sun2_geometry = new THREE.SphereGeometry( 45, 32, 32 );
var sun2_material = new THREE.MeshBasicMaterial( {color: 0xffffdd} );
var sun2 = new THREE.Mesh( sun2_geometry, sun2_material );
sun2.position.set( gr(), 0, gr() )
sun2.velocity = { x: 0, y: 0, z: 0}
sun2.mass = 0.9 * solar_mass
sun2.radius = 55
sun2.name = "Alpha Centauri B"
sun2.class = "star centauri_b"

// proxima centauri, alpha centauri C
var sun3_geometry = new THREE.SphereGeometry( 12, 32, 32 );
var sun3_material = new THREE.MeshBasicMaterial( {color: 0xfdbaba} );
var sun3 = new THREE.Mesh( sun3_geometry, sun3_material );
sun3.position.set( gr(), gr(200), gr() )
sun3.velocity = { x: 0, y: 0, z: 0}
sun3.mass = 0.123 * solar_mass
sun3.radius = 45
sun3.name = "Proxima Centauri"
sun3.class = "star proxima"

// create 1 planet ( = camera position )
var planet_geometry = new THREE.SphereGeometry( 3, 32, 32 );
var planet_material = new THREE.MeshBasicMaterial( {color: 0x99554a} );
var planet = new THREE.Mesh( planet_geometry, planet_material );
planet.position.set( 0, 0, 0 )
planet.velocity = { x: 1, y: 0, z: 1}
planet.mass = 1 // assuming same size/ weight as the earth
planet.radius = 10
planet.name = "Trisolaris"
planet.class = "planet trisolaris"

var loader = new THREE.TextureLoader();
var background
//loader.load( 'img/mw_trans.png', function ( texture ) {
loader.load( 'img/star_trans.png', function ( texture ) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
  var bg_geometry = new THREE.SphereGeometry( 30000, 128, 128 );
  var bg_material = new THREE.MeshBasicMaterial( {color: 0x99554a} );
  var bg_material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide} ); // overdraw: 0.5
  background = new THREE.Mesh( bg_geometry, bg_material  );
  background.material.transparent = true;
  background.material.opacity = 0.4;
  background.needsUpdate = true;
  background.position.set( 0, 0, 0 )
  //background.material.blending = THREE.AdditiveBlending;
  background.material.alphaTest = 0.5;
  scene.add( background )
});

// capture it all into an array
var trisolaris = [ sun1, sun2, sun3, planet ] //, sun3, planet ]

// add it
scene.add( sun1 )
scene.add( sun2 )
scene.add( sun3 )
scene.add( planet )

// save the key
key = {
  "sun1":       { x: 0, y:0, z:0, vx:0, vy:0, vz:0 },
  "sun2":       { x: 0, y:0, z:0, vx:0, vy:0, vz:0 },
  "sun3":       { x: 0, y:0, z:0, vx:0, vy:0, vz:0 },
  "trisolaris": { x: 0, y:0, z:0, vx:0, vy:0, vz:0 }
}


// ------------------------------------------------------------- dawn & twilight
// frustum is now ready to check all the objects you need
var renderAtmosphere = function() {
  if ( !frustum.intersectsObject( sun1 ) ) {
    if ( document.getElementById('atmosphere1').style.opacity < 0 ) document.getElementById('atmosphere1').style.opacity = 0
    if ( document.getElementById('atmosphere1').style.opacity > 0 ) {
      document.getElementById('atmosphere1').style.opacity -= 0.01
    }
  } else{
    var current_obj = sun1
    var other_obj = planet
    var current = new THREE.Vector3( current_obj.position.x, current_obj.position.y, current_obj.position.z );
    var other = new THREE.Vector3( other_obj.position.x, other_obj.position.y, other_obj.position.z );
    var dist = sun1.position.distanceTo( planet.position );
    var target = 1 - (dist/1500)

    if ( document.getElementById('atmosphere1').style.opacity > 0.6 ) document.getElementById('atmosphere1').style.opacity = 0.6
    if ( document.getElementById('atmosphere1').style.opacity < 0 ) document.getElementById('atmosphere1').style.opacity = 0
    document.getElementById('atmosphere1').style.opacity = Number(document.getElementById('atmosphere1').style.opacity) + (target*0.0084)
  }

  if ( !frustum.intersectsObject( sun2 ) ) {
    if ( document.getElementById('atmosphere2').style.opacity < 0 ) document.getElementById('atmosphere2').style.opacity = 0
    if ( document.getElementById('atmosphere2').style.opacity > 0 ) {
      document.getElementById('atmosphere2').style.opacity -= 0.01
    }
  } else{
    var current_obj = sun2
    var other_obj = planet
    var current = new THREE.Vector3( current_obj.position.x, current_obj.position.y, current_obj.position.z );
    var other = new THREE.Vector3( other_obj.position.x, other_obj.position.y, other_obj.position.z );
    var dist = sun2.position.distanceTo( planet.position );
    var target = 1 - (dist/1500)

    if ( document.getElementById('atmosphere2').style.opacity > 0.6 ) document.getElementById('atmosphere2').style.opacity = 0.6
    if ( document.getElementById('atmosphere2').style.opacity < 0 ) document.getElementById('atmosphere2').style.opacity = 0
    document.getElementById('atmosphere2').style.opacity = Number(document.getElementById('atmosphere2').style.opacity) + (target*0.0084)
  }

  if ( background != undefined ) {
    background.material.opacity = 1.0 - ( ( Number(document.getElementById('atmosphere1').style.opacity) + Number(document.getElementById('atmosphere2').style.opacity) ) / 2 )
    if ( background.material.opacity > 0.72 ) background.material.opacity = 0.72
  }
}

// where are the selestial bodies now?
var renderStats = function( current_obj ) {
  // stats
  if ( stats_visible ) {
    html += "<div class='" + current_obj.class + "'>" + current_obj.name + "</div>";
    html += "<br>Vx\t " + Math.round(current_obj.velocity.x*1000)/1000
    html += "<br>Vy\t " + Math.round(current_obj.velocity.y*1000)/1000
    html += "<br>Vz\t " + Math.round(current_obj.velocity.z*1000)/1000
    html += "<br>Px\t " + Math.round(current_obj.position.x*1000)/1000
    html += "<br>Py\t " + Math.round(current_obj.position.y*1000)/1000
    html += "<br>Pz\t " + Math.round(current_obj.position.z*1000)/1000
    html += "<br></br>"
    document.getElementById('stats').innerHTML = html
  }
}

var renderStatus = function() {
  html2 = ""

  t_yrs += 1
  var s1 = sun1.position.distanceTo( planet.position );
  var s2 = sun2.position.distanceTo( planet.position );
  var s3 = sun3.position.distanceTo( planet.position );
  var avg = ( ( s1 * 0.9 ) + ( s2*1.1 ) + ( s3 * 0.123 ) ) / 3

  // 0.8 -- 1.2 AU ( for 1 Solar mass )
  // ±  800 -- 1200

  // throw away the origingal calculation and insteat calculate
  // each suns energy; add those, and divide by three

  // 0.723 -- 1.524
  // energy1 = sun1.mass * 08 < > sun1.mass 1.2
  // energy2 = sun2.mass * 08 < > sun2.mass 1.2
  // energy3 = sun3.mass * 08 < > sun3.mass 1.2

  // should be calculated for all of them, but not divided
  //

  // ( e1 + e2 + e3 ) / 3

  html2 += "<div class='star header'>Distances</div>"
  html2 += "<br> Alpha C\t " + Math.round(s1)+ " AU /1000 dist."
  html2 += "<br> Beta. C\t " + Math.round(s2) + " AU /1000 dist."
  html2 += "<br> Prox. C\t " + Math.round(s3) + " AU /1000 dist."
  html2 += "<br> Average\t " + Math.round(avg) + " AU /1000 dist."

  html2 += "<br>"
  html2 += "<br><div class='star header'>Status</div>"

  if ( s1 < 300 || s2 < 300 || s3 < 75 ) {
    html2 += "<h1>Planet Burning!<br><small> " + t_yrs + "\t Years x1000</small></h1>"
    //$('.planet_overlay_chaotic').fadeOut('slow')
    $('.planet_overlay_burning').fadeIn('fast')
    $('.planet_overlay_stable').fadeOut('fast')
    if (yrs != 0 ) civs.push(yrs)
    yrs = 0
  } else if ( avg < 1400 ) {
    html2 += "<h1>Stable Era.<br><small> " + t_yrs + "\t Years x1000</small></h1>"
    //$('.planet_overlay_chaotic').fadeOut('slow')
    $('.planet_overlay_burning').fadeOut('slow')
    $('.planet_overlay_stable').fadeIn('slow')
    yrs += 1
  } else {
    html2 += "<h1>Chaotic Era.<br><small> " + t_yrs + "\t Years x1000</small></h1>"
    //$('.planet_overlay_chaotic').fadeIn()
    $('.planet_overlay_burning').fadeOut('slow')
    $('.planet_overlay_stable').fadeOut('slow')
    //yrs
  }

  var total = 0
  civs.forEach( function(c) { total += c } )
  html2 += "<b>Civ " + (civs.length + 1) + "\t " + yrs + "\t Years x1000</b>"
  html2 += "<br><br/>Average\t " + (Math.round( (total + yrs) /civs.length)||0) + "\t Years x1000"
  html2 += "<br/>Total\t " + ( total + yrs ) + "\t Years x1000</p>"

  var w = civs.length
  html2 += "<br><div class='star header'>Past Civilizations</div>"
  while( w > 0 ) {
    html2 += "Civ "  + w + "\t " + civs[w-1] + "\t Years x1000</br>"
    w--
  }

  document.getElementById('stats2').innerHTML = html2
}

var updateForces = function() {
  html = ""
  trisolaris.forEach( function( current_obj ) {

    // compute forces (and acceleration) from all other objects,
    // and add them in an accumulated force (acceleration)

    trisolaris.forEach( function( other_obj ) {
      // skip self
      if ( other_obj == current_obj ) return;

      var current = new THREE.Vector3( current_obj.position.x, current_obj.position.y, current_obj.position.z );
      var other = new THREE.Vector3( other_obj.position.x, other_obj.position.y, other_obj.position.z );
      var dist = other.distanceTo( current );

      var dx = other_obj.position.x - current_obj.position.x
      var dy = other_obj.position.y - current_obj.position.y
      var dz = other_obj.position.z - current_obj.position.z

      if ( dist != 0 ) {
        // Fx = ( G *  m1 * m2 ) / (r*r) ) * d
        current_obj.velocity.x -= dx * ( G * other_obj.mass * current_obj.mass ) / Math.pow( dist, 2 )
        current_obj.velocity.y -= dy * ( G * other_obj.mass * current_obj.mass ) / Math.pow( dist, 2 )
        current_obj.velocity.z -= dz * ( G * other_obj.mass * current_obj.mass ) / Math.pow( dist, 2 )
      }    });

    renderStats( current_obj )
  });

  // do the actual move
  trisolaris.forEach( function( obj ) {
    obj.position.x -= obj.velocity.x
    obj.position.y -= obj.velocity.y
    obj.position.z -= obj.velocity.z
  })

  renderStatus()
}

var updateCamera = function() {
  // I'm on a planet
  camera.position.set( planet.position.x, planet.position.y, planet.position.z )

  // average vectors for a center-of-mass-like view (seems to work allright)
  var mult = 0.1
  le_vec =    (new THREE.Vector3( sun1.position.x, sun1.position.y, sun1.position.z )).multiplyScalar( sun1.mass * mult );
  le_vec.add( (new THREE.Vector3( sun2.position.x, sun2.position.y, sun2.position.z )).multiplyScalar( sun2.mass * mult ) );
  le_vec.add( (new THREE.Vector3( sun3.position.x, sun3.position.y, sun3.position.z )).multiplyScalar( sun3.mass * mult ) );
  camera.lookAt( le_vec )

  if ( background != undefined ) {
    background.position.x = planet.position.x
    background.position.y = planet.position.y
    background.position.z = planet.position.z
    // background.material.opacity = Math.sin(fck);
    // console.log(Math.sin(fck))
  }

  camera.updateMatrixWorld(); // make sure the camera matrix is updated
  camera.matrixWorldInverse.getInverse( camera.matrixWorld );
  cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
  frustum.setFromMatrix( cameraViewProjectionMatrix );
}

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

  cnt++
  if ( cnt%u != 0 ) return;
  updateForces()
  updateCamera()
  renderAtmosphere()
}

render();
