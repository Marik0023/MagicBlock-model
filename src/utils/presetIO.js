export function downloadPresetJson(preset) {
  const blob = new Blob([JSON.stringify(preset, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "figure-preset.json";
  a.click();

  setTimeout(() => URL.revokeObjectURL(a.href), 50);
}

export function readPresetFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        resolve(parsed);
      } catch (error) {
        reject(new Error("Invalid JSON preset file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}
