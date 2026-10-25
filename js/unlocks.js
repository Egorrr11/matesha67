// Unlockable show (id041): backgrounds, correct marks, particles, music,
// Dopakichi's costume and colour, the crowd and the finale. Each item is the
// reward of one trophy (never random), so what is unlocked follows from the
// trophies earned; only the player's choice per category is saved.
import { TROPHY } from './trophies.js';

export const CATS = [
  { key: 'bg', name: 'Фоны' },
  { key: 'mark', name: 'Отметки верного ответа' },
  { key: 'particle', name: 'Конфетти' },
  { key: 'music', name: 'Музыка' },
  { key: 'costume', name: 'Образы' },
  { key: 'color', name: 'Цвет талисмана' },
  { key: 'crowd', name: 'Персонажи' },
  { key: 'finale', name: 'Финалы' },
];

// base: available from the start. trophy: the trophy whose reward it is.
export const ITEMS = [];
export const ITEM = {};
export function addItems(list) {
  for (const it of list) {
    ITEMS.push(it); ITEM[it.id] = it;
    if (it.trophy && TROPHY[it.trophy]) TROPHY[it.trophy].reward = it.id;
  }
}
addItems([
  { id: 'bg:classic', cat: 'bg', name: 'Лучистый фон', base: true },
  { id: 'mark:hanamaru', cat: 'mark', name: 'Похвальная отметка', base: true },
  { id: 'particle:classic', cat: 'particle', name: 'Конфетти', base: true },
  { id: 'music:classic', cat: 'music', name: 'Марш маримбы', base: true },
  { id: 'costume:none', cat: 'costume', name: 'Нет', base: true },
  { id: 'color:pink', cat: 'color', name: 'Розовый', base: true },
  { id: 'crowd:classic', cat: 'crowd', name: 'Вариант цвета', base: true },
  { id: 'finale:classic', cat: 'finale', name: 'Большой талисман', base: true },
]);
// id041: one sample per category, to prove the pipeline end to end.
// Rewards follow effort and coming back (plays, days, streaks, stars earned by
// practice), not the placement check, which can master many skills at once.
addItems([
  { id: 'costume:cap', cat: 'costume', name: 'Шапка', trophy: 'days-1' },
  { id: 'particle:note', cat: 'particle', name: 'Нота', trophy: 'days-3' },
  { id: 'mark:stamp', cat: 'mark', name: 'Штамп верного ответа', trophy: 'plays-3' },
  { id: 'bg:night', cat: 'bg', name: 'Ночное небо', trophy: 'streak-3' },
  { id: 'color:blue', cat: 'color', name: 'Синий', trophy: 'plays-5' },
  { id: 'finale:fireworks', cat: 'finale', name: 'Фейерверк', trophy: 'extras-5' },
  { id: 'music:chip', cat: 'music', name: '8-битный стиль', trophy: 'plays-10' },
  { id: 'crowd:costume', cat: 'crowd', name: 'Персонаж в образе', trophy: 'firstTry-50' },
]);
// id042: backgrounds, correct marks and particles.
addItems([
  { id: 'bg:sea', cat: 'bg', name: 'Море и пузырьки', trophy: 'problems-100' },
  { id: 'bg:festival', cat: 'bg', name: 'Праздник', trophy: 'days-15' },
  { id: 'bg:paper', cat: 'bg', name: 'Бумажная поделка', trophy: 'problems-200' },
  { id: 'bg:space', cat: 'bg', name: 'Космос', trophy: 'extras-10' },
  { id: 'mark:medal', cat: 'mark', name: 'Медаль', trophy: 'streak-7' },
  { id: 'mark:crown', cat: 'mark', name: 'Корона', trophy: 'perfects-3' },
  { id: 'mark:ring', cat: 'mark', name: 'Кольцо фейерверка', trophy: 'combo-30' },
  { id: 'particle:petal', cat: 'particle', name: 'Лепестки', trophy: 'stickers-7' },
  { id: 'particle:digit', cat: 'particle', name: 'Цифры', trophy: 'cells-1000' },
  { id: 'particle:bubble', cat: 'particle', name: 'Пузырьки', trophy: 'review-10' },
  { id: 'particle:candy', cat: 'particle', name: 'Сладости', trophy: 'extraBest-10' },
]);
// id043: music tracks (8-bit is the id041 sample).
addItems([
  { id: 'music:matsuri', cat: 'music', name: 'Праздничная музыка', trophy: 'streak-5' },
  { id: 'music:brass', cat: 'music', name: 'Духовой оркестр', trophy: 'days-5' },
  { id: 'music:electro', cat: 'music', name: 'Электронная музыка', trophy: 'extras-3' },
]);
// id044: costumes, colours, crowd and finales (id045 moved three rewards to the new series).
addItems([
  { id: 'costume:hachimaki', cat: 'costume', name: 'Повязка', trophy: 'problems-50' },
  { id: 'costume:cape', cat: 'costume', name: 'Плащ', trophy: 'combo-20' },
  { id: 'costume:glasses', cat: 'costume', name: 'Круглые очки', trophy: 'firstTry-100' },
  { id: 'costume:ribbon', cat: 'costume', name: 'Лента', trophy: 'stickers-14' },
  { id: 'costume:crown', cat: 'costume', name: 'Корона', trophy: 'streak-14' },
  { id: 'costume:wizard', cat: 'costume', name: 'Волшебная шляпа', trophy: 'star5-1' },
  { id: 'costume:headphones', cat: 'costume', name: 'Наушники', trophy: 'capsules-1' },
  { id: 'color:mint', cat: 'color', name: 'Зелёный', trophy: 'days-7' },
  { id: 'color:snow', cat: 'color', name: 'Снежный', trophy: 'questDays-7' },
  { id: 'color:yellow', cat: 'color', name: 'Жёлтый', trophy: 'problems-300' },
  { id: 'color:violet', cat: 'color', name: 'Фиолетовый', trophy: 'extraSolved-100' },
  { id: 'color:gold', cat: 'color', name: 'Золотой', trophy: 'streak-30' },
  { id: 'color:rainbow', cat: 'color', name: 'Радужный', trophy: 'days-100' },
  { id: 'crowd:rainbow', cat: 'crowd', name: 'Радужный персонаж', trophy: 'days-30' },
  { id: 'crowd:twins', cat: 'crowd', name: 'Парный персонаж', trophy: 'starsTotal-100' },
  { id: 'finale:parade', cat: 'finale', name: 'Парад', trophy: 'streak-10' },
  { id: 'finale:rocket', cat: 'finale', name: 'Ракета', trophy: 'extras-20' },
]);

export const isUnlocked = (it, got = {}) => !!(it && (it.base || (it.trophy && got[it.trophy])));
export const unlockedIn = (cat, got) => ITEMS.filter((it) => it.cat === cat && isUnlocked(it, got));
export const defaultEquip = () => Object.fromEntries(CATS.map((c) => [c.key, 'auto']));

// The look for one play: fixed choices stay; "auto" picks among the unlocked
// ones so every play can look and sound a little different.
export function pickLook(equip = {}, got = {}, rng = Math.random) {
  const look = {};
  for (const { key } of CATS) {
    const want = equip[key];
    const own = unlockedIn(key, got);
    if (want && want !== 'auto' && own.some((it) => it.id === want)) look[key] = want;
    else look[key] = own[Math.floor(rng() * own.length)].id;
  }
  return look;
}
// The part after "cat:" (what the show modules switch on).
export const variant = (id) => (id ? id.split(':')[1] : 'classic');
