"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { motion, useInView } from "framer-motion";

function getTimeLeft() {
  const target = new Date("2026-08-26T15:30:00").getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function RSVPSection() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    const updateTimer = () => setTimeLeft(getTimeLeft());
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [guests, setGuests] = useState("");
  const [wishes, setWishes] = useState("");
  const [loading, setLoading] = useState(false);

  // 👇 trigger появления блока
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-100px",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          attendance,
          guests,
          wishes,
        }),
      });

      const data = await response.json();
      if (!data.ok) throw new Error();

      setName("");
      setAttendance("");
      setGuests("");
      setWishes("");

      alert("Спасибо! Ваш ответ отправлен.");
    } catch (err) {
      console.error("❌ SEND API ERROR:", err);
    }

    setLoading(false);
  };

  return (
    <section ref={sectionRef} className="px-0 py-12 bg-white">

      {/* ===================== */}
      {/*        ЛЕНТА         */}
      {/* ===================== */}
      <div className="relative flex items-center justify-center min-h-[45svh] overflow-hidden">

        <svg
          viewBox="-1690 -1700 9000 6000"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g transform="scale(0.35) translate(2000, 2000)">

            <motion.path
              d="M-14993.386 2006.414C-12986.627 2011.38-13012.358 30.1-9988.739 28.277-6998.248 28.277-7052.62 1985.69-4004.067 2001.341-1988.866 2011.367-1998.892-996.395-3993.656-986.063-6010.345-986.063-5970.72 2006.577-4000.636 2006.577-992.55 1985.393 24.267 1032.127 1348.368-1200.996 2167.244-.841 2872.407 572.171 4534.877 821.811 5031.059 895.617 6004.773 774.904 6023.439 12.917 5966.646-475.753 5695.952-898.417 5020.205-1010.381 4358.07-1080.608 3634.873-774.942 3485.257-17.18 3435.414 540.539 3576.946 935.419 3998.304 1507.262 4901.215 2520.529 6817.392 2841.564 6004.379 3990.546 5206.008 2826.508 7118.363 2500.464 8011.241 1507.262 8422.567 925.387 8563.02 453.867 8482.761-17.654 8262.653-748.833 7754.348-1073.92 6998.578-999.642 6322.15-897.182 6139.317-519.326 6023.523 4.795 6007.805 813.264 6975.927 891.225 7413.572 813.994 9099.795 466.452 9870.256.644 10763.135-1233.334 12010.463 990.908 13050.411 1997.842 15988.678 2030.856 17986.657 2015.854 17986.657-981.798 16005.376-968.933 14024.095-981.798 13998.364 1990.123 15989.408 2036.986 19017.369 2017.36 20020.875 23.214 22979.931 10.349 25997.22-3.539 26060.79 2009.527 28010.286 2009.527"
              fill="none"
              stroke="#c81d25"
              strokeWidth={120}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />

          </g>
        </svg>

        {/* таймер */}
        <div className="relative z-10 px-6 py-12 text-center">
          <p className="text-sm md:text-2xl uppercase tracking-[0.4em] text-neutral-700">
            До свадьбы осталось
          </p>

          {!timeLeft ? (
            <p className="mt-7 text-2xl">Загрузка...</p>
          ) : (
            <div className="mt-3 flex justify-center gap-6 text-2xl md:text-4xl font-light">
              <div>{timeLeft.days} д</div>
              <div>{timeLeft.hours} ч</div>
              <div>{timeLeft.minutes} м</div>
              <div>{timeLeft.seconds} с</div>
            </div>
          )}
        </div>
      </div>

      {/* ===================== */}
      {/*        ФОРМА        */}
      {/* ===================== */}
      <div className="px-6">
        <div className="mx-auto max-w-xl">

          <h2 className="mb-10 text-center text-xl font-light md:text-2xl">
            Ваше присутствие — лучший подарок для нас.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ФИО"
              className="w-full rounded-xl border px-4 py-3"
            />

            <select
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Будете присутствовать?</option>
              <option value="Да">Да</option>
              <option value="Нет">Нет</option>
            </select>

            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />

            <textarea
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              rows={4}
              className="w-full rounded-xl border px-4 py-3"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-black py-4 text-white"
            >
              {loading ? "Отправка..." : "Подтвердить присутствие"}
            </button>

          </form>
        </div>
      </div>

    </section>
  );
}