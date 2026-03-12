import { useEffect, useState } from "react";
import mascota from "../assets/img/mascota.png";

const COLOR_PRIMARY = "#5C73F2";
const COLOR_SECONDARY = "#91BBF2";

export const NotFound = () => {
  const [boxes, setBoxes] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);
  const [playing, setPlaying] = useState(false);

  // Generar caja aleatoria
  const spawnBox = () => {
    const newBox = {
      id: Date.now(),
      x: Math.random() * 80,
      y: Math.random() * 60,
    };
    setBoxes(prev => [...prev, newBox]);
  };

  // Iniciar juego
  const startGame = () => {
    setBoxes([]);
    setScore(0);
    setTime(10);
    setPlaying(true);
  };

  // Timer
  useEffect(() => {
    if (!playing) return;

    if (time <= 0) {
      setPlaying(false);
      return;
    }

    const interval = setInterval(() => {
      spawnBox();
      setTime(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [playing, time]);

  // Click en caja
  const handleClick = (id) => {
    setBoxes(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        textAlign: "center",
        padding: 40,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 80, color: COLOR_PRIMARY }}>404</h1>
      <h2>¡Ups! Página no encontrada</h2>

      {!playing && (
        <button
          onClick={startGame}
          style={{
            marginTop: 20,
            padding: "12px 30px",
            borderRadius: 10,
            border: "none",
            background: COLOR_PRIMARY,
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Jugar 🎮
        </button>
      )}

      {playing && (
        <>
          <div style={{ margin: "20px 0", fontWeight: "bold" }}>
            Tiempo: {time}s | Score: {score}
          </div>

          <div
            style={{
              position: "relative",
              height: 400,
              background: "#f8fafc",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {boxes.map((box) => (
              <img
                key={box.id}
                src={mascota}
                onClick={() => handleClick(box.id)}
                style={{
                  position: "absolute",
                  top: `${box.y}%`,
                  left: `${box.x}%`,
                  width: 70,
                  height: "auto",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              />
            ))}
          </div>
        </>
      )}

      {!playing && time === 0 && (
        <div style={{ marginTop: 20 }}>
          <p>Has rescatado final: {score} Trasteritos 🐣</p>
          <button
            onClick={startGame}
            style={{
              padding: "10px 25px",
              borderRadius: 8,
              border: `2px solid ${COLOR_PRIMARY}`,
              background: "#fff",
              color: COLOR_PRIMARY,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};