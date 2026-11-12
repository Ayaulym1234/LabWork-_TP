export default function RoomCard({ room, isBooked, onToggle }) {
  return (
    <div className={`room-card ${isBooked ? 'booked' : ''}`}>
      <div className="room-info">
        <h3>{room.name}</h3>
        <p>Мест: {room.capacity}</p>
        <p>{room.projector ? 'Проектор есть' : 'Без проектора'}</p>
      </div>
      
      <button 
        onClick={() => onToggle(room.id)} 
        className={isBooked ? 'btn-cancel' : 'btn-book'}
      >
        {isBooked ? 'Отменить' : 'Забронировать'}
      </button>
    </div>
  );
}