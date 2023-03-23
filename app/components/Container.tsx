interface Props {
  children: React.ReactNode;
}

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8">{children}</div>
  );
};

export default Container;
