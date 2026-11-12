import { useState } from 'react';

function LikeButton({ title, emoji }) {
  const [likes, setLikes] = useState(0);
  return (
    <div className="like-box">
      <h3>{emoji} {title}</h3>
      <p>Лайков: {likes}</p>
      <button onClick={() => setLikes(likes + 1)}> Лайк</button>
      <button onClick={() => setLikes(0)} className="reset">Сброс</button>
    </div>
  );
}

export default function Likes() {
  return (
    <div className="card">
      <h2>Счетчик лайков</h2>
      <LikeButton title="Котики" />
      <LikeButton title="Собачки" />
    </div>
  );
}