(() => {

  // ==================================================
  // 　　SETTING
  // ==================================================

  let notWebGL = () => {
    console.log('this browser does not support webGL')
  };

  if(document.getElementsByTagName('html')[0].classList.contains('no-webgl')){
    notWebGL();
  }

  if(ubu.detect.browser.ie){
    console.log('IEさん、動画テクスチャはちょっと…無理ですね…')
  }

  // ==================================================
  // 　　MAIN
  // ==================================================

  window.addEventListener('load', function() {

    // ==================================================
    // 　　CLASS
    // ==================================================

    const mainVert = require('./../_shader/main.vert');
    const mainFrag = require('./../_shader/main.frag');
    const postVert = require('./../_shader/post.vert');
    const postFrag = require('./../_shader/post.frag');

    let renderer;
    let scene;
    let camera;
    let uniforms;
    let geometry;
    let material;
    let mesh;
    let floor;

    // light
    let directional;
    let ambient;
    let hemisphere;
    let point;
    let spot;

    let renderer__POST;
    let scene__POST;
    let camera__POST;
    let uniforms__POST;
    let geometry__POST;
    let material__POST;
    let mesh__POST;

    let controls;
    let loader;

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let targetDOM = document.getElementById('canvas');
    targetDOM.width *= devicePixelRatio;
    targetDOM.height *= devicePixelRatio;
    targetDOM.style.width = String(targetDOM.width / devicePixelRatio) + 'px';

    // ==================================================
    // 　　MOUSE
    // ==================================================

    window.addEventListener('mousemove', function(e) {
      let x = event.clientX * 2.0 - winWidth;
      let y = event.clientY * 2.0 - winHeight;
      x /= winWidth;
      y /= winHeight;
      uniforms.mouse.value.x = e.pageX;
      uniforms.mouse.value.y = e.pageY;
      uniforms__POST.mouse.value.x = e.pageX;
      uniforms__POST.mouse.value.y = e.pageY;
    }, false);

    // ==================================================
    // 　　RESIZE
    // ==================================================

    window.addEventListener('resize', function() {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;

      camera.aspect = winWidth / winHeight;
      camera.updateProjectionMatrix();
      camera__POST.aspect = winWidth / winHeight;
      camera__POST.updateProjectionMatrix();

      renderer.setSize(winWidth, winHeight);
      renderer__POST.setSize(winWidth, winHeight);

      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;

    }, false );

    // ==================================================
    // 　　SCROLL
    // ==================================================

    // let scrollWatch = () => {
    //   let scrollTop = $(window).scrollTop();
    //   scene.position.y = scrollTop * 0.02;
    //   window.requestAnimationFrame(scrollWatch);
    // }

    // ==================================================
    // 　　INIT
    // ==================================================

    let init = () => {
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;
    }

    // ==================================================
    // 　　RENDER
    // ==================================================

    let render = () => {
      count++;

      // mesh.rotation.x = count * 0.02;
      mesh.rotation.y = count * 0.02;

      uniforms.time.value += 0.05;
      uniforms__POST.time.value += 0.05;

      renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
      renderer.render(scene, camera, renderer__POST);

      renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.postColor));
      renderer.render(scene__POST, camera__POST);

      requestAnimationFrame(render);
    }

    // ==================================================
    // 　　PARAMETER
    // ==================================================

    let CAMERA_PARAMETER = {
      fovy: 60,
      aspect: winWidth / winHeight,
      near: 0.01,
      far: 5000.0,
      x: 0.0,
      y: 0.0,
      z: 5.0,
      lookAt: new THREE.Vector3(1.0, 1.0, 1.0)
    };

    let RENDERER_PARAMETER = {
      clearColor: 0x000000,
      postColor: 0xffffff
    };

    let MATERIAL_PARAMETER = {
      color: 0xff0000,
      side: THREE.DoubleSide
    };

    // ==================================================
    // 　　INITIALIZE / SCENE / CAMERA / RENDERER
    // ==================================================

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(RENDERER_PARAMETER.clearColor, 0.01, 1000);

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

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(winWidth, winHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    targetDOM.appendChild(renderer.domElement);

    let CameraController = function(theta, phi, radius){
			this.name = "Camera Controller";
			this.theta = theta;
			this.phi = phi;
			this.radius = radius;

			this.update = function(refCamera)
			{
				refCamera.position.x = this.radius*Math.sin(this.theta*Math.PI/180.0)*Math.cos(this.phi*Math.PI/180.0);
				refCamera.position.y = this.radius*Math.cos(this.theta*Math.PI/180.0);
				refCamera.position.z = this.radius*Math.sin(this.theta*Math.PI/180.0)*Math.sin(this.phi*Math.PI/180.0);
				refCamera.lookAt({x:0, y:0, z:0});
			};
		}

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // ==================================================
    // 　　GUI
    // ==================================================

    // sphere
    let sphere = new function () {
      this.radius = 16.0;
      this.color = 0xffffff;
    };

    let light = new function () {
      this.ambientColor = 0xffffff;
      this.directionalColor = 0xffffff;
      this.hemisphereColor = 0xffffff;
      this.pointColor = 0xffffff;
      this.spotColor = 0xffffff;
    };

    // gui
    let gui = new dat.GUI();

    // guiSphere
    let guiSphere = gui.addFolder('sphere');

    guiSphere.add(sphere, 'radius', 8.0, 256.0).onChange(function(value) {
      mesh.geometry = new THREE.SphereGeometry(1.0, value, value);
      // mesh.position.y = value * 0.5;
    });

    guiSphere.addColor(sphere, 'color').onChange(function(value) {
      mesh.material.color.setHex(value);
    });

    guiSphere.open();

    // guiLight
    let guiLight = gui.addFolder('light');

    guiLight.addColor(light, 'ambientColor').onChange(function(value) {
      ambient.color.setHex(value);
    });

    guiLight.addColor(light, 'directionalColor').onChange(function(value) {
      directional.color.setHex(value);
    });

    guiLight.addColor(light, 'hemisphereColor').onChange(function(value) {
      hemisphere.color.setHex(value);
    });

    guiLight.addColor(light, 'pointColor').onChange(function(value) {
      point.color.setHex(value);
    });

    guiLight.addColor(light, 'spotColor').onChange(function(value) {
      spot.color.setHex(value);
    });

    guiLight.open();

    // ==================================================
    // 　　UNIFORMS
    // ==================================================

    uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      time: {
        type: 'f',
        value: 1.0
      }
    };

    // ==================================================
    // 　　GEOMETRY
    // ==================================================

    // geometry = new THREE.SphereGeometry(1.0, 128.0, 128.0);
    // geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    geometry = new THREE.SphereGeometry(1.0, 16.0, 16.0);

    // ==================================================
    // 　　MATERIAL
    // ==================================================

    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading,
      roughness: 0.1,
      metalness: 0.9
    });

    // ==================================================
    // 　　LIGHT
    // ==================================================

    // 環境光源（全体に均一に当たる）
    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    // 平行光源（光源から平行に当たる）
    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(20.0, 20.0, 20.0);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 1024;
    directional.shadow.mapSize.height = 1024;
    directional.shadow.camera.near = 0.01;
    directional.shadow.camera.far = 500;
    scene.add(directional);

    // 半休光源（自然光のような柔らかい当たり方）
    hemisphere = new THREE.HemisphereLight(0xffffff, 0x000000, 0.2);
    hemisphere.position.set(20.0, 20.0, 20.0);
    scene.add(hemisphere);

    // 点光源（光源から全方位に拡散する）
    point = new THREE.PointLight(0xffffff, 1.0, 10.0);
    point.position.set(20.0, 20.0, 20.0);
    scene.add(point);

    // スポットライト（一点に当たる）
    spot = new THREE.SpotLight(0xffffff);
    spot.position.set(0.0, 7.5, 0.0);
    scene.add(spot);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    // mesh.rotation.x =  Math.PI * 0.2;
    // mesh.rotation.y = -Math.PI * 0.2;
    mesh.castShadow = true;
    scene.add(mesh);

    floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50.0, 50.0, 32.0),
      // new THREE.MeshPhongMaterial({
      new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = -1.0;
    floor.receiveShadow = true;
    scene.add(floor);

    // ==================================================
    // 　　POST
    // ==================================================

    scene__POST = new THREE.Scene();

    camera__POST = new THREE.PerspectiveCamera(
      CAMERA_PARAMETER.fovy,
      CAMERA_PARAMETER.aspect,
      CAMERA_PARAMETER.near,
      CAMERA_PARAMETER.far
    );
    camera__POST.position.x = CAMERA_PARAMETER.x;
    camera__POST.position.y = CAMERA_PARAMETER.y;
    camera__POST.position.z = CAMERA_PARAMETER.z;
    camera__POST.lookAt(CAMERA_PARAMETER.lookAt);

    renderer__POST = new THREE.WebGLRenderTarget(winWidth, winHeight, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    });
    renderer__POST.setSize(winWidth, winHeight);

    uniforms__POST = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      time: {
        type: 'f',
        value: 1.0
      },
      uTex: {
        type: 't',
        value: renderer__POST.texture,
      }
    };

    geometry__POST = new THREE.PlaneBufferGeometry(2, 2);
    material__POST = new THREE.ShaderMaterial({
      uniforms: uniforms__POST,
      vertexShader: postVert,
      fragmentShader: postFrag,
      transparent: true,
      // fog: true
      // depthWrite: true,
      // side: THREE.DoubleSide
    });

    mesh__POST = new THREE.Mesh(geometry__POST, material__POST);
    scene__POST.add(mesh__POST);

    // ==================================================
    // 　　INIT
    // ==================================================

    init();

    let count = 0;
    render();

  }, false);

})();
