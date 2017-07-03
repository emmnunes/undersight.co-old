let app = [];

var setupThumbnails = {
  'circle': {
    init: function(image, type, background, foreground, orientation, mapno) {

      const imageWidth = image.offsetWidth;
      const imageHeight = image.offsetHeight;
      const options = {
        "width": imageWidth,
        "height": imageHeight,
        "backgroundColor": "0x" + background,
        "antialias": false
      }
      const canvas = new PIXI.Application(options);

      let hover = false;
      let playing = false;
      let offset = 20;
      let acceleration = 0;
      let maximum = 4 + Math.round(Math.random() * 2);

      // The application will create a canvas element for you that you
      // can then insert into the DOM.
      findAncestor(image, 'project').appendChild(canvas.view);

      const base = new PIXI.Container();
      base.setTransform(imageWidth/2, imageHeight/2, 1, 1, 0, 0, 0, imageWidth/2, imageHeight/2);

      const imageContainer = new PIXI.Container();
      imageContainer.setTransform(imageWidth/2, imageHeight/2, 1, 1, 0, 0, 0, imageWidth/2, imageHeight/2);

      canvas.stage.addChild(base);
      canvas.stage.addChild(imageContainer);

      const staticImage = image.getAttribute("src");

      // This creates a texture from a 'bunny.png' image.
      const prjImage = new PIXI.Sprite.fromImage(staticImage);
      prjImage.blendMode = PIXI.BLEND_MODES.MULTIPLY;

      prjImage.interactive = true;
      prjImage.buttonMode = true;

      prjImage
        .on('pointerover', () => { hover = true; playing = true; })
        .on('pointerout', () => { hover = false; playing = true; });

      // Setup the position of the prjImage
      prjImage.width = canvas.renderer.width;
      prjImage.height = canvas.renderer.height;

      prjImage.x = canvas.renderer.width / 2;
      prjImage.y = canvas.renderer.height / 2;

      // Rotate around the center
      prjImage.anchor.x = 0.5;
      prjImage.anchor.y = 0.5;

      const geometry = new PIXI.Graphics();

      if(type === "circle") {
        geometry.beginFill("0x" + foreground);
        geometry.arc(0, 0, 1, 0, Math.PI * 2);
        geometry.position = {x: prjImage.x, y: prjImage.y};
        const radius = canvas.renderer.width > canvas.renderer.height ? canvas.renderer.height : canvas.renderer.width;
        geometry.width = radius / 1.2;
        geometry.height = radius / 1.2;
      }

      if(type === "square") {
        geometry.beginFill("0x" + foreground);
        const imgAnchor = {x: prjImage.x, y: prjImage.y};
        const squareWidth = canvas.renderer.width > canvas.renderer.height ? canvas.renderer.height : canvas.renderer.width;
        const startX = imgAnchor.x - squareWidth / 3;
        const startY = imgAnchor.y - squareWidth / 3;
        geometry.drawRect(startX, startY, squareWidth / 1.5, squareWidth / 1.5);
        // geometry.rotation = 45 * Math.PI / 180;
      }

      if(type === "rectangle") {
        geometry.beginFill("0x" + foreground);
        const imgAnchor = {x: prjImage.x, y: prjImage.y};
        const startX = imgAnchor.x - canvas.renderer.width / 3;
        const startY = imgAnchor.y - canvas.renderer.height / 3;
        geometry.drawRect(startX, startY, canvas.renderer.width / 1.5, canvas.renderer.height / 1.5);
        // geometry.rotation = 45 * Math.PI / 180;
      }

      base.addChild(geometry);

      const noiseFilter = new PIXI.filters.NoiseFilter(0.09, Math.random());
      base.filters = [noiseFilter];

      base.addChild(prjImage);

      imageContainer.addChild(prjImage);

      app.push(canvas);

      canvas.ticker.add(function(delta) {
        if(delta > 0) {
          noiseFilter.seed = Math.random();

          if (hover) {
            if(imageContainer.scale.x < 1.05) {
              imageContainer.scale.x += 0.005;
              imageContainer.scale.y += 0.005;
            }
          } else {
            if(imageContainer.scale.x > 1) {
              imageContainer.scale.x -= 0.005;
              imageContainer.scale.y -= 0.005;
            }
          }
        }
      });
    }
  }
};
