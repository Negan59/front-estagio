import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/home.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap

const Home = () => {
  const handleDateChange = (date) => {
    console.log('Data selecionada:', date);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bem-vindo à Página Inicial</h1>
      <div className="d-flex justify-content-center">
        <div className="calendar-container">
          <Calendar onChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
};

export default Home;
