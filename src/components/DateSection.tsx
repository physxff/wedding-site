"use client";

import { motion } from "framer-motion";

export default function DateSection() {
  return (
    <section className="flex min-h-[50vh] items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
        className="text-center"
      >

        <div className="leading-none">
          <div className="text-[7rem] font-light md:text-[10rem]">
            26
          </div>

          <div className="mt-2 text-xl tracking-[0.25em] uppercase md:text-3xl relative left-[0.12em]">
            АВГУСТА
            </div>

          <div className="mt-4 text-2xl font-light md:text-4xl">
            2026
          </div>
        </div>

        <div className="mx-auto mt-10 h-px w-24 bg-neutral-300" />

        <p className="mt-8 text-xl md:text-2xl tracking-[0.2em] uppercase">
          Среда
        </p>
      </motion.div>
    </section>
  );
}