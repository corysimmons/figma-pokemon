figma.showUI(__html__);

figma.ui.resize(640, 400);

figma.ui.onmessage = (msg) => {
  if (msg.type === "swap-for-pokemon") {
    figma.createImageAsync(msg.imgUrl).then(async (image: Image) => {
      const selectedNode = figma.currentPage.selection[0]

      if (!selectedNode) {
        figma.notify(`You must select a node first`, {
          timeout: 1600
        });
      }

      const solidWhiteFill = {
        type: "SOLID",
        visible: true,
        opacity: 1,
        blendMode: "NORMAL",
        color: {
          r: 1,
          g: 1,
          b: 1,
        },
        boundVariables: {},
      };

      const pokemonFill = {
        type: "IMAGE",
        visible: true,
        opacity: 1,
        blendMode: "NORMAL",
        scaleMode: "FILL",
        imageTransform: [
          [1, 0, 0],
          [0, 1, 0],
        ],
        scalingFactor: 0.5,
        rotation: 0,
        filters: {
          exposure: 0,
          contrast: 0,
          saturation: 0,
          temperature: 0,
          tint: 0,
          highlights: 0,
          shadows: 0,
        },
        imageHash: image.hash,
      };
      
      selectedNode.fills = [solidWhiteFill, pokemonFill];
    });
  }
};
