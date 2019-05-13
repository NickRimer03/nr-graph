import svgPanZoom from "svg-pan-zoom";

export default svg => {
  svgPanZoom(svg, {
    zoomScaleSensitivity: 0.4,
    fit: 1
  });
};
