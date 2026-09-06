import React, { useState, useRef } from 'react';
import { Mystery } from '../types';
import { XIcon, PrinterIcon, BookIcon, DownloadIcon } from './icons/Icons';

interface WorksheetGeneratorProps {
  mystery: Mystery;
  onClose: () => void;
}

type WorksheetTab = 'word-family' | 'flashcards' | 'comprehension';

function generateFillInBlanks(mystery: Mystery) {
  const templates: Record<string, { sentence: string; answer: string }[]> = {
    'missing-cake': [
      { sentence: 'Jake the Snake needed to _______ a cake for the town party.', answer: 'bake' },
      { sentence: 'He put his recipe by the _______ that morning.', answer: 'lake' },
      { sentence: 'The recipe slipped under the mat by _______.', answer: 'mistake' },
      { sentence: 'Now Jake can _______ his delicious cake!', answer: 'make' },
      { sentence: 'Jake was so happy he started to _______ with joy!', answer: 'shake' },
      { sentence: 'He needed to _______ the recipe back from under the mat.', answer: 'take' },
    ],
    'lost-hat': [
      { sentence: 'Bella Bunny lost her favorite _______.', answer: 'hat' },
      { sentence: 'She was sitting on her _______ with her friend.', answer: 'mat' },
      { sentence: 'A _______ flew by and took it away!', answer: 'bat' },
      { sentence: 'Matt the _______ ran after the bat.', answer: 'cat' },
      { sentence: 'The hat was found on a _______ rock.', answer: 'flat' },
      { sentence: 'Bella _______ down and was very happy.', answer: 'sat' },
    ],
    'garden-mystery': [
      { sentence: 'Someone liked to _______ in the garden dirt.', answer: 'dig' },
      { sentence: 'The hole was very _______.', answer: 'big' },
      { sentence: 'A little _______ was dancing nearby.', answer: 'pig' },
      { sentence: 'She was looking for a _______ to eat.', answer: 'fig' },
      { sentence: 'Piggy did a happy _______ when she found it!', answer: 'jig' },
      { sentence: 'The detective found a clue near a _______.', answer: 'twig' },
    ],
    'sleepy-town': [
      { sentence: 'The whole town fell into a deep _______.', answer: 'sleep' },
      { sentence: 'Even the _______ were counting themselves!', answer: 'sheep' },
      { sentence: 'Misty heard a little _______ from a bird.', answer: 'peep' },
      { sentence: 'A loud _______ woke everyone up!', answer: 'beep' },
      { sentence: 'The sleep was very _______.', answer: 'deep' },
      { sentence: 'Sheepy promised to _______ the counting to herself.', answer: 'keep' },
    ],
  };
  const result = templates[mystery.id] || mystery.words.slice(0, 4).map(w => ({
    sentence: `Write the word "${mystery.wordFamily}" family word: _______.`, answer: w,
  }));
  return result.map(item => ({ ...item, blank: '_______' }));
}

function generateWordMatching(mystery: Mystery) {
  const t: Record<string, { word: string; clue: string }[]> = {
    'missing-cake': [
      { word: 'bake', clue: 'To cook in an oven' }, { word: 'cake', clue: 'A sweet treat for a party' },
      { word: 'lake', clue: 'A body of water' }, { word: 'make', clue: 'To create something' },
      { word: 'take', clue: 'To grab or carry' }, { word: 'wake', clue: 'To stop sleeping' },
      { word: 'shake', clue: 'To move back and forth quickly' }, { word: 'rake', clue: 'A garden tool for leaves' },
    ],
    'lost-hat': [
      { word: 'hat', clue: 'Something you wear on your head' }, { word: 'cat', clue: 'A furry pet that purrs' },
      { word: 'bat', clue: 'A flying animal' }, { word: 'mat', clue: 'Something you sit on' },
      { word: 'sat', clue: 'Past tense of sit' }, { word: 'flat', clue: 'Smooth and level' },
      { word: 'chat', clue: 'To talk with friends' }, { word: 'pat', clue: 'To gently touch' },
    ],
    'garden-mystery': [
      { word: 'dig', clue: 'To make a hole' }, { word: 'big', clue: 'The opposite of small' },
      { word: 'pig', clue: 'A farm animal that oinks' }, { word: 'fig', clue: 'A sweet fruit' },
      { word: 'jig', clue: 'A happy dance' }, { word: 'wig', clue: 'Fake hair' }, { word: 'twig', clue: 'A small stick' },
    ],
    'sleepy-town': [
      { word: 'sleep', clue: 'What you do at night' }, { word: 'deep', clue: 'Very far down' },
      { word: 'keep', clue: 'To hold onto something' }, { word: 'peep', clue: 'A tiny sound' },
      { word: 'sheep', clue: 'A fluffy farm animal' }, { word: 'beep', clue: 'A sound an alarm makes' },
      { word: 'creep', clue: 'To move quietly' }, { word: 'steep', clue: 'A very tall hill' },
    ],
  };
  return t[mystery.id] || mystery.words.slice(0, 6).map(word => ({ word, clue: `A word in the ${mystery.wordFamily} family` }));
}

function generateComprehensionQuestions(mystery: Mystery) {
  const q: Record<string, { question: string; options: string[]; correctIndex: number }[]> = {
    'missing-cake': [
      { question: 'What was Jake the Snake trying to bake?', options: ['A cake for the town party', 'Cookies for his friends', 'Bread for the bakery', 'A pie for himself'], correctIndex: 0 },
      { question: 'Where did Jake put the recipe that morning?', options: ['On the table', 'By the lake', 'In the oven', 'Under his bed'], correctIndex: 1 },
      { question: 'Who saw the recipe fall?', options: ['Mabel the Mouse', 'Oliver the Owl', 'Pancake the Cat', 'Benny the Bear'], correctIndex: 2 },
      { question: 'Where was the recipe hiding?', options: ['In the basket', 'By the window', 'On the shelf', 'Under the doormat'], correctIndex: 3 },
      { question: 'How did Jake feel when the recipe was found?', options: ['Very happy', 'Still worried', 'Sleepy', 'Angry'], correctIndex: 0 },
      { question: 'What word family did you learn in this story?', options: ['-at', '-ig', '-ake', '-eep'], correctIndex: 2 },
    ],
    'lost-hat': [
      { question: 'Who was sitting on the mat?', options: ['Bella Bunny and Matt the Cat', 'Batty the Bat', 'The detective', 'Oliver Owl'], correctIndex: 0 },
      { question: "Who took Bella's hat?", options: ['Matt the Cat', 'The wind', 'Batty the Bat', 'A bird'], correctIndex: 2 },
      { question: 'Where was the hat found?', options: ['In a tree', 'On a flat rock', 'In the water', 'On the roof'], correctIndex: 1 },
      { question: 'What word family did you learn?', options: ['-at', '-ig', '-ake', '-eep'], correctIndex: 0 },
    ],
    'garden-mystery': [
      { question: 'Who found a big hole in the garden?', options: ['Bella Bunny', 'Oliver Owl', 'Mabel Mouse', 'Misty Cat'], correctIndex: 1 },
      { question: 'Who dug the big hole?', options: ['A dog', 'A rabbit', 'Piggy the Pig', 'A mole'], correctIndex: 2 },
      { question: 'What was Piggy looking for?', options: ['A carrot', 'A bone', 'A fig', 'A worm'], correctIndex: 2 },
      { question: 'What word family did you learn?', options: ['-at', '-ig', '-ake', '-eep'], correctIndex: 1 },
    ],
    'sleepy-town': [
      { question: 'What happened to the whole town?', options: ['It rained', 'There was a party', 'Everyone fell asleep', 'The lights went out'], correctIndex: 2 },
      { question: 'What sound did Misty hear?', options: ['A song', 'A bark', 'A peep', 'A whistle'], correctIndex: 2 },
      { question: 'What made the loud beep?', options: ['A car', 'A phone', 'A horn', 'An alarm clock'], correctIndex: 3 },
      { question: 'What word family did you learn?', options: ['-at', '-ig', '-ake', '-eep'], correctIndex: 3 },
    ],
  };
  return q[mystery.id] || [
    { question: `What word family is featured in "${mystery.title}"?`, options: ['-at', '-ig', mystery.wordFamily, '-un'], correctIndex: 2 },
    { question: 'Who is the detective?', options: [mystery.detective.name, 'Mabel Mouse', 'Bella Bunny', 'Oliver Owl'], correctIndex: 0 },
  ];
}


function generateSentenceCompletion(mystery: Mystery) {
  const t: Record<string, { sentenceStart: string; options: string[]; correctIndex: number }[]> = {
    'missing-cake': [
      { sentenceStart: 'Jake wanted to bake a...', options: ['cake', 'hat', 'pig'], correctIndex: 0 },
      { sentenceStart: 'The recipe was by the...', options: ['tree', 'lake', 'hill'], correctIndex: 1 },
      { sentenceStart: 'Pancake saw it fall by...', options: ['accident', 'mistake', 'magic'], correctIndex: 1 },
      { sentenceStart: 'Jake needed to take the recipe and...', options: ['sleep', 'make the cake', 'run away'], correctIndex: 1 },
    ],
    'lost-hat': [
      { sentenceStart: 'Bella sat on her...', options: ['mat', 'bed', 'chair'], correctIndex: 0 },
      { sentenceStart: 'The bat took her...', options: ['shoe', 'hat', 'book'], correctIndex: 1 },
      { sentenceStart: 'The hat was on a flat...', options: ['table', 'rock', 'leaf'], correctIndex: 1 },
    ],
    'garden-mystery': [
      { sentenceStart: 'Piggy liked to dig for a...', options: ['bone', 'fig', 'toy'], correctIndex: 1 },
      { sentenceStart: 'The hole was very...', options: ['small', 'big', 'round'], correctIndex: 1 },
      { sentenceStart: 'Piggy did a happy...', options: ['jig', 'nap', 'song'], correctIndex: 0 },
    ],
    'sleepy-town': [
      { sentenceStart: 'The town was in a deep...', options: ['sleep', 'hole', 'forest'], correctIndex: 0 },
      { sentenceStart: 'The alarm made a loud...', options: ['bark', 'beep', 'splash'], correctIndex: 1 },
      { sentenceStart: 'Misty heard a tiny...', options: ['roar', 'peep', 'bang'], correctIndex: 1 },
    ],
  };
  return t[mystery.id] || mystery.words.slice(0, 3).map(word => ({
    sentenceStart: `Complete with a ${mystery.wordFamily} word:`, options: [word, 'apple', 'book'], correctIndex: 0,
  }));
}

function generateFlashcardSentence(word: string, mystery: Mystery): string {
  const allText = mystery.story.map(p => p.text).join(' ');
  const scenes = mystery.scenes || [];
  const allDialogue = scenes.flatMap(s => s.dialogue.map(d => d.text)).join(' ');
  const combined = allText + ' ' + allDialogue;
  const sentences = combined.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const match = sentences.find(s => s.toLowerCase().includes(word.toLowerCase()));
  if (match) return `"${match.trim()}."`;
  const fb: Record<string, string> = {
    'cake': '"Jake wanted to bake a cake."', 'bake': '"Let\'s bake something yummy!"',
    'lake': '"We went to the lake today."', 'make': '"Can you make a picture?"',
    'take': '"Please take this to the table."', 'wake': '"Time to wake up!"',
    'shake': '"Shake the bottle before opening."', 'rake': '"Use the rake to gather leaves."',
    'hat': '"I love my new hat!"', 'cat': '"The cat sat on the mat."',
    'bat': '"A bat flew through the night."', 'mat': '"Wipe your feet on the mat."',
    'sat': '"She sat down to read."', 'flat': '"The road was flat and smooth."',
    'dig': '"Let\'s dig in the sandbox."', 'big': '"What a big surprise!"',
    'pig': '"The pig rolled in the mud."', 'fig': '"Have you ever tasted a fig?"',
    'jig': '"She danced a happy jig."', 'twig': '"A bird sat on the twig."',
    'sleep': '"It\'s time to go to sleep."', 'deep': '"The pool is very deep."',
    'keep': '"Please keep this safe."', 'peep': '"I heard a tiny peep."',
    'sheep': '"Count the sheep in the field."', 'beep': '"The alarm went beep!"',
  };
  return fb[word] || `"Use the word ${word} in a sentence."`;
}

const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Nunito',sans-serif;color:#1f2937;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{margin:0.6in;size:letter}
.page{page-break-after:always;padding:0.25in 0}.page:last-child{page-break-after:auto}
.header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #8b5cf6}
.header h1{font-size:22px;font-weight:800;color:#6d28d9;margin-bottom:4px}
.header h2{font-size:16px;font-weight:600;color:#7c3aed;margin-bottom:4px}
.header p{font-size:13px;color:#6b7280}
.header .badge,.header .word-family-badge{display:inline-block;background:#ede9fe;color:#6d28d9;padding:4px 16px;border-radius:20px;font-weight:700;font-size:14px;margin-top:8px}
.section-title{font-size:17px;font-weight:700;color:#1f2937;margin:20px 0 12px;padding-left:12px;border-left:4px solid #8b5cf6}
.instructions{font-size:13px;color:#6b7280;font-style:italic;margin-bottom:14px}
.fill-blank{margin-bottom:14px;padding:10px 14px;background:#faf5ff;border-radius:10px;border:1px solid #e9d5ff}
.fill-blank .number{font-weight:700;color:#7c3aed;margin-right:8px}.fill-blank .sentence{font-size:15px;line-height:1.8}
.match-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.match-word{padding:8px 14px;background:#ede9fe;border-radius:10px;font-weight:700;font-size:15px;color:#6d28d9;text-align:center;margin-bottom:10px}
.match-clue{padding:8px 14px;background:#f0fdf4;border-radius:10px;border:2px dashed #86efac;font-size:13px;color:#166534;display:flex;align-items:center;margin-bottom:10px}
.match-clue .line-space{width:30px;border-bottom:2px solid #9ca3af;margin-right:8px;flex-shrink:0}
.sentence-item{margin-bottom:12px;padding:10px 14px;background:#f0f9ff;border-radius:10px;border:1px solid #bae6fd}
.sentence-item .prompt{font-size:14px;font-weight:600;color:#0369a1;margin-bottom:6px}
.sentence-item .options{display:flex;gap:10px}
.sentence-item .option{padding:4px 14px;border:2px solid #7dd3fc;border-radius:20px;font-size:13px;font-weight:600;color:#0c4a6e}
.flashcard-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.flashcard{border:2px dashed #d1d5db;border-radius:14px;padding:18px;text-align:center;min-height:140px;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative}
.flashcard .cut-label{position:absolute;top:-10px;right:10px;background:white;padding:0 6px;font-size:10px;color:#9ca3af}
.flashcard .word{font-size:28px;font-weight:800;color:#6d28d9;margin-bottom:8px}
.flashcard .family-highlight{color:#dc2626}
.flashcard .definition{font-size:13px;color:#4b5563;line-height:1.4}
.flashcard .use-in-sentence{font-size:12px;color:#6b7280;font-style:italic;margin-top:8px;border-top:1px solid #e5e7eb;padding-top:8px;width:100%}
.question-item{margin-bottom:16px;padding:12px 14px;background:#fff7ed;border-radius:10px;border:1px solid #fed7aa}
.question-item .q-number{font-weight:800;color:#c2410c;font-size:14px}
.question-item .q-text{font-size:14px;font-weight:600;color:#1f2937;margin:4px 0 8px}
.question-item .q-options{display:flex;flex-direction:column;gap:4px}
.question-item .q-option{display:flex;align-items:center;gap:8px;font-size:13px;color:#374151}
.question-item .q-option .circle{width:16px;height:16px;border:2px solid #d1d5db;border-radius:50%;flex-shrink:0}
.word-bank{display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:#faf5ff;border-radius:12px;border:2px solid #e9d5ff;margin-bottom:16px}
.word-bank-label{font-size:12px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;width:100%}
.word-bank .wb-word{padding:4px 12px;background:white;border:2px solid #c4b5fd;border-radius:8px;font-weight:700;font-size:14px;color:#6d28d9}
.name-date{display:flex;justify-content:space-between;margin-bottom:20px;padding:10px 0}
.name-date .field{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7280}
.name-date .field .line{width:160px;border-bottom:2px solid #d1d5db}
.answer-key{margin-top:30px;padding:14px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb}
.answer-key h3{font-size:13px;font-weight:700;color:#6b7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
.answer-key p{font-size:11px;color:#9ca3af;line-height:1.6}
.scissors-line{display:flex;align-items:center;gap:4px;color:#9ca3af;font-size:11px;margin:20px 0 10px}
.scissors-line .dashed{flex:1;border-top:2px dashed #d1d5db}
.footer{text-align:center;margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af}
.sa-box{margin-bottom:16px;padding:12px 14px;background:#fefce8;border-radius:10px;border:1px solid #fde68a}
.sa-box .sa-prompt{font-weight:600;color:#92400e;font-size:14px;margin-bottom:8px}
.write-line{border-bottom:1.5px solid #d1d5db;height:28px}
.act-box{margin-top:24px;padding:16px;background:#faf5ff;border-radius:12px;border:2px solid #e9d5ff}
.act-box strong{color:#6d28d9}.act-box .act-title{font-weight:700;color:#6d28d9;margin-bottom:8px;font-size:14px}
.recap-box{padding:14px;background:#f0f9ff;border-radius:12px;border:1px solid #bae6fd;margin-bottom:20px}
.recap-box .recap-title{font-weight:700;color:#0369a1;margin-bottom:6px;font-size:14px}
.recap-box .recap-text{font-size:13px;color:#374151;line-height:1.6}
`;

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ mystery, onClose }) => {
  const [activeTab, setActiveTab] = useState<WorksheetTab>('word-family');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const fillInBlanks = generateFillInBlanks(mystery);
  const wordMatching = generateWordMatching(mystery);
  const comprehensionQuestions = generateComprehensionQuestions(mystery);
  const sentenceCompletion = generateSentenceCompletion(mystery);
  const shuffledClues = [...wordMatching].sort(() => Math.random() - 0.5);

  const buildAllPagesHtml = () => {
    const sfx = mystery.wordFamily.replace('-', '');
    const hl = (w: string) => {
      if (w.endsWith(sfx)) return w.slice(0, w.length - sfx.length) + '<span class="family-highlight">' + sfx + '</span>';
      return w;
    };
    const hdr = (t: string) => '<div class="header"><h1>' + t + '</h1><h2>' + mystery.title + '</h2><p>Detective: ' + mystery.detective.name + '</p><span class="badge">' + mystery.wordFamily + ' Word Family</span></div>';
    const nd = (sc?: boolean) => '<div class="name-date"><div class="field">Name: <span class="line"></span></div><div class="field">Date: <span class="line"></span></div>' + (sc ? '<div class="field">Score: <span class="line"></span></div>' : '') + '</div>';
    const ft = (s: string) => '<div class="footer">Word and Whisker Detective Agency &middot; ' + mystery.wordFamily + ' ' + s + ' &middot; ' + mystery.title + '</div>';

    const p1 = '<div class="page">' + hdr('Word Family Practice') + nd() +
      '<div class="word-bank"><span class="word-bank-label">Word Bank</span>' + mystery.words.map(w => '<span class="wb-word">' + w + '</span>').join('') + '</div>' +
      '<div class="section-title">Part 1: Fill in the Blank</div><p class="instructions">Use words from the word bank to complete each sentence.</p>' +
      fillInBlanks.slice(0, 6).map((it, i) => '<div class="fill-blank"><span class="number">' + (i+1) + '.</span><span class="sentence">' + it.sentence + '</span></div>').join('') +
      '<div class="section-title">Part 2: Word Matching</div><p class="instructions">Draw a line from each word to its meaning.</p><div class="match-grid"><div>' +
      wordMatching.slice(0, 6).map(it => '<div class="match-word">' + it.word + '</div>').join('') + '</div><div>' +
      shuffledClues.slice(0, 6).map(it => '<div class="match-clue"><span class="line-space"></span>' + it.clue + '</div>').join('') + '</div></div>' +
      '<div class="section-title">Part 3: Sentence Completion</div><p class="instructions">Circle the correct word.</p>' +
      sentenceCompletion.map((it, i) => '<div class="sentence-item"><div class="prompt">' + (i+1) + '. ' + it.sentenceStart + '</div><div class="options">' + it.options.map((o, oi) => '<span class="option">' + String.fromCharCode(65+oi) + ') ' + o + '</span>').join('') + '</div></div>').join('') +
      '<div class="answer-key"><h3>Answer Key (For Parents/Teachers)</h3><p><strong>Fill in the Blank:</strong> ' + fillInBlanks.slice(0,6).map((it,i) => (i+1) + '. ' + it.answer).join(', ') + '</p><p><strong>Sentence Completion:</strong> ' + sentenceCompletion.map((it,i) => (i+1) + '. ' + String.fromCharCode(65+it.correctIndex) + ') ' + it.options[it.correctIndex]).join(', ') + '</p></div>' + ft('Word Family Practice') + '</div>';

    const p2 = '<div class="page">' + hdr('Vocabulary Flashcards') +
      '<div class="scissors-line"><span>Cut here</span><span class="dashed"></span></div><div class="flashcard-grid">' +
      wordMatching.slice(0, 8).map((it, i) => '<div class="flashcard"><span class="cut-label">Card ' + (i+1) + '</span><div class="word">' + hl(it.word) + '</div><div class="definition">' + it.clue + '</div><div class="use-in-sentence">' + generateFlashcardSentence(it.word, mystery) + '</div></div>').join('') +
      '</div><div class="act-box"><div class="act-title">Flashcard Activities:</div><div style="font-size:13px;color:#4b5563;line-height:1.8">1. <strong>Memory Match:</strong> Make two copies and play!<br/>2. <strong>Speed Read:</strong> Time yourself!<br/>3. <strong>Sentence Maker:</strong> Make up sentences.<br/>4. <strong>Word Sort:</strong> Sort by length.<br/>5. <strong>Story Time:</strong> Pick 3 cards, make a story!</div></div>' + ft('Vocabulary Flashcards') + '</div>';

    const p3 = '<div class="page">' + hdr('Reading Comprehension') + nd(true) +
      '<div class="recap-box"><div class="recap-title">Story Recap:</div><div class="recap-text">' + mystery.description + '</div></div>' +
      '<div class="section-title">Part 1: Multiple Choice</div><p class="instructions">Circle the best answer.</p>' +
      comprehensionQuestions.map((q, i) => '<div class="question-item"><span class="q-number">Question ' + (i+1) + '</span><div class="q-text">' + q.question + '</div><div class="q-options">' + q.options.map((o, oi) => '<div class="q-option"><span class="circle"></span>' + String.fromCharCode(65+oi) + ') ' + o + '</div>').join('') + '</div></div>').join('') +
      '<div class="section-title">Part 2: Short Answer</div><p class="instructions">Write your answer on the lines below.</p>' +
      '<div class="sa-box"><div class="sa-prompt">1. What was your favorite part of the story? Why?</div><div class="write-line"></div><div class="write-line"></div><div class="write-line"></div></div>' +
      '<div class="sa-box"><div class="sa-prompt">2. Write a sentence using two ' + mystery.wordFamily + ' words.</div><div class="write-line"></div><div class="write-line"></div></div>' +
      '<div class="sa-box"><div class="sa-prompt">3. Think of two more words that end in ' + mystery.wordFamily + ':</div><div class="write-line"></div></div>' +
      '<div class="answer-key"><h3>Answer Key (For Parents/Teachers)</h3><p><strong>Multiple Choice:</strong> ' + comprehensionQuestions.map((q, i) => (i+1) + '. ' + String.fromCharCode(65+q.correctIndex)).join(', ') + '</p><p><strong>Short Answer:</strong> Answers will vary.</p></div>' + ft('Reading Comprehension') + '</div>';

    return p1 + p2 + p3;
  };

  const openPrintWindow = (html: string, title: string) => {
    const w = window.open('', '_blank');
    if (!w) { setPdfError('Pop-up blocked. Please allow pop-ups.'); return; }
    w.document.write('<!DOCTYPE html><html><head><title>' + title + '</title><style>' + PRINT_CSS + '</style></head><body>' + html + '</body></html>');
    w.document.close();
    setTimeout(() => w.print(), 600);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setPdfError(null);
    try {
      openPrintWindow(buildAllPagesHtml(), mystery.title + ' - All Worksheets (Save as PDF)');
    } catch { setPdfError('Failed to generate. Please try again.'); }
    setIsGeneratingPdf(false);
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    openPrintWindow(printRef.current.innerHTML, mystery.title + ' - Worksheet');
  };

  const tabs: { id: WorksheetTab; label: string; icon: string }[] = [
    { id: 'word-family', label: 'Word Family Practice', icon: 'Aa' },
    { id: 'flashcards', label: 'Vocabulary Flashcards', icon: 'Fc' },
    { id: 'comprehension', label: 'Comprehension Questions', icon: '?' },
  ];

  const familySuffix = mystery.wordFamily.replace('-', '');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <PrinterIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Printable Worksheets</h2>
                <p className="text-white/80 text-sm">{mystery.title} &middot; {mystery.wordFamily} word family</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
              <XIcon className="text-white" size={20} />
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${activeTab === tab.id ? 'bg-white text-violet-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div ref={printRef}>
            {activeTab === 'word-family' && (
              <div className="page">
                <div className="header"><h1>Word Family Practice</h1><h2>{mystery.title}</h2><p>Detective: {mystery.detective.name}</p><span className="word-family-badge">{mystery.wordFamily} Word Family</span></div>
                <div className="name-date"><div className="field">Name: <span className="line"></span></div><div className="field">Date: <span className="line"></span></div></div>
                <div className="word-bank"><span className="word-bank-label">Word Bank</span>{mystery.words.map(w => <span key={w} className="wb-word">{w}</span>)}</div>
                <div className="section-title">Part 1: Fill in the Blank</div>
                <p className="instructions">Use words from the word bank to complete each sentence.</p>
                {fillInBlanks.slice(0, 6).map((item, idx) => <div key={idx} className="fill-blank"><span className="number">{idx + 1}.</span><span className="sentence">{item.sentence}</span></div>)}
                <div className="section-title">Part 2: Word Matching</div>
                <p className="instructions">Draw a line from each word to its meaning.</p>
                <div className="match-grid"><div>{wordMatching.slice(0, 6).map((item, idx) => <div key={idx} className="match-word" style={{ marginBottom: '10px' }}>{item.word}</div>)}</div><div>{shuffledClues.slice(0, 6).map((item, idx) => <div key={idx} className="match-clue" style={{ marginBottom: '10px' }}><span className="line-space"></span>{item.clue}</div>)}</div></div>
                <div className="section-title">Part 3: Sentence Completion</div>
                <p className="instructions">Circle the correct word to complete each sentence.</p>
                {sentenceCompletion.map((item, idx) => <div key={idx} className="sentence-item"><div className="prompt">{idx + 1}. {item.sentenceStart}</div><div className="options">{item.options.map((opt, oi) => <span key={oi} className="option">{String.fromCharCode(65 + oi)}) {opt}</span>)}</div></div>)}
                <div className="answer-key"><h3>Answer Key (For Parents/Teachers)</h3><p><strong>Fill in the Blank:</strong> {fillInBlanks.slice(0, 6).map((item, idx) => `${idx + 1}. ${item.answer}`).join(', ')}</p><p><strong>Sentence Completion:</strong> {sentenceCompletion.map((item, idx) => `${idx + 1}. ${String.fromCharCode(65 + item.correctIndex)}) ${item.options[item.correctIndex]}`).join(', ')}</p></div>
                <div className="footer">Word and Whisker Detective Agency &middot; {mystery.wordFamily} Word Family Practice &middot; {mystery.title}</div>
              </div>
            )}
            {activeTab === 'flashcards' && (
              <div className="page">
                <div className="header"><h1>Vocabulary Flashcards</h1><h2>{mystery.title}</h2><p>Cut along the dashed lines to make flashcards!</p><span className="word-family-badge">{mystery.wordFamily} Word Family</span></div>
                <div className="scissors-line"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg><span>Cut here</span><span className="dashed"></span></div>
                <div className="flashcard-grid">
                  {wordMatching.slice(0, 8).map((item, idx) => {
                    const prefix = item.word.endsWith(familySuffix) ? item.word.slice(0, item.word.length - familySuffix.length) : item.word;
                    const hasFamily = item.word.endsWith(familySuffix);
                    return (<div key={idx} className="flashcard"><span className="cut-label">Card {idx + 1}</span><div className="word">{hasFamily ? <>{prefix}<span className="family-highlight">{familySuffix}</span></> : item.word}</div><div className="definition">{item.clue}</div><div className="use-in-sentence">{generateFlashcardSentence(item.word, mystery)}</div></div>);
                  })}
                </div>
                <div style={{ marginTop: '24px', padding: '16px', background: '#faf5ff', borderRadius: '12px', border: '2px solid #e9d5ff' }}>
                  <div style={{ fontWeight: 700, color: '#6d28d9', marginBottom: '8px', fontSize: '14px' }}>Flashcard Activities:</div>
                  <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.8' }}>1. <strong>Memory Match:</strong> Make two copies and play!<br/>2. <strong>Speed Read:</strong> Time yourself!<br/>3. <strong>Sentence Maker:</strong> Pick a card and make a sentence.<br/>4. <strong>Word Sort:</strong> Sort by number of letters.<br/>5. <strong>Story Time:</strong> Pick 3 cards and make a story!</div>
                </div>
                <div className="footer">Word and Whisker Detective Agency &middot; {mystery.wordFamily} Vocabulary Flashcards &middot; {mystery.title}</div>
              </div>
            )}
            {activeTab === 'comprehension' && (
              <div className="page">
                <div className="header"><h1>Reading Comprehension</h1><h2>{mystery.title}</h2><p>Answer the questions about the story you read.</p><span className="word-family-badge">{mystery.wordFamily} Word Family</span></div>
                <div className="name-date"><div className="field">Name: <span className="line"></span></div><div className="field">Date: <span className="line"></span></div><div className="field">Score: <span className="line"></span></div></div>
                <div style={{ padding: '14px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', marginBottom: '20px' }}><div style={{ fontWeight: 700, color: '#0369a1', marginBottom: '6px', fontSize: '14px' }}>Story Recap:</div><div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>{mystery.description}</div></div>
                <div className="section-title">Part 1: Multiple Choice</div><p className="instructions">Circle the best answer for each question.</p>
                {comprehensionQuestions.map((q, idx) => <div key={idx} className="question-item"><span className="q-number">Question {idx + 1}</span><div className="q-text">{q.question}</div><div className="q-options">{q.options.map((opt, oi) => <div key={oi} className="q-option"><span className="circle"></span>{String.fromCharCode(65 + oi)}) {opt}</div>)}</div></div>)}
                <div className="section-title">Part 2: Short Answer</div><p className="instructions">Write your answer on the lines below.</p>
                <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#fefce8', borderRadius: '10px', border: '1px solid #fde68a' }}><div style={{ fontWeight: 600, color: '#92400e', fontSize: '14px', marginBottom: '8px' }}>1. What was your favorite part of the story? Why?</div><div style={{ borderBottom: '1.5px solid #d1d5db', height: '28px' }}></div><div style={{ borderBottom: '1.5px solid #d1d5db', height: '28px' }}></div><div style={{ borderBottom: '1.5px solid #d1d5db', height: '28px' }}></div></div>
                <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#fefce8', borderRadius: '10px', border: '1px solid #fde68a' }}><div style={{ fontWeight: 600, color: '#92400e', fontSize: '14px', marginBottom: '8px' }}>2. Write a sentence using two {mystery.wordFamily} words from the story.</div><div style={{ borderBottom: '1.5px solid #d1d5db', height: '28px' }}></div><div style={{ borderBottom: '1.5px solid #d1d5db', height: '28px' }}></div></div>
                <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#fefce8', borderRadius: '10px', border: '1px solid #fde68a' }}><div style={{ fontWeight: 600, color: '#92400e', fontSize: '14px', marginBottom: '8px' }}>3. Can you think of two more words that end in {mystery.wordFamily}? Write them here:</div><div style={{ borderBottom: '1.5px solid #d1d5db', height: '28px' }}></div></div>
                <div className="answer-key"><h3>Answer Key (For Parents/Teachers)</h3><p><strong>Multiple Choice:</strong> {comprehensionQuestions.map((q, idx) => `${idx + 1}. ${String.fromCharCode(65 + q.correctIndex)}`).join(', ')}</p><p><strong>Short Answer:</strong> Answers will vary. Look for complete sentences and correct use of {mystery.wordFamily} words.</p></div>
                <div className="footer">Word and Whisker Detective Agency &middot; Reading Comprehension &middot; {mystery.title}</div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white">
          {pdfError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
              <span>{pdfError}</span>
              <button onClick={() => setPdfError(null)} className="ml-auto text-red-500 hover:text-red-700"><XIcon size={14} /></button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookIcon size={16} className="text-purple-500" />
              <span>{mystery.wordFamily} word family</span>
              <span className="text-gray-300">|</span>
              <span>{mystery.words.length} words</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDownloadPdf} disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-60">
                <DownloadIcon size={18} />
                <span className="hidden sm:inline">Download as PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
                <PrinterIcon size={18} />
                <span className="hidden sm:inline">Print This Worksheet</span>
                <span className="sm:hidden">Print</span>
              </button>
              <button onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Close</button>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span><strong>Download as PDF</strong> opens all three worksheet types in a single print-ready document. Select "Save as PDF" in the print dialog to save the file. <strong>Print</strong> sends the currently visible worksheet to your printer.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
