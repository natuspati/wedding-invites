import { useState, useEffect } from "react";
import styles from "@/components/rsvp/RSVP.module.css";
import config from "@/config";
import type { RSVPChoice, RSVPInDB } from "@/components/rsvp/RSVP.shema";
import { RSVPCreateSchema } from "@/components/rsvp/RSVP.shema";
import ErrorMessage from "@/components/rsvp/ErrorMessage";

export default function RSVP() {
  const [choice, setChoice] = useState<RSVPChoice | null>(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("wedding_rsvp_submitted")) {
      setSubmitted(true);
    }
  }, []);

  function handleChoice(newChoice: RSVPChoice) {
    setChoice(newChoice);
    if (newChoice === "no") {
      setName1("");
      setName2("");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      choice: choice!,
      name: choice === "no" ? null : name1 || null,
      partner_name: choice === "partner" ? name2 || null : null,
    };

    const validation = RSVPCreateSchema.safeParse(payload);

    if (!validation.success) {
      setError(validation.error.issues.map((i) => i.message).join(", "));
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/api/v1/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Сервер қатесі");
      }

      const data: RSVPInDB = await response.json();

      console.log(`Saved RSVP with id: ${data.id}`);

      localStorage.setItem("wedding_rsvp_submitted", "true");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Сұрау жіберу кезінде қате орын алды.");
    }
  }

  if (submitted) {
    return (
      <section>
        <div className="container section-card">
          <h3>Көп рақмет! ❤️</h3>
          <p>Сіздің қауабыңыз сақталды.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container section-card">
        <h3>Сауалнама</h3>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.choiceGroup}>
            <button
              type="button"
              className={`${styles.choiceBtn} ${choice === "solo" ? styles.active : ""}`}
              onClick={() => handleChoice("solo")}
            >
              Әрине, келемін
            </button>

            <button
              type="button"
              className={`${styles.choiceBtn} ${choice === "partner" ? styles.active : ""}`}
              onClick={() => handleChoice("partner")}
            >
              Жұбайыммен келемін
            </button>

            <button
              type="button"
              className={`${styles.choiceBtn} ${choice === "no" ? styles.active : ""}`}
              onClick={() => handleChoice("no")}
            >
              Келе алмаймын
            </button>
          </div>

          <div
            className={`${styles.inputExpansion} ${choice && choice !== "no" ? styles.show : ""}`}
          >
            <input
              placeholder="Аты-жөнім"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              required={choice !== "no" && !!choice}
            />
            {choice === "partner" && (
              <input
                placeholder="Жұбайымның аты-жөні"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                disabled={choice !== "partner"}
              />
            )}
          </div>

          {choice && (
            <button className={styles.submitBtn} type="submit">
              Қауапты жіберу
            </button>
          )}
        </form>

        {error && <ErrorMessage message={error} />}
      </div>
    </section>
  );
}
