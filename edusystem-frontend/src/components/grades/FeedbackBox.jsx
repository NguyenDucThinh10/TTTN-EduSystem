export default function FeedbackBox({ feedback }) {
  return <p className="feedback-box">{feedback || 'Chua co nhan xet.'}</p>;
}
