(function() {
  window.addEventListener('load', () => {

    // variables
    var run = true;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var targetDOM = document.getElementById('webgl');

    // event
    // window.addEventListener('keydown', (eve) => {
    //   run = eve.keyCode !== 27;
    // }, false);

    window.addEventListener('mousemove', (event) => {
      let w = window.innerWidth;
      let h = window.innerHeight;
      let x = event.clientX * 2.0 - w;
      let y = event.clientY * 2.0 - h;
      x /= w;
      y /= h;

      // position
      // scene.position.x = -x * 2.0;
      // scene.position.y = y * 2.0;

      // rotation
      scene.rotation.x = y * 0.1;
      scene.rotation.y = x * 0.1;

    }, false);

    // three.js class
    var scene;
    var camera;
    var controls;
    var loader;
    var texture;
    var renderer;

    var geometry__wire;
    var geometry__object;

    var material__wire;
    var material__object;

    var directional;
    var ambient;

    var group;
    var group1;
    var group2;

    var wire__front;
    var wire__back;
    var object;
    var mesh;

    // parameter
    var CAMERA_PARAMETER = {
      fovy: 60,
      aspect: width / height,
      near: 0.1,
      far: 1000.0,
      // x: 20.0,
      // y: 10.0,
      // z: 150.0,
      x: 0.0,
      y: 0.0,
      z: 150.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };

    var RENDERER_PARAMETER = {
      clearColor: 0x222222,
      width: width,
      height: height
    };

    var MATERIAL_PARAMETER = {
      // color: 0x000000,
      // wireframe: true,
      side: THREE.DoubleSide
    };

    // initialize scene
    scene = new THREE.Scene();

    // initialize camera
    camera = new THREE.PerspectiveCamera(
      CAMERA_PARAMETER.fovy,
      CAMERA_PARAMETER.aspect,
      CAMERA_PARAMETER.near,
      CAMERA_PARAMETER.far
    );

    camera.position.x = CAMERA_PARAMETER.x;
    camera.position.y = CAMERA_PARAMETER.y;
    camera.position.z = CAMERA_PARAMETER.z;
    camera.lookAt(CAMERA_PARAMETER.lookAt);

    // initialize controls
    controls = new THREE.OrbitControls(camera, render.domElement);

    // initialize renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
    renderer.setSize(RENDERER_PARAMETER.width, RENDERER_PARAMETER.height);
    targetDOM.appendChild(renderer.domElement);

    // load texture
    loader = new THREE.TextureLoader();
    texture = loader.load('./texture.png');

    // geometry
    geometry__wire = new THREE.PlaneGeometry(160, 90, 16, 9);
    geometry__object = new THREE.PlaneGeometry(160, 90, 16, 9);

    // material
    // material = new THREE.ShaderMaterial( {
    //   uniforms: {
    //     time: {
    //       value: 1.0
    //     },
    //     resolution: {
    //       value: new THREE.Vector2()
    //     }
    //   },
    //   vertexShader: document.getElementById('vertexShader').textContent,
    //   fragmentShader: document.getElementById('fragmentShader').textContent
    // });

    material__object = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      map: texture,
      transparent: true,
      opacity: 0.5
    });

    material__wire = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });

    // mesh
    object = new THREE.Mesh(geometry__object, material__object);
    wire__front = new THREE.Mesh(geometry__wire, material__wire);
    wire__back = new THREE.Mesh(geometry__wire, material__wire);

    wire__front.position.set(0, 0, 0.01);
    wire__back.position.set(0, 0, -0.01);

    scene.add(object);
    scene.add(wire__front);
    scene.add(wire__back);

    // initialize light
    directional = new THREE.DirectionalLight(0xffffff);
    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(directional);
    scene.add(ambient);

    var count = 0;
    render();

    function render() {

      count++;

      // math
      // var s = Math.sin(count * 0.01);
      // var c = Math.cos(count * 0.01);

      // scene.position.y = Math.sin(count * 0.001) * 1000.0;
      // scene.rotation.y = Math.sin(count * 0.001) * 0.5;
      // scene.position.y = count * 1.0;

      // scene.rotation.y = count * 0.001;

      // rendering
      renderer.render(scene, camera);

      // animation
      if (run) {
        requestAnimationFrame(render);
      }

    }
  }, false);
})();
