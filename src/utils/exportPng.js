function cloneSvgForMode(svgEl, mode) {
  const clone = svgEl.cloneNode(true);

  if (mode === "transparent") {
    clone.querySelectorAll('[data-export="hide-on-transparent"]').forEach((node) => {
      node.remove();
    });
  }

  // Ensure width/height attributes exist
  const viewBox = clone.getAttribute("viewBox") || "0 0 720 720";
  const [, , w, h] = viewBox.split(/\s+/).map(Number);
  clone.setAttribute("width", String(w || 720));
  clone.setAttribute("height", String(h || 720));
  return clone;
}

export async function exportSvgNodeToPng(svgEl, filename = "figure.png", mode = "full", scale = 2) {
  if (!svgEl) throw new Error("Preview SVG not found.");

  const clone = cloneSvgForMode(svgEl, mode);
  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

    const vb = (clone.getAttribute("viewBox") || "0 0 720 720").split(/\s+/).map(Number);
    const width = (vb[2] || 720) * scale;
    const height = (vb[3] || 720) * scale;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable.");

    ctx.drawImage(img, 0, 0, width, height);

    await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("PNG export failed.");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          resolve();
        }, 50);
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
