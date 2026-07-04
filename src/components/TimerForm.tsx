"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

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

  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  useEffect(() => {
    if (isInView) {
      controls.start({
        pathLength: 1,
        transition: { duration: 2.5, ease: "easeInOut" },
      });
    }
  }, [isInView, controls]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, guests, wishes }),
      });

      const data = await response.json();
      if (!data.ok) throw new Error();

      setName("");
      setAttendance("");
      setGuests("");
      setWishes("");

      alert("Спасибо! Ваш ответ отправлен.");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <section ref={ref} className="px-0 py-12 bg-white">

      {/* ЛЕНТА */}
      <div className="relative flex items-center justify-center min-h-[45svh] overflow-hidden">

  <svg
    viewBox="0 0 1000 400"
    className="absolute inset-0 w-full h-full"
    preserveAspectRatio="xMidYMid meet"
  >
    <motion.path
      d="M0 200 C 150 50, 350 350, 500 200 S 850 50, 1000 200"
      fill="none"
      stroke="#c81d25"
      strokeWidth={70}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={controls}
    />
  </svg>

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

      {/* ФОРМА */}
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