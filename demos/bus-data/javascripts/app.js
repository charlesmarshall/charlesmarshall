if(!Detector.webgl) Detector.addGetWebGLMessage();

var mouseX = 0,
    mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    camera,
    scene,
    renderer,
    material = new THREE.LineBasicMaterial({color:0x14557a, opacity:0.3, transparent:true, linewidth:1, vertexColors:THREE.VertexColors});

init();
data();
postprocessing();
animate();

function init(){
  var container = document.createElement('div'), sect = document.getElementById("routeexample");
  sect.appendChild(container);
  camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 700;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth-100, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function data(){
  for(var i in routes){
    for(var j in routes[i]){
      var geometry = new THREE.Geometry(),
          colors = [],
          position,
          index,
          route = routes[i][j],
          spline = new THREE.Spline(route);

      for(var k = 0; k < route.length; k++){
        index = k / (route.length);
        position = spline.getPoint(index);
        var x = ((position.x - 52.28596) * 300 / (52.69065 - 52.28596)) - 150,
            y = ((position.y - -1.43301) * 300 / (-2.20937 - -1.43301)) - 150,
            z = (( (position.z - 52.3) * 300 / (258.96-52.3) )- 150) / 5;
        geometry.vertices[k] = new THREE.Vector3(x, y, z);
        geometry.colors[k] = new THREE.Color(0xffffff);
      }

      var line = new THREE.Line(geometry, material),
          scale = 0.8 * 1.5,
          d = 225;

      line.scale.x = line.scale.y = line.scale.z = scale;

      line.position.x = 0;
      line.position.y = 0;
      line.position.z = 0;

      scene.add(line);
    }
  }
}

function rescale(val, max, min, target_max, target_min){
  return ((val - min) * (target_max - target_min) / (max - min)) - target_min;
}

function postprocessing(){
  var renderModel = new THREE.RenderPass( scene, camera );
  var effectBloom = new THREE.BloomPass( 15, 3, 0.2, 1024 );
  var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

  effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );

  var width = window.innerWidth || 2;
  var height = window.innerHeight || 2;

  effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );

  effectCopy.renderToScreen = true;

  composer = new THREE.EffectComposer( renderer );

  composer.addPass( renderModel );
  composer.addPass( effectFXAA );
  composer.addPass( effectBloom );
  composer.addPass( effectCopy );
}

function onWindowResize(){
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event){
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event){
  if(event.touches.length > 1){
    event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

function onDocumentTouchMove(event){
  if(event.touches.length == 1){
    event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;
  }
}

function animate(){
  requestAnimationFrame(animate);
  render();
}

function render(){
  // mouse based camera tilt
  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (- mouseY + 200 - camera.position.y) * .05;
  camera.lookAt(scene.position);

  // rotation in time
  var time = Date.now() * 0.0005;
  for(var i = 0; i < scene.children.length; i++) scene.children[i].rotation.y = time;

  composer.render();
}
