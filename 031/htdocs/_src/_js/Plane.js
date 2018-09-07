import * as THREE from 'three';

const SVGLoader = require('./_lib/SVGLoader.js')(THREE);

import vert from './../_shader/mesh.vert';
import frag from './../_shader/mesh.frag';

import GeometryUtils from './_lib/GeometryUtils.js';

export default class Plane {

	constructor() {
		
		this.uniforms = {
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
		this.geometry = null;
		this.material = null;
		this.mesh = null;
	
  }
  
	getQueryString(name, defaultValue) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == name) {
				return unescape(pair[1]);
			}
		}
		return defaultValue;
	}
	
	getQueryValue(name, defaultValue) {
		var value = this.getQueryString(name, null);
		if (value == null) {
			return defaultValue;
		}
		return parseInt(value, 10);
	}
	
  setup() {
	
		// logo
	  let logo;
	  
	  const loader = new THREE.SVGLoader();
	  const path = './bqmn.svg';
	  loader.load(path,(object) => {
				
		  // let group = new THREE.Group();
		  // group.scale.multiplyScalar(0.0015);
		  // group.scale.y *= -1;
		
		  for (let i = 0; i < object.length; i ++) {
		  	
			  let svgpath = object[i];
			  
			  let shapes = svgpath.toShapes(false);
			  for (let j = 0; j < shapes.length; j ++) {
			  	
				  // logo = new THREE.ShapeBufferGeometry(shapes[j]);
				
				  logo = new THREE.ExtrudeGeometry(shapes[j], {
					  bevelEnabled: false,
					  amount: 2,
				  })
				  
				  // let geometry = new THREE.ShapeBufferGeometry(shape);
				  // let mesh = new THREE.Mesh(geometry, material);
				  // group.add(mesh);
				  // mesh.position.x -= 600.0;
				  // mesh.position.y -= 217.0;
				  // mesh.position.z += 1500.0;
				  
			  }
			  
		  }
	  	
	  },
	  function(xhr) {
		  // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	  },
	  function(error) {
		  // console.log('An error happened');
	  });
	  
	  
	  
		// // particle box
	  let geo = logo;

	  geo.computeBoundingBox();

	  let bounds = geo.boundingBox;
	  geo.applyMatrix( new THREE.Matrix4().makeTranslation(
		  (bounds.max.x - bounds.min.x) * -0.5,
		  (bounds.max.y - bounds.min.y) * -0.5,
		  (bounds.max.z - bounds.min.z) * -0.5)
	  );

	  let particleCount = this.getQueryValue('particleCount', 500000);
	      particleCount = Math.floor(particleCount / 3) * 3;

	  let particlePoints = THREE.GeometryUtils.randomPointsInGeometry( geo, particleCount );

	  let data = new Float32Array( particleCount * 4 );
	  for ( var i = 0, j = 0, l = data.length; i < l; i += 4, j += 1 ) {
		  data[ i ] = particlePoints[ j ].x;
		  data[ i + 1 ] = particlePoints[ j ].y;
		  data[ i + 2 ] = particlePoints[ j ].z;
		  data[ i + 3 ] = 0.0;
	  }

	  this.geometry = new THREE.BufferGeometry();

	  this.material = new THREE.RawShaderMaterial({
		  uniforms: this.uniforms,
		  vertexShader: vert,
		  fragmentShader: frag,
		  // map: new THREE.TextureLoader().load('./bqmn.jpg')
		  // side: THREE.DoubleSide
	  });

	  this.geometry.addAttribute('position',
		  new THREE.BufferAttribute(data, 3)
	  );
	  
	  

		// this.geometry = new THREE.BufferGeometry();
		// const positions = new Float32Array([
		//   -1., -1.,  1.,
		//    1., -1.,  1.,
		//    1.,  1.,  1.,
		//    1.,  1.,  1.,
		//   -1.,  1.,  1.,
		//   -1., -1.,  1.
		// ]);
		// this.geometry.addAttribute('position',
		//   new THREE.BufferAttribute(positions, 3)
		// );
		// this.material = new THREE.RawShaderMaterial({
		//   uniforms: this.uniforms,
		//   vertexShader: vert,
		//   fragmentShader: frag,
		//   side: THREE.DoubleSide
		// });
		//
		// this.mesh = new THREE.Mesh(this.geometry, this.material);
	  
	  
	  
	  
	
	  // let width = 10.;
	  // let half = width / 2.;
	  // let interval = .1;
	  //
	  // this.geometry = new THREE.BufferGeometry();
	  // let vertexPositions = [];
	  //
	  // let points = width / interval;
	  // for(var i = 0; i <= points; ++i){
	  //   let x = -half + i * interval;
	  //   for(var j = 0; j <= points; ++j){
	  //     let y = -half + j * interval;
	  //     vertexPositions.push([x, y, 0.0]);
	  //   }
	  // }
	  //
	  // let vertices = new Float32Array(vertexPositions.length * 3);
	  // for (var i = 0; i < vertexPositions.length; i++) {
	  //   vertices[i * 3 + 0] = vertexPositions[i][0];
	  //   vertices[i * 3 + 1] = vertexPositions[i][1];
	  //   vertices[i * 3 + 2] = vertexPositions[i][2];
	  // }
	  //
	  // this.geometry.addAttribute('position',
	  //   new THREE.BufferAttribute(vertices, 3)
	  // );
	  //
	  // this.material = new THREE.RawShaderMaterial({
	  //   uniforms: this.uniforms,
	  //   vertexShader: vert,
	  //   fragmentShader: frag,
	  //   // side: THREE.DoubleSide
	  // });
	
	
	
	  // setTimeout(function () {
		  this.mesh = new THREE.Points(this.geometry, this.material);
	  // }, 1000);
	  

	  
  }

}