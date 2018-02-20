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

    // window.addEventListener('mousemove', (event) => {
    //   let w = window.innerWidth;
    //   let h = window.innerHeight;
    //   let x = event.clientX * 2.0 - w;
    //   let y = event.clientY * 2.0 - h;
    //   x /= w;
    //   y /= h;
    //   scene.position.x = -x * 1.0;
    //   scene.position.y = y * 1.0;
    // }, false);

    // three.js class
    var scene;
    var camera;
    var controls; // controls @@@
    var renderer;

    var geometry;
    var material;

    var directional;
    var ambient;

    var group;
    var group1;
    var group2;

    var triangle;

    // parameter
    var CAMERA_PARAMETER = {
      fovy: 60,
      aspect: width / height,
      near: 0.1,
      far: 1000.0,
      x: 0.0,
      y: 0.0,
      z: 50.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };

    var RENDERER_PARAMETER = {
      clearColor: 0xffffff,
      width: width,
      height: height
    };

    var MATERIAL_PARAMETER = {
      linewidth: 10,
      color: 0x3ed779
      // 0x3ed779
      // 0x37b76f
      // 0x4fd4d5
      // 0x97df55
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

    // geometry
    geometry = new THREE.Geometry();
    geometry.vertices[0] = new THREE.Vector3(0, 0, 0);
    geometry.vertices[1] = new THREE.Vector3(2, 0, 0);
    geometry.vertices[2] = new THREE.Vector3(1, 2, 0);
    geometry.vertices[3] = new THREE.Vector3(0, 0, 0);
    // geometry.faces[0] = new THREE.Face3(0, 1, 2);

    // material
    materialColor = [
      new THREE.LineBasicMaterial({
        color: 0x3ed779,
        linewidth: 5
      }),
      new THREE.LineBasicMaterial({
        color: 0x37b76f,
        linewidth: 5
      }),
      new THREE.LineBasicMaterial({
        color: 0x4fd4d5,
        linewidth: 5
      }),
      new THREE.LineBasicMaterial({
        color: 0x97df55,
        linewidth: 5
      })
    ];

    // group
    group = new THREE.Group();
    // group1 = new THREE.Group();
    // group2 = new THREE.Group();

    // mesh
    for (var i = 0; i < 50; i++) {

      var randomColor = Math.floor(Math.random() * (4 + 1 - 0)) + 0;
      material = new THREE.LineBasicMaterial(materialColor[randomColor]);

      // mesh
      triangle = new THREE.Line(geometry, material);

      triangle.position.x += Math.random() * 50.0;
      triangle.position.y += Math.random() * 50.0;
      triangle.position.z += Math.random() * 50.0;

      // triangle.position.x += (Math.random() * Math.random()) * 80.0;
      // triangle.position.x += - (Math.random() * Math.random()) * 80.0;

      // triangle.position.y += (Math.random() + Math.random()) * 80.0;
      // triangle.position.y += - (Math.random() + Math.random()) * 80.0;

      // triangle.position.z += (Math.random() * Math.random()) * 80.0;
      // triangle.position.z += - (Math.random() * Math.random()) * 80.0;

      var randomRotation = Math.floor(Math.random() * (5 + 1 - 0)) + 0;
      // triangle.rotation.x += Math.random() * randomRotation;
      triangle.rotation.y += Math.random() * randomRotation;
      triangle.rotation.z += Math.random() * randomRotation;

      // group1.add(triangle);
      // group2.add(group1);

      group.add(triangle);
    }

    group.position.set(-25.0, -25.0, -25.0);
    scene.add(group);

    // initialize light
    // directional = new THREE.DirectionalLight(0xffffff);
    // ambient = new THREE.AmbientLight(0xffffff, 0.2);
    // scene.add(directional);
    // scene.add(ambient);

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

      // count = count + 0.1;
      // group1.position.y = count * 1.0;
      // if (group1.position.y > 100) {
      //   count = 0;
      // }

      scene.rotation.y = count * 0.001;
      scene.position.y = Math.sin(count * 0.02);

      for (var i = 0; i < group.children.length; i++) {
        group.children[i].rotation.y = - (count * 0.001);
      }

      // rendering
      renderer.render(scene, camera);

      // animation
      if (run) {
        requestAnimationFrame(render);
      }

    }
  }, false);
})();
