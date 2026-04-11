import { useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "@/components/shared-album/SharedAlbum.module.css";
import config from "@/config";

export default function SharedAlbum() {
  const [qrSvg, setQrSvg] = useState<string>("");

  useEffect(() => {
    QRCode.toString(config.sharedAlbumUrl, {
      type: "svg",
      color: {
        dark: "#2b2b2b",
        light: "#ffffff00",
      },
      margin: 2,
      width: 220,
    }).then(setQrSvg);
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <h3>Той фотоальбомы</h3>

        <p className={styles.text}>
          Той күнінің суреттерін көру және жүктеу үшін QR кодты сканерлеңіз.
          Сіздің сәттеріңізді көргіміз келеді ❤️
        </p>

        <div
          className={styles.qr}
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />

        <a
          className={styles.link}
          href={config.sharedAlbumUrl}
          target="_blank"
          rel="noreferrer"
        >
          Альбомды ашу →
        </a>
      </div>
    </section>
  );
}
