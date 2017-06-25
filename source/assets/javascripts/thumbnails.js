let app = [];

var setupThumbnails = {
  'circle': {
    init: function(image, type, background, foreground, orientation, mapno) {

      const imageWidth = image.width();
      const imageHeight = image.height();
      const options = {
        "width": imageWidth,
        "height": imageHeight,
        "backgroundColor": "0x" + background,
        "antialias": true
      }
      const canvas = new PIXI.Application(options);

      let hover = false;
      let playing = false;
      let offset = 20;
      let acceleration = 0;
      let maximum = 6 + Math.round(Math.random() * 2);

      // The application will create a canvas element for you that you
      // can then insert into the DOM.
      image.closest('.project')[0].appendChild(canvas.view);

      const base = new PIXI.Container();
      canvas.stage.addChild(base);

      const staticImage = image.attr("src");

      // This creates a texture from a 'bunny.png' image.
      const prjImageBg = new PIXI.Sprite.fromImage(staticImage);
      const prjImage = new PIXI.Sprite.fromImage(staticImage);
      prjImageBg.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      prjImage.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      prjImage.alpha = 0;

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

      prjImageBg.width = canvas.renderer.width;
      prjImageBg.height = canvas.renderer.height;

      prjImageBg.x = canvas.renderer.width / 2;
      prjImageBg.y = canvas.renderer.height / 2;

      // Rotate around the center
      prjImage.anchor.x = 0.5;
      prjImage.anchor.y = 0.5;

      prjImageBg.anchor.x = 0.5;
      prjImageBg.anchor.y = 0.5;

      if(type === "circle") {
        const circle = new PIXI.Graphics();
        circle.beginFill("0x" + foreground);
        circle.arc(0, 0, 1, 0, Math.PI * 2);
        circle.position = {x: prjImage.x, y: prjImage.y};
        const radius = canvas.renderer.width > canvas.renderer.height ? canvas.renderer.height : canvas.renderer.width;
        circle.width = radius / 1.2;
        circle.height = radius / 1.2;
        base.addChild(circle);
      }

      if(type === "square") {
        const square = new PIXI.Graphics();
        square.beginFill("0x" + foreground);
        const imgAnchor = {x: prjImage.x, y: prjImage.y};
        const squareWidth = canvas.renderer.width > canvas.renderer.height ? canvas.renderer.height : canvas.renderer.width;
        const startX = imgAnchor.x - squareWidth / 3;
        const startY = imgAnchor.y - squareWidth / 3;
        square.drawRect(startX, startY, squareWidth / 1.5, squareWidth / 1.5);
        // square.rotation = 45 * Math.PI / 180;
        base.addChild(square);
      }

      if(type === "rectangle") {
        const square = new PIXI.Graphics();
        square.beginFill("0x" + foreground);
        const imgAnchor = {x: prjImage.x, y: prjImage.y};
        const startX = imgAnchor.x - canvas.renderer.width / 3;
        const startY = imgAnchor.y - canvas.renderer.height / 3;
        square.drawRect(startX, startY, canvas.renderer.width / 1.5, canvas.renderer.height / 1.5);
        // square.rotation = 45 * Math.PI / 180;
        base.addChild(square);
      }

      const map = $('#map-'+mapno).attr('src');
      const displacementTexture = PIXI.Sprite.fromImage(map);

      const displacementFilter = new PIXI.filters.DisplacementFilter(displacementTexture);
      const noiseFilter = new PIXI.filters.NoiseFilter(0.1, Math.random());
      displacementFilter.scale.x = 0;
      displacementFilter.scale.y = 0;
      base.filters = [noiseFilter, displacementFilter];

      base.addChild(prjImage);

      canvas.stage.addChild(prjImageBg);

      app.push(canvas);

      canvas.ticker.add(function(delta) {
        noiseFilter.seed = Math.random();

        if (hover) {
          if (orientation == "w") {
            if(displacementFilter.scale.x < offset*maximum) {
              displacementFilter.scale.x += offset;
            }
          } else if (orientation == "s") {
            if(displacementFilter.scale.y < offset*maximum) {
              displacementFilter.scale.y += offset;
            }
          } else if (orientation == "se") {
            if(displacementFilter.scale.x < offset*maximum
              || displacementFilter.scale.y > offset*maximum) {
              displacementFilter.scale.x += offset;
              displacementFilter.scale.y -= offset;
            }
          } else {
            if(displacementFilter.scale.x > offset*maximum
              || displacementFilter.scale.y < offset*maximum) {
              displacementFilter.scale.x -= offset;
              displacementFilter.scale.y += offset;
            }
          }

        } else {

          if (orientation == "w") {
            if (displacementFilter.scale.x > 0) {
              displacementFilter.scale.x -= offset;
            }
          } else if (orientation == "s") {
            if (displacementFilter.scale.y > 0) {
              displacementFilter.scale.y -= offset;
            }
          } else if (orientation == "se") {
            if (displacementFilter.scale.y < 0) {
              displacementFilter.scale.x -= offset;
              displacementFilter.scale.y += offset;
            }
          } else {
            if (displacementFilter.scale.x < 0) {
              displacementFilter.scale.x += offset;
              displacementFilter.scale.y -= offset;
            }
          }
        }
      });
    }
  }
};
