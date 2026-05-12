export default function Toast({ message, type = 'success' }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.25s_ease]">
      <div className={`toast-base ${type === 'error' ? 'toast-error' : 'toast-success'}`}>
        {message}
      </div>
    </div>
  )
}
