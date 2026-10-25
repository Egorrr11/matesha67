// Trophies (id036): many small achievements, like the ones in mobile games.
// Each series is one measure with rising steps; every step is a trophy.
// Days and streaks get dense steps; volume series get wide ones so long
// sessions are not pushed too hard (docs/SPEC.md 14.7). Nothing is
// random, conditions are always shown (except a few secrets), and a trophy,
// once earned, is kept.
import { SKILLS, LANES } from './skills.js';
import { isUnlocked, isMastered, starsOf } from './session.js';

export const CATS = ['Регулярность', 'Активность', 'Навыки', 'Прогресс', 'Дополнительный раунд', 'Серии ответов', 'Точность', 'Очки', 'Работа над ошибками', 'Классы', 'Коллекция', 'Секреты'];

const fmt = (n) => n.toLocaleString('ru-RU');
const DOPA_LABEL = { 2: '100', 3: '1 000', 4: '10 тыс.', 5: '100 тыс.', 6: '1 млн', 7: '10 млн', 8: '100 млн', 9: '1 млрд' };
const RANKS = ['bronze', 'silver', 'gold', 'rainbow'];
export const RANK_NAME = { bronze: 'Бронза', silver: 'Серебро', gold: 'Золото', rainbow: 'Радуга', secret: 'Секреты' };

// Rank by position in its series: first ~30% bronze, then silver, gold, and the last step rainbow.
function rankAt(i, n) {
  if (n === 1) return 'gold';
  if (i === n - 1) return 'rainbow';
  return RANKS[Math.min(2, Math.floor((i / (n - 1)) * 3.3))];
}

// A series: { key, cat, title, metric, steps, name(v), desc(v) } or explicit items.
const SERIES_DEFS = [
  { key: 'streak', cat: 'Регулярность', title: 'Игровые серии', metric: 'bestStreak', steps: [3, 5, 7, 10, 14, 21, 30, 50, 75, 100, 150, 200, 365], name: (v) => `Серия: ${v} дней`, desc: (v) => `Играть ${v} дней подряд` },
  { key: 'days', cat: 'Регулярность', title: 'Дни в игре', metric: 'days', steps: [1, 3, 5, 7, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300, 365, 500, 730, 1000], name: (v) => `Дней в игре: ${fmt(v)}`, desc: (v) => `Играть в разные дни — всего ${fmt(v)} дней` },
  { key: 'stickers', cat: 'Регулярность', title: 'Ежедневные отметки', metric: 'stickers', steps: [1, 7, 14, 30, 50, 100, 200, 365], name: (v) => `Отметок: ${v}`, desc: (v) => `Получить ${v} ежедневных отметок` },
  { key: 'crowns', cat: 'Регулярность', title: 'Недельные награды', metric: 'crowns', steps: [1, 3, 5, 10, 20, 52], name: (v) => `Недельных наград: ${v}`, desc: (v) => `Получить ${v} наград за семь дней подряд` },
  { key: 'problems', cat: 'Активность', title: 'Решённые задачи', metric: 'problems', steps: [10, 30, 50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 20000, 30000, 50000, 100000], name: (v) => `Решено задач: ${fmt(v)}`, desc: (v) => `Решить всего ${fmt(v)} задач` },
  { key: 'cells', cat: 'Активность', title: 'Введённые цифры', metric: 'cells', steps: [100, 500, 1000, 3000, 5000, 10000, 30000, 50000, 100000, 300000], name: (v) => `Цифр введено: ${fmt(v)}`, desc: (v) => `Правильно ввести ${fmt(v)} цифр` },
  { key: 'plays', cat: 'Активность', title: 'Количество раундов', metric: 'plays', steps: [1, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000], name: (v) => `Раундов сыграно: ${fmt(v)}`, desc: (v) => `Завершить ${fmt(v)} раундов` },
  { key: 'minutes', cat: 'Активность', title: 'Время в игре', metric: 'minutes', steps: [10, 30, 60, 120, 300, 600, 1200, 3000], name: (v) => (v >= 60 ? `Всего ${v / 60} ч` : `Всего ${v} мин`), desc: (v) => `Провести в игре ${v >= 60 ? `${v / 60} ч` : `${v} мин`}` },
  { key: 'unlocked', cat: 'Навыки', title: 'Открытые навыки', metric: 'unlocked', steps: [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 58], name: (v) => `Открыть навыков: ${v}`, desc: (v) => `Открыть ${v} навыков` },
  { key: 'mastered', cat: 'Навыки', title: 'Освоенные навыки', metric: 'mastered', steps: [1, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 58], name: (v) => `Освоить навыков: ${v}`, desc: (v) => `Освоить ${v} навыков` },
  { key: 'gradeDone', cat: 'Навыки', title: 'Освоить все темы класса', items: [1, 2, 3, 4, 5, 6].map((g) => ({ id: `gradeDone-${g}`, metric: `gradeDone${g}`, need: 1, name: `Освоить все навыки ${g}-го класса`, desc: `Освоить все навыки ${g}-го класса` })) },
  { key: 'laneDone', cat: 'Навыки', title: 'Освоить все темы направления', items: LANES.map((l, i) => ({ id: `laneDone-${i}`, metric: `laneDone${i}`, need: 1, name: `Освоить раздел «${l}»`, desc: `Освоить все навыки раздела «${l}»` })) },
  { key: 'extras', cat: 'Дополнительный раунд', title: 'Дополнительные раунды', metric: 'extras', steps: [1, 3, 5, 10, 20, 30, 50, 100, 200, 300], name: (v) => `Дополнительных раундов: ${v}`, desc: (v) => `Открыть дополнительный раунд ${v} раз` },
  { key: 'extraBest', cat: 'Дополнительный раунд', title: 'Рекорд дополнительного раунда', metric: 'extraBest', steps: [3, 5, 7, 10, 12, 15, 18, 20, 23, 25, 30], name: (v) => `${v} задач за раунд`, desc: (v) => `Решить ${v} задач за один дополнительный раунд` },
  { key: 'extraSolved', cat: 'Дополнительный раунд', title: 'Задачи в дополнительном раунде', metric: 'extraSolved', steps: [10, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000], name: (v) => `Доп. раунд: ${fmt(v)} задач`, desc: (v) => `Решить ${fmt(v)} задач в дополнительных раундах` },
  { key: 'combo', cat: 'Серии ответов', title: 'Серии ответов', metric: 'maxCombo', steps: [5, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300], name: (v) => `Серия из ${v} ответов`, desc: (v) => `Дать ${v} правильных ответов подряд` },
  { key: 'perfects', cat: 'Точность', title: 'Раунды без ошибок', metric: 'perfects', steps: [1, 3, 5, 10, 20, 30, 50, 100, 200, 300], name: (v) => `Раундов без ошибок: ${v}`, desc: (v) => `Завершить ${v} раундов со 100% точностью с первой попытки` },
  { key: 'firstTry', cat: 'Точность', title: 'Верные ответы с первой попытки', metric: 'firstTry', steps: [10, 50, 100, 300, 500, 1000, 3000, 5000, 10000, 30000], name: (v) => `Верно с первой попытки: ${fmt(v)}`, desc: (v) => `Решить ${fmt(v)} задач верно с первой попытки` },
  { key: 'dopa', cat: 'Очки', title: 'Очки', metric: 'bestDopaL', steps: [2, 3, 4, 5, 6, 7, 8, 9], name: (v) => `Очки: ${DOPA_LABEL[v]}`, desc: (v) => `Набрать за раунд ${DOPA_LABEL[v]} очков` },
  { key: 'review', cat: 'Работа над ошибками', title: 'Работа над ошибками', metric: 'reviewSolved', steps: [1, 5, 10, 30, 50, 100, 200, 300], name: (v) => `Повторено задач: ${v}`, desc: (v) => `Повторно решить ${v} задач с ошибками` },
  ...[1, 2, 3, 4, 5, 6].map((g) => ({ key: `grade${g}`, cat: 'Классы', title: `Задания ${g}-го класса`, metric: `gradePlays${g}`, steps: [1, 10, 30], name: (v) => `Раундов в ${g}-м классе: ${v}`, desc: (v) => `Сыграть ${v} раз в режиме ${g}-го класса` })),
  { key: 'secret', cat: 'Секреты', title: 'Секреты', items: [
    { id: 'secret-perfect14', metric: 'flag:perfect14', need: 1, name: 'Идеальные 14 задач', desc: 'Решить 14 задач без ошибок', secret: true },
    { id: 'secret-extraClean', metric: 'flag:extraClean', need: 1, name: 'Дополнительный раунд без ошибок', desc: 'Решить не менее 5 задач дополнительного раунда без ошибок', secret: true },
    { id: 'secret-sunday', metric: 'flag:sunday', need: 1, name: 'Математика в воскресенье', desc: 'Сыграть хотя бы один раунд в воскресенье', secret: true },
    { id: 'secret-newyear', metric: 'flag:newyear', need: 1, name: 'Новогодняя тренировка', desc: 'Сыграть хотя бы один раунд 1 января', secret: true },
    { id: 'secret-comeback', metric: 'flag:comeback', need: 1, name: 'С возвращением!', desc: 'Вернуться в игру после перерыва не менее недели', secret: true },
    { id: 'secret-allmodes', metric: 'allModes', need: 1, name: 'Все режимы игры', desc: 'Сыграть в персональном режиме, по классу, в тренировке и в работе над ошибками', secret: true },
  ] },
];

// Other features add their own series (id045). Keep this list append-only.
export const SERIES = [];
export const TROPHIES = [];
export const TROPHY = {};
export function addSeries(def) {
  const items = def.items
    ? def.items.map((it, i, a) => ({ rank: it.secret ? 'secret' : rankAt(i, a.length), ...it }))
    : def.steps.map((v, i, a) => ({ id: `${def.key}-${v}`, metric: def.metric, need: v, name: def.name(v), desc: def.desc(v), rank: rankAt(i, a.length) }));
  const series = { key: def.key, cat: def.cat, title: def.title, items: items.map((it) => ({ ...it, series: def.key, cat: def.cat, reward: it.reward || null })) };
  SERIES.push(series);
  for (const it of series.items) { TROPHIES.push(it); TROPHY[it.id] = it; }
  return series;
}
SERIES_DEFS.forEach(addSeries);

// id045: the features added after id036 (stars, quests, hammer, rust,
// time capsule, progress improvements, and collection.
[
  { key: 'questDays', cat: 'Регулярность', title: 'Все задания выполнены', metric: 'questDays', steps: [1, 3, 7, 14, 30, 50, 100, 200, 365], name: (v) => `Дней с выполненными заданиями: ${v}`, desc: (v) => `Полностью выполнять ежедневные задания ${v} дней` },
  { key: 'questRun', cat: 'Регулярность', title: 'Серия выполненных заданий', metric: 'questRun', steps: [2, 3, 5, 7, 14, 30], name: (v) => `Дни выполнения подряд: ${v}`, desc: (v) => `Выполнять все ежедневные задания ${v} дней подряд` },
  { key: 'hammer', cat: 'Регулярность', title: 'Молоток серии', metric: 'hammerUsed', steps: [1, 3, 10], name: (v) => (v === 1 ? 'Первое сохранение серии' : `Сохранить серию: ${v} раз`), desc: (v) => `Использовать молоток серии ${v} раз` },
  { key: 'starsTotal', cat: 'Навыки', title: 'Количество звёзд', metric: 'starsTotal', steps: [5, 10, 25, 50, 75, 100, 150, 200, 250, 290], name: (v) => `Звёзд: ${v}`, desc: (v) => `Набрать ${v} звёзд навыков` },
  { key: 'star5', cat: 'Навыки', title: 'Навыки с пятью звёздами', metric: 'star5', steps: [1, 3, 5, 10, 20, 30, 58], name: (v) => `Навыков с ☆5: ${v}`, desc: (v) => `Получить пять звёзд у ${v} навыков` },
  { key: 'gradeStar3', cat: 'Навыки', title: 'Все навыки класса на уровне ☆3', items: [1, 2, 3, 4, 5, 6].map((g) => ({ id: `gradeStar3-${g}`, metric: `gradeStar3${g}`, need: 1, name: `Все навыки ${g}-го класса — ☆3`, desc: `Получить не менее ☆3 у всех навыков ${g}-го класса` })) },
  { key: 'polished', cat: 'Прогресс', title: 'Повторить забытый навык', metric: 'polished', steps: [1, 3, 5, 10, 30, 50], name: (v) => `Повторено забытых навыков: ${v}`, desc: (v) => `Повторить ранее освоенный навык ${v} раз` },
  { key: 'capsules', cat: 'Прогресс', title: 'Капсула времени', metric: 'capsules', steps: [1, 3, 5, 10, 30], name: (v) => `Капсул времени открыто: ${v}`, desc: (v) => `Открыть ${v} капсул времени` },
  { key: 'capsuleFaster', cat: 'Прогресс', title: 'Быстрее, чем раньше', metric: 'capsuleFaster', steps: [1, 5, 10], name: (v) => `Побить прошлое время: ${v} раз`, desc: (v) => `Решить быстрее прошлого результата ${v} раз` },
  { key: 'grew', cat: 'Прогресс', title: 'Стало лучше!', metric: 'grew', steps: [1, 5, 10, 30, 50, 100], name: (v) => `Улучшений: ${v}`, desc: (v) => `Получить сообщение об улучшении ${v} раз` },
  { key: 'items', cat: 'Коллекция', title: 'Коллекция', metric: 'itemsOwned', steps: [10, 20, 30, 40, 47], name: (v) => `Элементов коллекции: ${v}`, desc: (v) => `Открыть ${v} элементов коллекции` },
  { key: 'catComplete', cat: 'Коллекция', title: 'Полная коллекция', metric: 'catComplete', steps: [1, 3, 5, 8], name: (v) => `Полных наборов: ${v}`, desc: (v) => `Полностью собрать ${v} категорий коллекции` },
].forEach(addSeries);

// Numbers every trophy is measured against, from the saved state.
// snap: { stats, prog, bestStreak, stickers, crowns, ...extra metrics }
export function trophyMetrics(snap) {
  const s = snap.stats || {};
  const prog = snap.prog || { skills: {} };
  const m = {
    bestStreak: snap.bestStreak || 0, days: s.days || 0, stickers: snap.stickers || 0, crowns: snap.crowns || 0,
    problems: s.problems || 0, cells: s.cells || 0, plays: s.plays || 0, minutes: Math.floor((s.playMs || 0) / 60000),
    unlocked: SKILLS.filter((x) => isUnlocked(prog, x.id)).length, mastered: SKILLS.filter((x) => isMastered(prog, x.id)).length,
    extras: s.extras || 0, extraBest: s.extraBest || 0, extraSolved: s.extraSolved || 0, maxCombo: s.maxCombo || 0,
    perfects: s.perfects || 0, firstTry: s.firstTry || 0, bestDopaL: Math.floor((s.bestDopaL || 0) + 1e-9), reviewSolved: s.reviewSolved || 0,
  };
  const stars = Object.fromEntries(SKILLS.map((x) => [x.id, starsOf(prog, x.id)]));
  m.starsTotal = Object.values(stars).reduce((a, b) => a + b, 0);
  m.star5 = Object.values(stars).filter((n) => n >= 5).length;
  m.polished = s.polished || 0; m.capsules = s.capsules || 0; m.capsuleFaster = s.capsuleFaster || 0; m.grew = s.grew || 0;
  for (let g = 1; g <= 6; g++) {
    m[`gradeStar3${g}`] = SKILLS.filter((x) => x.grade === g).every((x) => stars[x.id] >= 3) ? 1 : 0;
    m[`gradeDone${g}`] = SKILLS.filter((x) => x.grade === g).every((x) => isMastered(prog, x.id)) ? 1 : 0;
    m[`gradePlays${g}`] = (s.grades || {})[g] || 0;
  }
  LANES.forEach((_, i) => { m[`laneDone${i}`] = SKILLS.filter((x) => x.lane === i).every((x) => isMastered(prog, x.id)) ? 1 : 0; });
  for (const [k, v] of Object.entries(s.flags || {})) if (v) m[`flag:${k}`] = 1;
  const modes = s.modes || {};
  m.allModes = ['level', 'grade', 'practice', 'review'].every((k) => modes[k]) ? 1 : 0;
  Object.assign(m, snap.extra || {});
  return m;
}
export const valueOf = (m, metric) => m[metric] || 0;

// Earn every trophy whose condition is met. Returns the new ones (in list order).
// `state` is the saved { got: { id: time } }; the first call earns what the
// existing records already reach and marks them as a batch.
export function evaluate(state, metrics, at = Date.now()) {
  state.got = state.got || {};
  const fresh = [];
  for (const t of TROPHIES) {
    if (state.got[t.id]) continue;
    if (valueOf(metrics, t.metric) >= t.need) { state.got[t.id] = at; fresh.push(t); }
  }
  if (!state.init) { state.init = true; state.batch = fresh.map((t) => t.id); return []; }
  return fresh;
}

export const earnedCount = (state) => TROPHIES.filter((t) => state.got && state.got[t.id]).length;

// Progress of one series for the list screen.
export function seriesView(series, state, metrics) {
  const got = series.items.filter((t) => state.got && state.got[t.id]);
  const next = series.items.find((t) => !(state.got && state.got[t.id]));
  const top = got[got.length - 1] || null;
  return { series, got, next, top, value: next ? valueOf(metrics, next.metric) : null };
}
