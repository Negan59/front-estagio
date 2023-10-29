import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { Modal, Popover, Button } from 'antd';
import ReservaModal from './ReservaModal';
import './CalendarioInterativo.css';

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

const CalendarioInterativo = () => {
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
  useEffect(() => {
    fetchReservas();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setModalVisible(true);
  };

  const events = reservas.map((reserva) => ({
    start: moment(reserva.data, 'YYYY-MM-DD').toDate(),
    end: moment(reserva.data, 'YYYY-MM-DD').add(1, 'days').toDate(),
    title: `Reserva - ${reserva.paroquiano.nome}`,
    reserva,
  }));
  const myEventsList = (e) => {
    e = e.event;
    return (
      <div>
        <Popover
          content={
            <div>
              <p><strong>Data:</strong> {moment(e.data).format('DD/MM/YYYY')}</p>
              <p><strong>Hora de início:</strong> {e.horainicio}</p>
              <p><strong>Hora de fim:</strong> {e.horafim}</p>
              <p><strong>Pastoral:</strong> {e.pastoral ? e.pastoral.nomepastoral : ''}</p>
              <p><strong>Paroquiano:</strong> {e.paroquiano ? e.paroquiano.nome : ''}</p>
              <p><strong>Sala:</strong> {e.sala ? e.sala.descricaosala : ''}</p>
            </div>
          }
          title={e.title}
          trigger="click"
        >
          <p>{e.title}</p>
        </Popover>
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
          <Button type="primary" shape="circle" icon={<LeftOutlined />} onClick={goToBack} />
          <Button type="primary" onClick={goToCurrent}>Hoje</Button>
          <Button type="primary" onClick={goToDay}>Dia</Button>
          <Button type="primary" onClick={goToWeek}>Semana</Button>
          <Button type="primary" icon={<CalendarOutlined />} onClick={goToMonth} />
          <Button type="primary" shape="circle" icon={<RightOutlined />} onClick={goToNext} />
        </div>
        <div className="rbc-toolbar-label">{label()}</div>
      </div>
    );
  };

  const dayPropGetter = (date) => {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    return isWeekend
      ? {
        className: 'highlight-weekend',
        style: {
          backgroundColor: 'lightblue',
        },
      }
      : {};
  };
  
  
  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Reservas de Salas</h2>
      <div className="calendar-wrapper">
        {reservas && (
          <Calendar
            localizer={localizer}
            events={reservas.map((reserva) => ({
              start: moment(reserva.data, 'YYYY-MM-DD').toDate(),
              end: moment(reserva.data, 'YYYY-MM-DD').add(1, 'days').toDate(),
              title: `Reserva`,
              data: reserva.data,
              horainicio: reserva.horainicio,
              horafim: reserva.horafim,
              pastoral: reserva.pastoral,
              paroquiano: reserva.paroquiano,
              sala: reserva.sala,
            }))}
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
            style={{ height: 700, margin: '20px' }}
            views={['day', 'work_week', 'week', 'month']}
            defaultView="week"
            components={{
              event: myEventsList,
              toolbar: CustomToolbar,
            }}
            selectable
            onSelectSlot={handleSelectSlot}
            dayPropGetter={dayPropGetter}// Adicionado para adicionar o estilo ao evento
          />
        )}
  
        <ReservaModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            fetchReservas(); // Atualizar as reservas ao fechar o modal
          }}
          selectedDate={selectedDate}
          fetchReservas={fetchReservas}
        />
      </div>
    </div>
  );
  
  
};

export default CalendarioInterativo;
