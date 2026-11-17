import Icon, { IconName } from './Icon';

export type TabId = 'news' | 'events' | 'ratings' | 'community' | 'shop' | 'support';

export const TAB_LABELS: Record<TabId, string> = {
  news: 'Новости',
  events: 'События',
  ratings: 'Рейтинги',
  community: 'Сообщество',
  shop: 'Магазин',
  support: 'Поддержка',
};

const ITEMS: { id: TabId; icon: IconName }[] = [
  { id: 'news', icon: 'news' },
  { id: 'events', icon: 'events' },
  { id: 'ratings', icon: 'ratings' },
  { id: 'community', icon: 'community' },
  { id: 'shop', icon: 'shop' },
  { id: 'support', icon: 'support' },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  onSettings: () => void;
}

export default function Sidebar({ active, onChange, onSettings }: Props) {
  return (
    <aside className="t9-sidebar">
      <button className="t9-gear" title="Настройки" onClick={onSettings}>
        <Icon name="gear" />
      </button>

      <nav className="t9-nav">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={`t9-nav-btn ${active === item.id ? 'is-active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <Icon name={item.icon} className="t9-nav-icon" />
            <span>{TAB_LABELS[item.id]}</span>
            {active === item.id && <span className="t9-nav-gem" />}
          </button>
        ))}
      </nav>

      <button className="t9-promo">
        <span className="t9-promo-icon">
          <Icon name="gift" className="t9-icon" />
        </span>
        <span className="t9-promo-title">
          Подарок
          <br />
          для героя!
        </span>
      </button>
    </aside>
  );
}
