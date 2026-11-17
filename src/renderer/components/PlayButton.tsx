interface Props {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function PlayButton({ onClick, disabled, loading }: Props) {
  return (
    <button className="t9-play" onClick={onClick} disabled={disabled}>
      {loading ? 'Загрузка...' : 'Играть'}
    </button>
  );
}
