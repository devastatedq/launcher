import Icon from './Icon';

interface Slide {
  kicker: string;
  title: string;
  items: string[];
  tag: string;
}

const SLIDES: Slide[] = [
  {
    kicker: 'Обновление 1',
    title: '«Мороз и Вьюга»',
    items: [
      'Новый регион — Северные Чертоги',
      'Событие «Зимняя Вьюга»',
      'Новый рейд: Ледяная Обитель',
      'Новый босс — Снежная Княжна',
    ],
    tag: 'Погрузитесь в зимнюю сказку Тримиры!',
  },
  {
    kicker: 'Событие',
    title: '«Зимняя Вьюга»',
    items: [
      'Собирайте снежные кристаллы по всему миру',
      'Открывайте праздничные награды',
      'Сражайтесь за место в рейтинге события',
    ],
    tag: 'Вьюга уже накрывает Северные Чертоги.',
  },
  {
    kicker: 'Рейд',
    title: '«Ледяная Обитель»',
    items: [
      'Командное подземелье на 5 игроков',
      'Три фазы и уникальные механики',
      'Эпическая экипировка и редкие материалы',
    ],
    tag: 'Соберите отряд и бросьте вызов стуже.',
  },
];

interface Props {
  slide: number;
  onChange: (index: number) => void;
}

export default function NewsCarousel({ slide, onChange }: Props) {
  const index = Math.max(0, Math.min(slide, SLIDES.length - 1));
  const current = SLIDES[index];

  const prev = () => onChange((index - 1 + SLIDES.length) % SLIDES.length);
  const next = () => onChange((index + 1) % SLIDES.length);

  return (
    <div className="t9-news-card">
      <div className="t9-news-art-slot">IMAGE SLOT</div>

      <div className="t9-news-inner">
        <div className="t9-kicker">{current.kicker}</div>
        <div className="t9-news-title">{current.title}</div>

        <div className="t9-news-list">
          {current.items.map((item) => (
            <div className="t9-news-item" key={item}>
              <Icon name="sparkle" className="t9-bullet" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="t9-news-tag">{current.tag}</div>
      </div>

      <button className="t9-arrow t9-arrow--left" onClick={prev} aria-label="Предыдущий слайд">
        <Icon name="left" className="t9-icon" />
      </button>
      <button className="t9-arrow t9-arrow--right" onClick={next} aria-label="Следующий слайд">
        <Icon name="right" className="t9-icon" />
      </button>

      <div className="t9-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`t9-dot ${i === index ? 'is-active' : ''}`}
            onClick={() => onChange(i)}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
