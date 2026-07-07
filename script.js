const rawMessage = `Hay, Zahra.

Apa kabar?

Kalau suatu hari nanti kamu membaca pesan ini, semoga saat itu kamu sedang baik-baik saja.

Sudah sepuluh hari aku nggak ketemu kamu dan nggak nanya kabar kamu. Ternyata rasanya cukup berat juga. Kenapa ya? Haha... mungkin cuma aku yang ngerasa seperti itu.

Hampir setiap hari, kadang pagi, kadang sore, aku selalu bilang, "gimana kamu happy hari ini?," ke foto kamu. Haha... Anggap saja itu doa. Semoga doa itu sampai, walaupun aku nggak tahu kamu akan pernah merasakannya atau nggak.

Kalau suatu saat kamu sempat bertanya, "Kok tumben Ridwan nggak nanya kabar?"

Walaupun aku yakin kemungkinan besar kamu nggak akan kepikiran sampai ke situ. Haha. Tapi kalau memang kamu pernah bertanya, sebenarnya nggak ada alasan yang benar-benar bisa menjelaskan. Kalau kamu tanya langsung ke aku sekarang, aku akan jawab sejujur-jujurnya.

Oh ya, gimana hari-hari kamu?

Terakhir aku lihat, kamu kurang sehat. Sebenarnya aku ingin nanya keadaan kamu, tapi ada batas yang membuat aku cuma bisa memperhatikan kamu dari jauh. Tapi aku yakin kamu kuat. Kamu hebat.

Zar, pernah nggak kamu sadar kalau kita cuma punya waktu sekitar empat tahun berada di tempat yang sama? Setelah itu, mungkin kita akan menjalani hidup masing-masing, seperti sepuluh hari ini yang sudah kita lewati.

Sepuluh hari ini juga jadi pembelajaran buat aku, supaya mulai terbiasa. Karena suatu saat nanti, aku mungkin nggak akan bisa lagi melihat kamu duduk di kursi di ruangan tengah, di meja pertama, ada sekotak makanan, kadang sebungkus kertas nasi berwarna cokelat, dan sebotol air putih yang kadang susah kamu buka.

Aku rasa, nanti aku akan kangen sama pemandangan sederhana itu.

Selama empat tahun yang singkat ini, aku cuma ingin memperhatikan hal-hal kecil tentang kamu. Entah kenapa, aku selalu berharap kamu baik-baik saja. Aku ingin kamu nggak sedih, senyummu nggak terpaksa, dan kebahagiaanmu selalu datang dengan tulus tanpa paksaan.

Kenapa aku bisa sampai seperti ini?

Aku juga nggak tahu.

Kalau dibilang cinta, rasanya kata itu terlalu sederhana. Mungkin yang lebih tepat, aku merasa sangat nyaman dan kagum sama kamu. Sampai akhirnya, hal-hal kecil tentang kamu pun tanpa sadar selalu aku ingat.

Semua perhatian yang aku kasih sebenarnya nggak ada apa-apanya dan mungkin juga nggak berarti buat kamu. Jadi anggap aja ini adalah gambaran tentang bagaimana seseorang seharusnya memperhatikan pasangannya. Mungkin sekarang laki-lakimu belum, tapi aku berharap suatu saat nanti laki laki mu memperlakukan kamu persis seperti itu, bahkan jauh lebih baik.

Ini akan jadi pesan terakhirku.

Senin, 13 Juli 2026.

Hari terakhir kita duduk bersebelahan. Hari terakhir aku sok akrab ngobrol sama kamu.

Setelah ini, aku ga akan ada di depan matamu lagi,ga akan memperhatikan kamu, ga akan ganggu kamu lagi, dan ga akan nanya kabar kamu lagi.

kalau kamu butuh bantuan bilang aja sama purna.

Kalau kamu tanya kenapa, jawabannya sederhana. Aku takut rasa nyamanku berubah menjadi rasa suka yang lebih dalam, sementara kita sama-sama tahu, ada batas yang nggak bisa kita lewati.

Apa pun yang terjadi nanti, semoga hari-hari kamu selalu dipenuhi hal-hal baik.

Happy terus ya, Azzahra Halimatu Syadiah.`;

const paragraphs = rawMessage
  .split(/\n\s*\n/)
  .map((text) => text.trim())
  .filter(Boolean);

const intro = document.querySelector("#intro");
const confirmLayer = document.querySelector("#confirm");
const experience = document.querySelector("#experience");
const startButton = document.querySelector("#startButton");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const messageText = document.querySelector("#messageText");
const memoryPhoto = document.querySelector("#memoryPhoto");
const progressFill = document.querySelector("#progressFill");
const timeText = document.querySelector("#timeText");
const song = document.querySelector("#song");
const endingQuestion = document.querySelector("#endingQuestion");
const endingActions = document.querySelector("#endingActions");
const endingAnswer = document.querySelector("#endingAnswer");
const allowButton = document.querySelector("#allowButton");
const stayButton = document.querySelector("#stayButton");
const textFrame = document.querySelector("#textFrame");

let cues = [];
let currentIndex = -1;
let rafId = null;
let textStartTime = 0;
let endingTimer = null;
let endingScheduled = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function buildCues(duration) {
  const readableDuration = Math.max((duration || 0) * 1.06, 1);
  const totalWeight = paragraphs.reduce((sum, text) => sum + Math.max(38, text.length), 0);
  let cursor = 0;

  cues = paragraphs.map((text, index) => {
    const weight = Math.max(38, text.length);
    const slice = index === paragraphs.length - 1
      ? readableDuration - cursor
      : readableDuration * (weight / totalWeight);
    const cue = {
      text,
      start: cursor,
      end: Math.min(readableDuration, cursor + slice),
    };

    cursor = cue.end;
    return cue;
  });

  if (cues.length) {
    cues[cues.length - 1].end = readableDuration;
  }
}

function setMessage(index) {
  if (index === currentIndex || !cues[index]) return;

  currentIndex = index;
  const shouldShowPhoto = cues[index].text.includes("ke foto kamu");
  const length = cues[index].text.length;
  const size = length > 300
    ? "clamp(1.15rem, 2.7vw, 1.7rem)"
    : length > 210
      ? "clamp(1.24rem, 3vw, 1.95rem)"
      : length > 130
        ? "clamp(1.45rem, 3.6vw, 2.35rem)"
        : "clamp(1.8rem, 4.7vw, 3.1rem)";

  messageText.classList.remove("is-changing");
  textFrame.classList.remove("is-turning");
  void textFrame.offsetWidth;
  messageText.style.setProperty("--message-size", size);
  messageText.textContent = cues[index].text;
  messageText.classList.add("is-changing");
  textFrame.classList.add("is-turning");

  memoryPhoto.classList.toggle("is-visible", shouldShowPhoto);
  if (shouldShowPhoto) {
    memoryPhoto.getAnimations().forEach((animation) => {
      animation.cancel();
      animation.play();
    });
  }
}

function syncFrame() {
  const duration = song.duration || cues.at(-1)?.end || 0;
  const current = textStartTime ? (performance.now() - textStartTime) / 1000 : song.currentTime || 0;
  const activeIndex = cues.findIndex((cue, index) => {
    const nextCue = cues[index + 1];
    return current >= cue.start && (!nextCue || current < nextCue.start);
  });

  setMessage(activeIndex < 0 ? 0 : activeIndex);

  if (duration) {
    const audioCurrent = song.currentTime || 0;
    const progress = Math.min(100, (audioCurrent / duration) * 100);
    progressFill.style.width = `${progress}%`;
    timeText.textContent = `${formatTime(audioCurrent)} / ${formatTime(duration)}`;
  }

  if (cues.at(-1) && current >= cues.at(-1).end) {
    setMessage(cues.length - 1);
    scheduleEndingQuestion();
    rafId = null;
    return;
  }

  rafId = requestAnimationFrame(syncFrame);
}

function scheduleEndingQuestion() {
  if (endingScheduled) return;

  endingScheduled = true;
  window.clearTimeout(endingTimer);
  endingTimer = window.setTimeout(showEndingQuestion, 30_000);
}

function showEndingQuestion() {
  endingQuestion.classList.add("is-visible");
  endingQuestion.setAttribute("aria-hidden", "false");
}

function showConfirm() {
  confirmLayer.classList.add("is-visible");
  confirmLayer.setAttribute("aria-hidden", "false");
}

function hideConfirm() {
  confirmLayer.classList.remove("is-visible");
  confirmLayer.setAttribute("aria-hidden", "true");
}

async function startExperience() {
  hideConfirm();
  intro.classList.remove("is-visible");
  experience.classList.add("is-visible");
  experience.setAttribute("aria-hidden", "false");
  endingQuestion.classList.remove("is-visible");
  endingQuestion.setAttribute("aria-hidden", "true");
  endingActions.hidden = false;
  endingAnswer.textContent = "";
  endingScheduled = false;
  window.clearTimeout(endingTimer);

  song.loop = true;
  song.muted = false;
  song.volume = 1;
  try {
    song.currentTime = 0;
  } catch {
    // Some browsers only allow seeking after metadata is ready.
  }

  buildCues(song.duration || 180);
  setMessage(0);
  textStartTime = performance.now();
  cancelAnimationFrame(rafId);
  syncFrame();

  const playAttempt = song.play();
  try {
    await playAttempt;
  } catch {
    const retryPlay = async () => {
      try {
        song.muted = false;
        song.volume = 1;
        await song.play();
      } catch {
        messageText.textContent = "Browser masih menahan lagunya. Klik sekali lagi ya.";
      }
    };

    messageText.textContent = "Klik layar sekali lagi untuk memulai lagunya.";
    experience.addEventListener("click", retryPlay, { once: true });
  }
}

startButton.addEventListener("click", showConfirm);
noButton.addEventListener("click", hideConfirm);
yesButton.addEventListener("click", startExperience);

song.addEventListener("ended", () => {
  progressFill.style.width = "100%";
  timeText.textContent = `${formatTime(song.duration)} / ${formatTime(song.duration)}`;
  if (!song.loop) {
    song.currentTime = 0;
    song.play();
  }
});

song.addEventListener("loadedmetadata", () => {
  buildCues(song.duration);
  timeText.textContent = `00:00 / ${formatTime(song.duration)}`;
});

allowButton.addEventListener("click", () => {
  endingActions.hidden = true;
  endingAnswer.textContent = "Ya sudah, selesai.";
});

stayButton.addEventListener("click", () => {
  endingActions.hidden = true;
  endingAnswer.textContent = "Kasih alasannya sekarang, aku di depan kamu.";
});

messageText.textContent = paragraphs[0];
