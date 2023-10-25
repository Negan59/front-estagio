import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import { FaChevronLeft, FaChevronRight, FaRegCalendarAlt } from 'react-icons/fa';
import { Modal } from 'antd';
import ReservaModal from './ReservaModal';
import './CalendarioInterativo.css';

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

const CalendarioInterativo = () => {
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/reserva');
        const data = await response.json();
        setReservas(data);
        console.log(data);
      } catch (error) {
        console.error('Erro ao buscar as reservas:', error);
      }
    };

    fetchReservas();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setModalVisible(true);
  };

  const events = reservas.map((reserva) => ({
    start: moment(reserva.data, 'YYYY-MM-DD').toDate(),
    end: moment(reserva.data, 'YYYY-MM-DD').add(1, 'days').toDate(),
    title: 'Reserva',
  }));

  const myEventsList = (e) => {
    return (
      <div>
        <p>{e.title}</p>
      </div>
    );
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToDay = () => {
      toolbar.onView('day');
    };

    const goToWeek = () => {
      toolbar.onView('week');
    };

    const goToMonth = () => {
      toolbar.onView('month');
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span>
          {date.format('MMMM')} {date.format('YYYY')}
        </span>
      );
    };

    return (
      <div className="rbc-toolbar">
        <div className="rbc-btn-group">
          <button type="button" onClick={goToBack}>
            <FaChevronLeft />
          </button>
          <button type="button" onClick={goToCurrent}>
            Hoje
          </button>
          <button type="button" onClick={goToDay}>
            Dia
          </button>
          <button type="button" onClick={goToWeek}>
            Semana
          </button>
          <button type="button" onClick={goToMonth}>
            <FaRegCalendarAlt />
          </button>
          <button type="button" onClick={goToNext}>
            <FaChevronRight />
          </button>
        </div>
        <div className="rbc-toolbar-label">{label()}</div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Reservas de Salas</h2>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          formats={{
            dateFormat: 'DD',
            dayFormat: (date, culture, localizer) =>
              localizer.format(date, 'dddd', culture),
            timeGutterFormat: (date, culture, localizer) =>
              localizer.format(date, 'HH:mm', culture),
            monthHeaderFormat: (date, culture, localizer) =>
              localizer.format(date, 'MMMM yyyy', culture),
            dayHeaderFormat: (date, culture, localizer) =>
              localizer.format(date, 'dddd, MMMM DD', culture),
            dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
              localizer.format(start, 'MMMM DD', culture) +
              ' - ' +
              localizer.format(end, 'MMMM DD', culture),
          }}
          style={{ height: 500, margin: '20px' }}
          views={['day', 'work_week', 'week', 'month']}
          defaultView="week"
          components={{
            event: myEventsList,
            toolbar: CustomToolbar,
          }}
          selectable
          onSelectSlot={handleSelectSlot}
        />
        
          <ReservaModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            selectedDate={selectedDate}
          />
      </div>
    </div>
  );
};

export default CalendarioInterativo;
