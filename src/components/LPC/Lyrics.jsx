// Lyrics.jsx
import { useEffect, useRef, useState } from "react";
import { LetterText, MicVocal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lyrics({ lyrics, progress, onSeek }) {
  const [activeTab, setActiveTab] = useState("synced");
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [prevIdx, setPrevIdx] = useState(-1);

  const currentLineRef = useRef(null);
  const containerRef = useRef(null);

  const synced = Array.isArray(lyrics?.synced) ? lyrics.synced : [];

  if (!lyrics) return <p className="text-center text-white">Cargando letra...</p>;

  const findCurrentLineIndex = (arr, t) => {
    if (!arr || arr.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < arr.length; i++) {
      if (t >= arr[i].time) idx = i;
      else break;
    }
    return idx;
  };

  // Se mueve la lógica de animación a un solo useEffect
  useEffect(() => {
    const idx = findCurrentLineIndex(synced, progress);
    if (idx !== currentIdx) {
      setPrevIdx(currentIdx);
      setCurrentIdx(idx);
    }
  }, [progress, synced, currentIdx]);

  // Se centra visualmente la línea actual
  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIdx]);

  const BASE = Math.max(0, currentIdx);
  const STEP = 44;

  const opacityFor = (offset) =>
    offset === 0 ? 1 : offset === 1 ? 1 : offset === 2 ? 0.75 : offset === 3 ? 0.5 : 0.25;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col h-full">
      <div className="tabs mb-4">
        <button
          className={`tab tab-bordered text-white [--color-base-content:text-white] ${activeTab === "plain" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("plain")}
        >
          <LetterText />
        </button>
        <button
          className={`tab tab-bordered text-white [--color-base-content:text-white] ${activeTab === "synced" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("synced")}
        >
          <MicVocal />
        </button>
      </div>

      <div className="tab-content flex-1 flex flex-col justify-center h-full">
        {activeTab === "synced" ? (
          <div ref={containerRef} className="relative h-[75vh] overflow-hidden p-4">
            {synced.length > 0 ? (
              <AnimatePresence>
                {[0, 1, 2, 3, 4]
                  .map((o) => BASE + o)
                  .filter((i) => i >= 0 && i < synced.length)
                  .map((i) => {
                    const offset = i - BASE;
                    const line = synced[i];
                    const isMain = offset === 0;

                    return (
                      <motion.div
                        ref={isMain ? currentLineRef : null}
                        key={line.time}
                        className="absolute left-0 right-0 text-left text-2xl font-bold"
                        style={{ top: "35%" }}
                        initial={{ y: STEP * (offset + 1), opacity: 0 }}
                        animate={{ y: STEP * offset, opacity: opacityFor(offset) }}
                        exit={
                          isMain
                            ? { y: -STEP, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }
                            : { opacity: 0 }
                        }
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <span
                          className={
                            isMain
                              ? "text-white"
                              : offset === 1
                              ? "text-white/75"
                              : offset === 2
                              ? "text-white/50"
                              : offset === 3
                              ? "text-white/25"
                              : "text-white/10"
                          }
                        >
                          {line.text}
                        </span>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            ) : (
              <p className="italic text-gray-300 text-center">
                No hay letra sincronizada para esta canción.
              </p>
            )}
          </div>
        ) : (
          <div className="h-[75vh] overflow-y-auto whitespace-pre-wrap text-white text-left p-4 rounded-lg">
            {lyrics?.plain === "No se encontró letra para esta canción." ? (
              <h2 className="italic text-center opacity-75">No se encontró letra para esta canción.</h2>
            ) : (
              lyrics?.plain || ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}