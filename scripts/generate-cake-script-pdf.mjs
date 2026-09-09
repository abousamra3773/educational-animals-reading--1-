import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('public/downloads');
const OUT_FILE = path.join(OUT_DIR, 'the-case-of-the-missing-cake-recipe-script.pdf');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Colors
const INK = '#3f2d23';
const MUTED = '#8a7a6d';
const ACCENT = '#c2410c'; // warm orange (Pancake)
const NARRATOR = '#4d7c0f'; // lime/olive (Willa)
const RULE = '#e7ddd3';

const scenes = [
  {
    title: 'Scene 1 — Jake\u2019s Bakery',
    lines: [
      { who: 'Willa the Wandering Warbler (Narrator)', text: 'Flutter! It\u2019s me, Willa the Wandering Warbler! I just flew into Jake\u2019s Bakery in Tangle Tail Town and something is wrong!' },
      { who: 'Jake the Snake', text: 'Oh no! My recipe is blank! It just says RECIPE and nothing else!' },
    ],
  },
  {
    title: 'Scene 2 — Remembering the Lake',
    lines: [
      { who: 'Jake the Snake', text: 'I put it by the lake this morning. Did I take it back?' },
      { who: 'Willa the Wandering Warbler (Narrator)', text: 'Jake tries to remember where he left the recipe.' },
      { who: 'Detective (You!)', text: 'Let\u2019s ask Pancake!' },
    ],
  },
  {
    title: 'Scene 3 — Pancake\u2019s Clue',
    lines: [
      { who: 'Pancake the Cat', text: 'I saw it fall! Jake tried to make the batter and it slipped away.' },
      { who: 'Willa the Wandering Warbler (Narrator)', text: 'Pancake points toward the door with her paw.' },
      { who: 'Detective (You!)', text: 'Follow the clue!' },
    ],
  },
  {
    title: 'Scene 4 — Find the Recipe! (Interactive)',
    note: 'Can you find the missing recipe? Click on the recipe to help Jake the Snake. (Hint: Look near the door! The recipe paper is under the doormat.)',
    lines: [
      { who: 'Detective (You!)', text: 'There it is! The recipe slipped under the mat by mistake.' },
      { who: 'Willa the Wandering Warbler (Narrator)', text: 'The detective hands the recipe back to Jake.' },
    ],
  },
  {
    title: 'Scene 5 — Recipe Found!',
    lines: [
      { who: 'Jake the Snake', text: 'You found it! Now I can bake my cake!' },
      { who: 'Willa the Wandering Warbler (Narrator)', text: 'Jake is so happy! He will make the best cake for the town party.' },
      { who: 'Pancake the Cat', text: 'Hooray!' },
    ],
  },
  {
    title: 'Scene 6 — Well Done, Detective!',
    lines: [
      { who: 'Pancake the Cat', text: 'Great job, Detective!' },
      { who: 'Willa the Wandering Warbler (Narrator)', text: 'You helped Jake find his recipe! Time to practice your -AKE words: cake, bake, lake, make, take, wake, Jake, rake, shake, flake.' },
    ],
  },
];

const words = ['cake', 'bake', 'lake', 'make', 'take', 'wake', 'Jake', 'rake', 'shake', 'flake'];

const doc = new PDFDocument({ size: 'LETTER', margins: { top: 64, bottom: 64, left: 64, right: 64 } });
doc.pipe(fs.createWriteStream(OUT_FILE));

const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

function whoColor(who) {
  if (who.includes('Narrator')) return NARRATOR;
  if (who.startsWith('Pancake')) return ACCENT;
  if (who.startsWith('Detective')) return '#2563eb';
  return INK;
}

// ---- Title block ----
doc.fillColor(MUTED).fontSize(12).font('Helvetica').text('WORD AND WHISKERS  \u2022  TANGLE TAIL TOWN', { align: 'center', characterSpacing: 1 });
doc.moveDown(0.6);
doc.fillColor(INK).fontSize(26).font('Helvetica-Bold').text('The Case of the Missing Cake Recipe', { align: 'center' });
doc.moveDown(0.3);
doc.fillColor(MUTED).fontSize(12).font('Helvetica-Oblique').text('Help Jake the Snake find his missing cake recipe!', { align: 'center' });
doc.moveDown(0.8);

doc.fillColor(INK).fontSize(10.5).font('Helvetica').text(
  'Word family: -ake      Difficulty: Easy      Narrator: Willa the Wandering Warbler      Detective: Pancake the Cat',
  { align: 'center' }
);
doc.moveDown(0.9);
doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor(RULE).lineWidth(1).stroke();
doc.moveDown(1);

// ---- Scenes ----
for (const scene of scenes) {
  // keep scene header with at least first line
  if (doc.y > doc.page.height - 180) doc.addPage();

  doc.fillColor(ACCENT).fontSize(15).font('Helvetica-Bold').text(scene.title);
  doc.moveDown(0.4);

  if (scene.note) {
    doc.fillColor(MUTED).fontSize(10).font('Helvetica-Oblique').text(scene.note, { width: pageWidth });
    doc.moveDown(0.5);
  }

  for (const line of scene.lines) {
    doc.fillColor(whoColor(line.who)).fontSize(11).font('Helvetica-Bold').text(line.who);
    doc.fillColor(INK).fontSize(11.5).font('Helvetica').text(line.text, { width: pageWidth, lineGap: 2 });
    doc.moveDown(0.55);
  }
  doc.moveDown(0.4);
}

// ---- Practice words ----
if (doc.y > doc.page.height - 160) doc.addPage();
doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor(RULE).lineWidth(1).stroke();
doc.moveDown(0.9);
doc.fillColor(NARRATOR).fontSize(15).font('Helvetica-Bold').text('Practice your -AKE words');
doc.moveDown(0.5);
doc.fillColor(INK).fontSize(13).font('Helvetica').text(words.join('     \u2022     '), { width: pageWidth });
doc.moveDown(1.5);

doc.fillColor(MUTED).fontSize(9).font('Helvetica').text('Word and Whiskers  \u2022  A reading mystery for early readers', { align: 'center' });

doc.end();
console.log('[v0] PDF written to', OUT_FILE);
