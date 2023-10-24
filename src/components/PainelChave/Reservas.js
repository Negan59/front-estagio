import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import { FaChevronLeft, FaChevronRight, FaRegCalendarAlt } from 'react-icons/fa';
import { Modal, Button } from 'antd';
import ReservaModal from './ReservaModal'; // Importe o componente de modal de agendamento
import './CalendarioInterativo.css'; // Importe o seu arquivo de estilos

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

const events = [
  {
    start: new Date(2023, 9, 20, 10, 0),
    end: new Date(2023, 9, 20, 12, 0),
    title: 'Reunião',
  },
  {
    start: new Date(2023, 9, 22, 14, 0),
    end: new Date(2023, 9, 22, 16, 0),
    title: 'Evento importante',
  },
  // Adicione mais eventos conforme necessário
];

const CalendarioInterativo = () => {
  const myEventsList = (e) => {
    return (
      <div>
        <p>{e.title}</p>
      </div>
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setModalVisible(true);
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
        <Modal
          title="Agendamento"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <ReservaModal
            selectedDate={selectedDate}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>
      </div>
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

export default CalendarioInterativo;
