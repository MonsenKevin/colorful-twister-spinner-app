import { useState } from "react";

type TwisterColor = {
  name: string;
  hex: string;
};

type SpinCommand = {
  limb: string;
  color: TwisterColor;
  index: number;
};

const colors: TwisterColor[] = [
  { name: "Red", hex: "#f4515f" },
  { name: "Blue", hex: "#3478f6" },
  { name: "Yellow", hex: "#ffc93d" },
  { name: "Green", hex: "#40c97a" },
];

const limbs = ["Right hand", "Left hand", "Right foot", "Left foot"];

const commands: SpinCommand[] = limbs.flatMap((limb, limbIndex) =>
  colors.map((color, colorIndex) => ({
    limb,
    color,
    index: limbIndex * colors.length + colorIndex,
  })),
);

const wheelGradient = `repeating-conic-gradient(
    from -11.25deg,
    rgba(32, 24, 45, 0.18) 0deg 1.25deg,
    transparent 1.25deg 22.5deg
  ),
  conic-gradient(
    from -11.25deg,
    #f4515f 0deg 22.5deg,
    #3478f6 22.5deg 45deg,
    #ffc93d 45deg 67.5deg,
    #40c97a 67.5deg 90deg,
    #f4515f 90deg 112.5deg,
    #3478f6 112.5deg 135deg,
    #ffc93d 135deg 157.5deg,
    #40c97a 157.5deg 180deg,
    #f4515f 180deg 202.5deg,
    #3478f6 202.5deg 225deg,
    #ffc93d 225deg 247.5deg,
    #40c97a 247.5deg 270deg,
    #f4515f 270deg 292.5deg,
    #3478f6 292.5deg 315deg,
    #ffc93d 315deg 337.5deg,
    #40c97a 337.5deg 360deg
  )`;

function getRandomCommand(previous: SpinCommand): SpinCommand {
  let next = commands[Math.floor(Math.random() * commands.length)];

  while (next.index === previous.index) {
    next = commands[Math.floor(Math.random() * commands.length)];
  }

  return next;
}

export default function App() {
  const initialCommand = commands[5];
  const [command, setCommand] = useState<SpinCommand>(initialCommand);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(-(initialCommand.index * 22.5));
  const [turn, setTurn] = useState(0);

  const colorLabel = command.color.name.toUpperCase();

  function spin() {
    if (isSpinning) return;

    const next = getRandomCommand(command);
    const targetAngle = -(next.index * 22.5);

    setRotation((previousRotation) => {
      const currentAngle = ((previousRotation % 360) + 360) % 360;
      const desiredAngle = ((targetAngle % 360) + 360) % 360;
      const finalStep = (desiredAngle - currentAngle + 360) % 360;

      return previousRotation + 1440 + finalStep;
    });

    setCommand(next);
    setTurn((previous) => previous + 1);
    setIsSpinning(true);

    window.setTimeout(() => setIsSpinning(false), 1450);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf2] px-5 py-6 text-[#231c35] sm:px-8 sm:py-8">
      <div className="confetti confetti-one" />
      <div className="confetti confetti-two" />
      <div className="confetti confetti-three" />
      <div className="confetti confetti-four" />
      <div className="confetti confetti-five" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
        <a href="#spinner" className="brand-mark" aria-label="Twister spinner home">
          TWISTER
        </a>
      </header>

      <section id="spinner" className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-6xl flex-col items-center justify-center gap-10 py-10 lg:flex-row lg:gap-24 lg:py-6">
        <div className="relative shrink-0" aria-label="Twister color spinner">
          <div className="pointer-shadow" />
          <div className="spinner-pointer" aria-hidden="true" />
          <div className="relative h-[min(78vw,29rem)] w-[min(78vw,29rem)] sm:h-[29rem] sm:w-[29rem]">
            <div
              className="wheel absolute inset-0 rounded-full"
              style={{ background: wheelGradient, transform: `rotate(${rotation}deg)` }}
            >
              <div className="absolute inset-[15%] rounded-full border-[6px] border-[#231c35] bg-[#fffaf2] shadow-[inset_0_0_0_7px_#ffffff]" />
              <button
                type="button"
                onClick={spin}
                disabled={isSpinning}
                aria-label="Spin the wheel"
                className="wheel-center-button"
              >
                <span className="text-[0.65rem] font-black uppercase leading-tight tracking-[0.2em] text-[#231c35]">
                  Spin
                  <br />
                  me
                </span>
              </button>
              <span className="wheel-zone wheel-zone-one">R hand</span>
              <span className="wheel-zone wheel-zone-two">L hand</span>
              <span className="wheel-zone wheel-zone-three">R foot</span>
              <span className="wheel-zone wheel-zone-four">L foot</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md text-center lg:text-left">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#786d83]">Your next move</p>
          <div className="min-h-44" aria-live="polite" aria-atomic="true">
            <p className="mb-1 text-4xl font-black uppercase leading-none tracking-[-0.06em] text-[#231c35] sm:text-6xl">
              {command.limb}
            </p>
            <p
              key={turn}
              className="result-pop inline-block text-5xl font-black uppercase leading-none tracking-[-0.07em] sm:text-7xl"
              style={{ color: command.color.hex }}
            >
              {isSpinning ? "..." : colorLabel}
            </p>
          </div>

          <div className="mt-7 flex flex-col items-center gap-4 lg:items-start">
            <button
              type="button"
              onClick={spin}
              disabled={isSpinning}
              className="spin-button w-full sm:w-auto"
            >
              {isSpinning ? "Spinning..." : "Spin the wheel"}
              <span className="spin-button-arrow" aria-hidden="true">&gt;</span>
            </button>
            <p className="text-sm font-bold text-[#766b7e]">Four colors. Four limbs. Lots of giggles.</p>
          </div>

          <div className="mt-8 flex justify-center gap-3 lg:justify-start" aria-label="Twister colors">
            {colors.map((color) => (
              <span
                key={color.name}
                className="h-7 w-7 rounded-full border-2 border-[#231c35] shadow-[0_3px_0_#231c35]"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}