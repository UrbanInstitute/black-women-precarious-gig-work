export function resizeFix(elem, params) {
  // console.log("resizefix firing");
  let elwidth = elem.clientWidth;
  if (elwidth === 0) {
    // console.log("triggering resize");
    elem.classList.add("sizefix");
    window.requestAnimationFrame(() => {
      elem.classList.remove("sizefix");
      resizeFix(elem, params);
    });
  }
}
