function makeTextSprite(scene,messages, parameters) {
	let canvas=new getTextCanvas(messages,parameters)
	let texture = new THREE.Texture(canvas); 
    texture.needsUpdate = true;
	let spriteMaterial = new THREE.SpriteMaterial({ 
			map: texture ,
			transparent:true,
			color:controls.color
		}); 
	let sprite = new THREE.Sprite( spriteMaterial ); 
	//console.log(sprite.spriteMaterial); /* 缩放比例 */ 
	sprite.scale.set(10,5,1); 
	 // sprite.scale.set(50,50,50)
	scene.add(sprite);
	return sprite; 
	}

function createTextPlane(scene,messages, parameters){
	let canvas=getTextCanvas(messages,parameters);
	let texture=new THREE.Texture(canvas);
	let planeMaterial=new THREE.MeshBasicMaterial({
		map:texture,
 		transparent:true,
		color:0xFFFFFF,
		// side: THREE.DoubleSide
	})
	texture.needsUpdate = true;
	let planeGeometry = new THREE.PlaneGeometry(30,30);
	let font = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(font)
	return	font
	 
}
// function createTxturePlane(scene,texture){
// 	let planeGeometry=new THREE.PlaneGeometry(30,30);
// 	let planeMaterial=new THREE.MeshBasicMaterial({
// 		map:texture,
// 		transparent:true,
// 		side:THREE.DoubleSide
// 	})
// 	planeMaterial.map = textureLoader.load(useTexture);
// 	planeMaterial.map.wrapS = THREE.RepeatWrapping; 
// 	planeMaterial.map.wrapT = THREE.RepeatWrapping; 
// 	planeMaterial.map.repeat.set(160,160)	
//     let mesh=new THREE.Mesh(planeGeometry,planeMaterial)
// 	scene.add(mesh)
// 	return mesh
// }
function getTextCanvas(messages, parameters){
	if ( parameters === undefined ) parameters = {};
	/*字体样式*/
	let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial"; 
	/* 字体大小 */
	let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 12;
	/* 边框厚度 */ 
	let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
	/* 边框颜色 */ 
	let borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 }; 
	/* 背景颜色 */ 
	let backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r:255, g:255, b:255, a:0 }; 
	/* 创建画布 */ 

	let canvas = document.createElement('canvas');
	// let width=canvas.width
	// let height=canvas.height;
	 canvas.width=256;
	 canvas.height=256;

	let context = canvas.getContext('2d'); 
		 /* 字体加粗 */ 
		context.font = "Bold " + fontsize + "px " + fontface; 
	/* 获取文字的大小数据，高度取决于文字的大小 */ 
	let textWidth= 0;
	let textheigth=0;

	// context.lineWidth = borderThickness; 
	/* 文字左右与边框距离*/
	let length1=20;
	/* 文字行间距离*/
	let length2=6
	/* 文字上下与边框距离*/	
	let length3=10;
	if(messages instanceof Array &&messages.length>1){
		messages.forEach(function(message,index){
			/* 字体颜色 */
			context.fillStyle='rgba(0,0,0,1)';
			var firstheight=fontsize+length3
			if(index==0){
				context.fillText(message,length1,firstheight);
			}
			context.fillText(message,length1,firstheight+(fontsize+length2)*index);
			_textWidth=context.measureText( message).width;
			textheigth+=fontsize+length2;
			// console.log('textheigth',textheigth)
			if(_textWidth>textWidth){
				textWidth=_textWidth
			}
		})
	}else{
		textWidth=context.measureText( messages).width;
		textheigth=fontsize;
		context.fillText(messages,length1,fontsize+length3);
	}
	/* 背景颜色 */
	context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")"; 
	/* 边框的颜色 */
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")"; 

	context.fillRect(0,0,textWidth+length1*2,textheigth+length3*2)
	// console.log(textheigth+length3*2);
	context.strokeRect(0,0,textWidth+length1*2,textheigth+length3*2)
	/* 绘制圆角矩形 */ 
    // roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6); 
	return canvas;
	 function roundRect(ctx, x, y, w, h, r) { 
	 	ctx.beginPath();
	 	ctx.moveTo(x+r, y);
	    ctx.lineTo(x+w-r, y); 
	    ctx.quadraticCurveTo(x+w, y, x+w, y+r); 
	    ctx.lineTo(x+w, y+h-r); 
	    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h); 
	    ctx.lineTo(x+r, y+h); 
	    ctx.quadraticCurveTo(x, y+h, x, y+h-r); 
	    ctx.lineTo(x, y+r); 
	    ctx.quadraticCurveTo(x, y, x+r, y);
	    ctx.closePath(); 
	    ctx.fill(); 
	    ctx.stroke(); 
	}		 		
}

function createWall(scene,length,width,high,material) {
	var wall=new THREE.CubeGeometry(length,width,high)
    var wallMaterial =material|| new THREE.MeshPhongMaterial({
        // color: 0xa0522d
        color: 0xffffff
    });
    var wallMesh = new THREE.Mesh(wall, wallMaterial);
	// wallMesh.castShadow = true;
	wallMesh.receiveShadow = true;
	scene.add(wallMesh);
    return wallMesh

}
// function createHole()
function createHole(length,width,hight,material){
		var holeGeometry = new THREE.BoxGeometry(length, width, hight);
    var holeMaterial = material||new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    var hole = new THREE.Mesh(holeGeometry, holeMaterial);
    return hole
}

function creatTexturPlane(scene,useTexture,width,height,repeatsize) {

    var withTexture = (useTexture !== undefined) ? useTexture : false;
    var _width=width||10000;
    var _height=height||10000;
    var _repeatsize=repeatsize||80
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(_width, _height);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x999999
    });
    if (withTexture) {
        var textureLoader = new THREE.TextureLoader();
        planeMaterial.side=THREE.DoubleSide;
        planeMaterial.map = textureLoader.load(useTexture);
        planeMaterial.map.wrapS = THREE.RepeatWrapping; 
        planeMaterial.map.wrapT = THREE.RepeatWrapping; 
        planeMaterial.map.repeat.set(_repeatsize,_repeatsize)
    }
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

	// rotate and position the plane
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.x = 0;
    // plane.position.y = 0;
    // plane.position.z = 0;

    scene.add(plane);	

    return plane;
}
function createGroundPlane(scene,length,width,material) {
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(length, width);
    var planeMaterial = material||new THREE.MeshPhongMaterial({
         color: 0x9acd32
         //color: 0xffffff
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // // rotate and position the plane
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.x = 15;
    // plane.position.y = 0;
    // plane.position.z = 0;
    scene.add(plane);
    return plane
}
function Fan(scene,length, width, hight,material) {

	// this.mesh = new THREE.Object3D();
	this.mesh = new THREE.Group();
	this.startAngle = 0;
	var that=this;
	this.material = material||new THREE.MeshPhongMaterial({
	    color: 0xFFFFFF,
	    specular:0xFFFFFF, 
	    shininess:0
	});
	var fan_outGeometry = new THREE.BoxGeometry(length, width, hight);
	var fan_sideGeometry = new THREE.BoxGeometry(length-2, width-2, hight);
	var fan_out=new THREE.Mesh(fan_outGeometry,material);
	var fan_side=new THREE.Mesh(fan_sideGeometry,material);
	var resultMesh=merger(fan_out,fan_side,'subtract')
		resultMesh.material=this.material
	// this.fan_inGeometry=new THREE.PlaneGeometry(length, width/8);
	this.fan_inGeometry=new THREE.BoxGeometry(length, width/8,hight/8);

	// var aBSP=new ThreeBSP(fan_out);
	// var bBSP=new ThreeBSP(fan_side);
	// var resultMesh=aBSP.subtract(bBSP).toMesh();
	//    	resultMesh.material.shading = THREE.FlatShading;
	//     resultMesh.geometry.computeFaceNormals();
	//     resultMesh.geometry.computeVertexNormals();
	//     resultMesh.material.needsUpdate = true;
	//     resultMesh.geometry.buffersNeedUpdate = true;
	//     resultMesh.geometry.uvsNeedUpdate = true;
	this.mesh.blade=new THREE.Mesh(this.fan_inGeometry,material);

	// this.mesh.blade.material=this.material
	this.mesh.add(resultMesh)
	this.mesh.add(this.mesh.blade)
	this.mesh.setPosition=function (x,y,z) {
		that.mesh.position.set(x,y,z)
	}
	this.mesh.turnLeft=function (angle, speed) {
		// console.log('inter turnLeft')
	  	that._turn(angle, true, speed)
	},
	this.mesh.turnRight=function (angle, speed) {
		_turn(angle, false, speed)
	},
	this._turn=function (angle, direction, speed) {
	  var direction = direction ? 1 : -1
	  if (speed) {
	  	  // console.log('angel',that.startAngle)
	  	   // console.log('blade',that.mesh.blade)
		  if(that.startAngle < angle) {
			that.mesh.blade.rotation.z += speed
			that.startAngle += speed
			if (angle - that.startAngle < speed) {
				var originAngle =that.mesh.blade.rotation.z - that.startAngle
				that.mesh.blade.rotation.z = originAngle + angle
				that.startAngle = 0
				return
			}
		  }
	  } else {
	  that.mesh.blade.rotation.y += angle * direction
	  }
	}

	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	scene.add(this.mesh)
	return this.mesh
}
function addVideo(scene,tagId,width,height){
    let planeGeometry = new THREE.PlaneGeometry(width, height);
    // let material = new THREE.MeshPhongMaterial();
    let material = new THREE.MeshBasicMaterial();
    material.side = THREE.DoubleSide;

    let mesh = new THREE.Mesh(planeGeometry, material);
    if(scene){
    	scene.add(mesh);	
    }
    let video = document.getElementById(tagId);
    let texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.format = THREE.RGBFormat;

    material.map = texture;
    return mesh;

}
function getCameraStream(succeseful,unsuceeseful) {
	// var video = document.getElementById('video');
	console.log("getCameraStream");
	var vendorUrl = window.URL || window.webkitURL;
	navigator.getMedia = navigator.getUserMedia ||
	         navigator.webkitGetUserMedia ||
	         navigator.mozGetUserMedia ||
	         navigator.msGetUserMedia ||
	         (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
	navigator.getMedia({
			video: true,  // 摄像头
			audio: false  // 音频
		}, function(stream){
				//console.log(">>>>>>>>>>>"+strem); // 获取到视频流
				succeseful(vendorUrl.createObjectURL(stream));
				// console.log(stream)
				// video.src = vendorUrl.createObjectURL(stream); // 绑定到video标签，输出  
				// video.play(); // 向PeerConnection中加入需要发送的流

			}, 
		   function(error) {
		   		unsuceeseful(error)
				// console.log(error);
			});
}
function createEchartsPlane(scene,tagId,option,width,height){
    let planeGeometry = new THREE.PlaneGeometry(width, height);
    // let material = new THREE.MeshPhongMaterial();
    let material = new THREE.MeshBasicMaterial({
	 			transparent: true
	    	}		
    	);
    material.side = THREE.DoubleSide;
    let mesh = new THREE.Mesh(planeGeometry, material);
    scene.add(mesh);
    let canvas=getchartCanvas(tagId,option);
    let texture=new THREE.Texture(canvas);
    material.map=texture;
    material.map.needsUpdate = true;
    return mesh	
}

function createChartPlane(scene,canvas,width,height){
		let planeGeometry = new THREE.PlaneGeometry(width, height);
		// let material = new THREE.MeshPhongMaterial();
		let material = new THREE.MeshBasicMaterial({
				transparent: true
			});
		material.side = THREE.DoubleSide;
		let mesh = new THREE.Mesh(planeGeometry, material);
		if(scene!==null){
			scene.add(mesh);	
		}
		let texture=new THREE.Texture(canvas);
		material.map=texture;
		material.map.needsUpdate = true;
		return mesh	
}
//numx:行数
//numy:列数
function creatPlaneGroup(scene,plane,numx,numy,width=30,height=30){
	let planeGroup=new THREE.Group();
	console.log('##$$$',numx,numy,width,height)
	for(let i=0;i<numx;i++){
		for(let j=0;j<numy;j++){
			let index=numy*i+j
			let _plane=plane[index]
			if(_plane!='undefined'&&_plane instanceof THREE.Object3D){
				var planeClone=_plane.clone();
				//设置统一平面上
				planeClone.rotation.set( 0, 0, 0 );
				//设置统一大小
				planeClone.geometry.computeBoundingBox();
				let geometryWidth=planeClone.geometry.boundingBox.max.x-planeClone.geometry.boundingBox.min.x
				let geometryheight=planeClone.geometry.boundingBox.max.y-planeClone.geometry.boundingBox.min.y
				planeClone.scale.set(width/geometryWidth,height/geometryheight,1);
				planeClone.position.set(j*width,-i*height,0)
				// planeClone.updateMatrix()
				planeGroup.add(planeClone);
			}
	
		}
	}
	scene.add(planeGroup);
	return planeGroup;
}
function svg2Canvas(svg){
	if(typeof canvg!=='undefined'){
		// console.log('###',svg)
		var _canvas=document.createElement('canvas');
		canvg(_canvas,svg)
		return _canvas;
	}
	return false
}
function getchartCanvas(tagId,option){
	var tag=document.getElementById(tagId)
	var myChart = echarts.init(tag);
		myChart.setOption(option);
	var _backgroundColor=option.color;
	var _transparent=option.transparent||true;
	var canvas = myChart.getRenderedCanvas({
        pixelRatio: 2,
        backgroundColor: _backgroundColor,
        transparent:_transparent
    });
    return canvas
}
//生成粒子的方法
function createParticles(scene,texture,size, transparent, opacity, vertexColors, sizeAttenuation, color) {
	// var geometry = new THREE.BufferGeometry();
	// var vertices = [];
	// for ( var i = 0; i < 10000; i ++ ) {

	// 	var x = Math.random() * 2000 - 1000;
	// 	var y = Math.random() * 2000 - 1000;
	// 	var z = Math.random() * 2000 - 1000;

	// 	vertices.push( x, y, z );

	// }

	// geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	// var color =new THREE.Color(color)||new THREE.Color(0xffffff)
	// console.log(color)
	// materials= new THREE.PointsMaterial( { size: size, map: texture, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
	// materials.color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
	// var particles = new THREE.Points( geometry, materials);
	// particles.rotation.x = Math.random() * 6;
	// particles.rotation.y = Math.random() * 6;
	// particles.rotation.z = Math.random() * 6;
	// particles.verticesNeedUpdate = true;
	// scene.add( particles );
	// return particles;
	
    //存放粒子数据的网格
    var geom = new THREE.Geometry();
    console.log('geometry',geom);
    //样式化粒子的THREE.PointCloudMaterial材质
    var material = new THREE.PointCloudMaterial({
        size: size,
        blending: THREE.AdditiveBlending,
        transparent: transparent,
        opacity: opacity,
        vertexColors: vertexColors,
        sizeAttenuation: sizeAttenuation,
        color: color,
        map:texture,
        depthTest: false  //设置解决透明度有问题的情况
    });
    var range = 280;
        for (var i = 0; i < 500; i++) {
            //添加顶点的坐标
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            geom.vertices.push(particle);
            var color = new THREE.Color(0xffffff);
            //.setHSL ( h, s, l ) h — 色调值在0.0和1.0之间 s — 饱和值在0.0和1.0之间 l — 亮度值在0.0和1.0之间。 使用HSL设置颜色。
            //随机当前每个粒子的亮度
            //color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
            color.setHSL(0.95, 0.1, 0.1);
            geom.colors.push(color);
    }
    //生成模型，添加到场景当中
    cloud = new THREE.PointCloud(geom, material);
    cloud.verticesNeedUpdate = true;
    scene.add(cloud);
    return cloud;

}
function shot(renderer,callback){
  let imgData = renderer.domElement.toDataURL("image/jpeg");//这里可以选择png格式jpeg格式
  callback(imgData);
  // console.log('image length',imgData.length)
  
}
function merger(mergerA,mergerB,mergerType){
	var mesh=null;
	var aBSP=new ThreeBSP(mergerA);
	var bBSP=new ThreeBSP(mergerB);
	switch(mergerType)
	{
		case 'intersect':
			var resultMesh=aBSP.intersect(bBSP)
			mesh=resultMesh.toMesh()

			break
		case 'union ':
			var resultMesh=aBSP.union(bBSP)
			mesh=resultMesh.toMesh()
			break
		case 'subtract':
			var resultMesh=aBSP.subtract(bBSP)
			mesh=resultMesh.toMesh()
			break

	}
	if(mesh!==null){
		mesh.material.flatShading= THREE.FlatShading;
	    mesh.geometry.computeFaceNormals();
	    mesh.geometry.computeVertexNormals();
	    mesh.material.needsUpdate = true;
	    mesh.geometry.buffersNeedUpdate = true;
	    mesh.geometry.uvsNeedUpdate = true;		
	}
	return mesh;
}
