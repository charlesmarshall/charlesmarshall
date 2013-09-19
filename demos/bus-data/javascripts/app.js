if(!Detector.webgl) Detector.addGetWebGLMessage();

var mouseX = 0,
    mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    camera,
    scene,
    renderer,
    material;




jQuery(document).ready(function($) {
  material = new THREE.LineBasicMaterial({color:0x14557a, opacity:0.3, transparent:true, linewidth:1, vertexColors:THREE.VertexColors});
  init();
  data();
  postprocessing();
  animate();
});

function init(){
  var container = document.createElement('div');
  container.id = "viewport";
  document.getElementById("routeexample").appendChild(container);
  camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 700;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function data(){
  for(var j in busroutes){
    var group = busroutes[j];
    for(var i = 0; i < group.length; i++) {
      var route = group[i];
      var geometry = new THREE.Geometry(),
          colors = [],
          spline = new THREE.Spline(route);
      for(var k = 0; k < route.length; k++) {
        if(route.hasOwnProperty(k)) {
          var index = k / (route.length);
          position = spline.getPoint(index);
          var plot = getPosition(position.x, position.y, position.z);
          geometry.vertices[k] = new THREE.Vector3(plot.x, plot.y, plot.z);
          geometry.colors[k] = new THREE.Color(0xffffff);
        }
      };

      var line = new THREE.Line(geometry, material);
      var scale = 1;

      line.scale.x = line.scale.y = line.scale.z = scale;

      line.position.x = 0;
      line.position.y = 0;
      line.position.z = 0;

      scene.add(line);
    }
  }
}

function getPosition(raw_x,raw_y,raw_z) {
  var x = ((raw_x - 52.28596) * 300 / (52.69065 - 52.28596)) - 150,
      y = -((raw_y - -1.43301) * 300 / (-2.20937 - -1.43301)) + 150,
      z = (( (raw_z - 52.3) * 300 / (258.96-52.3) )- 150) / 5;
  return {"x":y,"y":x,"z":z};
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
  camera.position.x += (mouseX - camera.position.x) * .005;
  camera.position.y += (- mouseY + 200 - camera.position.y) * .005;
  camera.position.z = camera.position.z
  camera.lookAt(scene.position);

  // rotation in time
  //var time = Date.now() * 0.00005;
  //for(var i = 0; i < scene.children.length; i++) scene.children[i].rotation.y = time;

  composer.render();
}
