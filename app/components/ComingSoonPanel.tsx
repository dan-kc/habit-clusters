interface Props {
  heading: string;
}

const ComingSoonPanel: React.FC<Props> = ({ heading }) => {
  return (
    <div
      data-cy="coming_soon_panel"
      className="rounded-md border border-violetDark-6 bg-violetDark-3 py-10 text-violetDark-11 opacity-20"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{heading}</h2>
        <p className="text-lg opacity-90">(Coming soon)</p>
      </div>
    </div>
  );
};

export default ComingSoonPanel;
