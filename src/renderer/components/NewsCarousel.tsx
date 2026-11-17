import Icon from './Icon';

interface Slide {
  kicker: string;
  title: string;
  items: string[];
  tag: string;
}

const SLIDES: Slide[] = [
  {
    kicker: 'Экономика',
    title: '«Торговый контур»',
    items: [
      'Доска объявлений с фильтрами и поиском',
      'Региональные схроны: 64–512 слотов',
      'Посылки между регионами и игроками',
      'Золото, сборы и комиссии',
    ],
    tag: 'Торгуй, храни и отправляй — экономика Тримиры уже работает!',
  },
  {
    kicker: 'Хранилище',
    title: '«Региональные схроны»',
    items: [
      'Личный схрон в каждом торговом регионе',
      'Расширение до 512 слотов',
      'Покупки приходят в посылки региона',
      'Пересылка между своими схронами',
    ],
    tag: 'Держи ресурсы там, где торгуешь.',
  },
  {
    kicker: 'Доставка',
    title: '«Посылки и золото»',
    items: [
      'Входящие и отправленные посылки',
      'До 3 стаков, хранение 7 дней',
      'Тарифы: 4 ч / 2 ч / 30 мин',
      'Золотую посылку можно переслать в другой регион',
    ],
    tag: 'Всё доедет — даже через всю Тримиру.',
  },
];

interface Props {
  slide: number;
  onChange: (index: number) => void;
  art?: (string | undefined)[];
}

export default function NewsCarousel({ slide, onChange, art }: Props) {
  const index = Math.max(0, Math.min(slide, SLIDES.length - 1));
  const current = SLIDES[index];
  const artUrl = art?.[index];

  const prev = () => onChange((index - 1 + SLIDES.length) % SLIDES.length);
  const next = () => onChange((index + 1) % SLIDES.length);

  return (
    <div className="t9-news-card">
      <div
        className="t9-news-art-slot"
        style={artUrl ? { backgroundImage: `url("${artUrl}")`, color: 'transparent' } : undefined}
      >
        {artUrl ? '' : 'IMAGE SLOT'}
      </div>

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
