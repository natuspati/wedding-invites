interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div
      style={{
        background: "#ffe5e5",
        color: "#b00020",
        padding: "10px",
        borderRadius: "6px",
        marginTop: "10px",
      }}
    >
      {message}
    </div>
  );
}
