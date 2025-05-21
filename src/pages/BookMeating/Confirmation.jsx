// Confirmation.jsx
export default function Confirmation({ appointmentDetails, onReset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
        <div className="text-left text-sm text-gray-700 mb-6">
          <p><strong>Date:</strong> {new Date(appointmentDetails.date).toDateString()}</p>
          <p><strong>Time:</strong> {appointmentDetails.time}</p>
          <p><strong>Name:</strong> {appointmentDetails.name}</p>
          <p><strong>Email:</strong> {appointmentDetails.email}</p>
          <p><strong>Phone:</strong> {appointmentDetails.phone}</p>
          <p><strong>Job:</strong> {appointmentDetails.job}</p>
        </div>
        <button
          onClick={onReset}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Book Another
        </button>
      </div>
    </div>
  );
}
