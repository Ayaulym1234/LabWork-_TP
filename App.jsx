import { useState } from 'react';
import './index.css';

// Импортируем все наши созданные компоненты
import Likes from './Likes';
import TodoList from './TodoList';
import RoomCard from './RoomCard';

// Данные для аудиторий (вынесем сюда)
const ROOMS_DATA = [
  { id: 1, name: 'Аудитория 101', capacity: 30, projector: true },
  { id: 2, name: 'Аудитория 202', capacity: 15, projector: false },
  { id: 3, name: 'Лаборатория 305', capacity: 25, projector: true },
];

export default function App() {
  // Состояние для бронирования аудиторий (живет здесь, в родителе)
  const [bookedRooms, setBookedRooms] = useState([]);

  const toggleBooking = (id) => {
    if (bookedRooms.includes(id)) {
      setBookedRooms(bookedRooms.filter(roomId => roomId !== id));
    } else {
      setBookedRooms([...bookedRooms, id]);
    }
  };

  return (
    <div className="app-container">
      <h1>Мои лабораторные работы</h1>
      
      {/* 1. Лайки */}
      <Likes />

      {/* 2. Список задач */}
      <TodoList />

      {/* 3. Бронирование аудиторий */}
      <div className="card">
        <h2>Бронирование аудиторий</h2>
        <div className="status-bar">
          Забронировано: <strong>{bookedRooms.length}</strong> из {ROOMS_DATA.length}
        </div>
        <div className="rooms-grid">
          {ROOMS_DATA.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              isBooked={bookedRooms.includes(room.id)} 
              onToggle={toggleBooking} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}