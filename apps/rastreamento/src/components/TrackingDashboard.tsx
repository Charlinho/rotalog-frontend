import React from 'react';
import PropTypes from 'prop-types';

// Class component com lógica de negócio e apresentação misturadas
class TrackingDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      refreshInterval: null,
      lastUpdate: null
    };
  }

  componentDidMount() {
    // TODO: Implementar proper polling com Redux
    const interval = setInterval(() => {
      this.refreshData();
    }, 5000);
    this.setState({ refreshInterval: interval });
  }

  componentWillUnmount() {
    if (this.state.refreshInterval) {
      clearInterval(this.state.refreshInterval);
    }
  }

  refreshData = () => {
    // TODO: Chamar API corretamente
    const delivery = this.props.delivery;
    if (delivery) {
      fetch(`http://localhost:3000/api/entregas/${delivery.id}`)
        .then(res => res.json())
        .then(data => {
          this.setState({ lastUpdate: new Date() });
          // TODO: Atualizar Redux store
        })
        .catch(err => console.error(err));
    }
  };

  // TODO: Componente muito grande, deveria ser dividido
  render() {
    const { delivery } = this.props;
    const { expanded } = this.state;

    if (!delivery) {
      return <div className="dashboard-empty">Selecione uma entrega para ver detalhes</div>;
    }

    return (
      <div className="tracking-dashboard">
        <div className="dashboard-header">
          <h2>Detalhes da Entrega #{delivery.id}</h2>
          <button onClick={() => this.setState({ expanded: !expanded })}>
            {expanded ? 'Minimizar' : 'Expandir'}
          </button>
        </div>

        {expanded && (
          <div className="dashboard-content">
            <div className="info-grid">
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge status-${delivery.status}`}>
                  {delivery.status}
                </span>
              </div>

              <div className="info-item">
                <label>Motorista:</label>
                <span>{delivery.driver_name}</span>
              </div>

              <div className="info-item">
                <label>Veículo:</label>
                <span>{delivery.vehicle_plate}</span>
              </div>

              <div className="info-item">
                <label>Origem:</label>
                <span>{delivery.origin_address}</span>
              </div>

              <div className="info-item">
                <label>Destino:</label>
                <span>{delivery.destination_address}</span>
              </div>

              <div className="info-item">
                <label>Distância:</label>
                <span>{delivery.distance_km} km</span>
              </div>

              <div className="info-item">
                <label>Tempo Estimado:</label>
                <span>{delivery.estimated_time_minutes} min</span>
              </div>

              <div className="info-item">
                <label>Progresso:</label>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${delivery.progress_percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="timeline">
              <h3>Histórico</h3>
              {delivery.events && delivery.events.map((event, idx) => (
                <div key={idx} className="timeline-item">
                  <span className="timeline-time">{event.timestamp}</span>
                  <span className="timeline-event">{event.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

TrackingDashboard.propTypes = {
  delivery: PropTypes.object
};

export default TrackingDashboard;
