import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { Modal, Popover, Button, Alert } from 'antd';
import ReservaModal from './ReservaModal';
import './CalendarioInterativo.css';

moment.locale('pt-br');

const localizer = momentLocalizer(moment);

const CalendarioInterativo = () => {
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const fetchReservas = async () => {
    try {
      const response = await fetch('https://estagio-guilherme.azurewebsites.net/api/reserva');
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

  const groupEventsByDate = (events) => {
    const eventMap = new Map();
    events.forEach((reserva) => {
      const date = moment(reserva.data, 'YYYY-MM-DD').format('YYYY-MM-DD');
      if (eventMap.has(date)) {
        eventMap.get(date).push(reserva);
      } else {
        eventMap.set(date, [reserva]);
      }
    });
    const groupedEvents = [];
    eventMap.forEach((value, key) => {
      groupedEvents.push({
        start: moment(key, 'YYYY-MM-DD').toDate(),
        end: moment(key, 'YYYY-MM-DD').add(1, 'days').toDate(),
        title: `Reserva - ${value[0].paroquiano.nome}`,
        data: value[0].data,
        horainicio: value[0].horainicio,
        horafim: value[0].horafim,
        pastoral: value[0].pastoral,
        paroquiano: value[0].paroquiano,
        sala: value[0].sala,
      });
    });
    return groupedEvents;
  };

  const processedEvents = groupEventsByDate(reservas);

  const handleDeleteReserva = async (id) => {
    try {
      const response = await fetch(`https://estagio-guilherme.azurewebsites.net/api/reserva/${id}`, {
        method: 'DELETE',
      });
  
      if (response.status === 200) {
        console.log('Reserva excluída com sucesso.');
        setAlertVisible(true);
        // Atualize as reservas após a exclusão
        fetchReservas();
      } else {
        console.error('Falha ao excluir reserva.');
      }
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
    }
  };

  const myEventsList = (e) => {
    e = e.event;
    return (
      <div>
        <Popover
          content={
            <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '10px' }}>
              {reservas
                .filter((reserva) => moment(reserva.data).isSame(e.data, 'day'))
                .map((reserva, index) => (
                  <div key={index}>
                    <p>
                      <strong>Data:</strong> {moment(reserva.data).format('DD/MM/YYYY')}
                    </p>
                    <p>
                      <strong>Hora de início:</strong> {reserva.horainicio}
                    </p>
                    <p>
                      <strong>Hora de fim:</strong> {reserva.horafim}
                    </p>
                    <p>
                      <strong>Pastoral:</strong>{' '}
                      {reserva.pastoral ? reserva.pastoral.nomepastoral : ''}
                    </p>
                    <p>
                      <strong>Paroquiano:</strong> {reserva.paroquiano ? reserva.paroquiano.nome : ''}
                    </p>
                    <p>
                      <strong>Sala:</strong> {reserva.sala ? reserva.sala.descricaosala : ''}
                    </p>
                    <Button type="primary" danger onClick={() => handleDeleteReserva(reserva.id)}>
                      Excluir
                    </Button>
                    {index !== reservas.length - 1 && <hr />}
                  </div>
                ))}
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
  const showModal = () => {
    setModalVisible(true);
  };

  return (
    <div className="calendar-container">
      
      <h2 className="calendar-title">Reservas de Salas</h2>
      <Button type="primary" icon={<CalendarOutlined />} onClick={showModal}>
          Adicionar Reserva
        </Button>
        {alertVisible && (
        <Alert
          message="Reserva excluída com sucesso."
          type="success"
          closable
          onClose={() => setAlertVisible(false)}
          style={{ marginTop: '10px' }}
        />
      )}
        <ReservaModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            fetchReservas();
          }}
          selectedDate={selectedDate}
          fetchReservas={fetchReservas}
        />
      <div className="calendar-wrapper" style={{ height: 700, margin: '20px', overflow: 'auto' }}>
        {reservas && (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <Calendar
              localizer={localizer}
              events={processedEvents}
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
              views={['day', 'work_week', 'week', 'month']}
              defaultView="week"
              components={{
                event: myEventsList,
                toolbar: CustomToolbar,
              }}
              selectable
              onSelectSlot={handleSelectSlot}
              dayPropGetter={dayPropGetter}
            />
          </div>
        )}

       
      </div>
      
    </div>
    
  );
};

export default CalendarioInterativo;
