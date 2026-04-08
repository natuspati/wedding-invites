import { useState, useEffect } from "react";
import styles from "./RSVP.module.css";

type RSVPChoice = "solo" | "partner" | "no" | null;

export default function RSVP() {
  const [choice, setChoice] = useState<RSVPChoice>(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
    localStorage.setItem("wedding_rsvp_submitted", "true");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section>
        <div className="container section-card">
          <h2>Көп рақмет! ❤️</h2>
          <p>Сіздің қауабыңыз сақталды.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container section-card">
        <h2>Сауалнама</h2>
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

          <div className={`${styles.inputExpansion} ${choice && choice !== "no" ? styles.show : ""}`}>
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
                required
              />
            )}
          </div>

          {choice && (
            <button className={styles.submitBtn} type="submit">
              Қауапты жіберу
            </button>
          )}
        </form>
      </div>
    </section>
  );
}