import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PRESET } from "../data/defaults";
import { CATALOG } from "../data/catalog";

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

function setByPath(target, path, value) {
  const next = deepClone(target);
  let ref = next;
  for (let i = 0; i < path.length - 1; i += 1) {
    ref = ref[path[i]];
  }
  ref[path[path.length - 1]] = value;
  return next;
}

function getRandomId(items) {
  const item = items[Math.floor(Math.random() * items.length)];
  return item?.id ?? null;
}

export const useBuilderStore = create()(
  persist(
    (set, get) => ({
      preset: deepClone(DEFAULT_PRESET),
      activeTab: "hair",
      setActiveTab: (activeTab) => set({ activeTab }),
      setValue: (path, value) =>
        set((state) => ({
          preset: setByPath(state.preset, path, value),
        })),
      setBoxText: (field, value) =>
        set((state) => ({
          preset: {
            ...state.preset,
            box: {
              ...state.preset.box,
              [field]: value,
            },
          },
        })),
      resetPreset: () => set({ preset: deepClone(DEFAULT_PRESET) }),
      loadPreset: (incoming) => {
        if (!incoming || typeof incoming !== "object") return false;
        const merged = {
          ...deepClone(DEFAULT_PRESET),
          ...incoming,
          accessories: {
            ...deepClone(DEFAULT_PRESET).accessories,
            ...(incoming.accessories || {}),
          },
          box: {
            ...deepClone(DEFAULT_PRESET).box,
            ...(incoming.box || {}),
          },
        };
        set({ preset: merged });
        return true;
      },
      randomizePreset: () => {
        set((state) => ({
          preset: {
            ...state.preset,
            base: getRandomId(CATALOG.bases),
            skinTone: getRandomId(CATALOG.skinTones),
            hair: getRandomId(CATALOG.hairs),
            eyes: getRandomId(CATALOG.eyes),
            brows: getRandomId(CATALOG.brows),
            mouth: getRandomId(CATALOG.mouths),
            outfit: getRandomId(CATALOG.outfits),
            accessories: {
              glasses: getRandomId(CATALOG.glasses),
              hat: getRandomId(CATALOG.hats),
              neck: getRandomId(CATALOG.neck),
              hand: getRandomId(CATALOG.hand),
            },
            box: {
              ...state.preset.box,
              theme: getRandomId(CATALOG.boxThemes),
            },
            bg: getRandomId(CATALOG.backgrounds),
          },
        }));
      },
    }),
    {
      name: "cfb_mvp_v1",
      partialize: (state) => ({
        preset: state.preset,
        activeTab: state.activeTab,
      }),
    }
  )
);

export function readPath(obj, path) {
  return path.reduce((acc, key) => acc?.[key], obj);
}
