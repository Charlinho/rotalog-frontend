import React from 'react';
import PropTypes from 'prop-types';
import TrackingDashboard from './components/TrackingDashboard';
import DeliveryList from './components/DeliveryList';
import MapView from './components/MapView';

// Class component 70% - dívida técnica intencional
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveries: [],
      selectedDelivery: null,
      loading: false,
      error: null,
      filters: {
        status: 'all',
        date: null,
        driver: null
      },
      mapCenter: { lat: -23.5505, lng: -46.6333 },
      zoom: 12,
      // TODO: Remover Redux sem Toolkit e implementar Redux Toolkit
      reduxState: null
    };
  }

  componentDidMount() {
    this.fetchDeliveries();
    // TODO: Implementar proper error handling
    // TODO: Adicionar loading states
  }

  fetchDeliveries = () => {
    this.setState({ loading: true });
    
    // TODO: Usar Redux actions em vez de fetch direto
    // TODO: Implementar proper API abstraction
    fetch('http://localhost:8080/api/entregas')
      .then(res => res.json())
      .then(data => {
        this.setState({ 
          deliveries: data,
          loading: false 
        });
      })
      .catch(err => {
        console.error('Erro ao buscar entregas:', err);
        this.setState({ 
          error: err.message,
          loading: false 
        });
      });
  };

  handleSelectDelivery = (delivery) => {
    this.setState({ 
      selectedDelivery: delivery,
      mapCenter: { 
        lat: delivery.destination_lat, 
        lng: delivery.destination_lng 
      }
    });
  };

  handleFilterChange = (filterKey, value) => {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [filterKey]: value
      }
    }));
  };

  // TODO: Componentes muito grandes (500+ linhas de template)
  // TODO: CSS global vazando entre componentes
  render() {
    const { deliveries, selectedDelivery, loading, error, mapCenter, zoom } = this.state;

    if (loading) {
      return <div className="loading-container">Carregando entregas...</div>;
    }

    if (error) {
      return <div className="error-container">Erro: {error}</div>;
    }

    return (
      <div className="app-container">
        <header className="app-header">
          <h1>RotaLog - Rastreamento de Entregas</h1>
          <p>Portal de rastreamento em tempo real</p>
        </header>

        <div className="app-content">
          <aside className="sidebar">
            <DeliveryList 
              deliveries={deliveries}
              selectedDelivery={selectedDelivery}
              onSelectDelivery={this.handleSelectDelivery}
              onFilterChange={this.handleFilterChange}
            />
          </aside>

          <main className="main-content">
            <div className="tracking-section">
              <TrackingDashboard delivery={selectedDelivery} />
            </div>

            <div className="map-section">
              <MapView 
                center={mapCenter}
                zoom={zoom}
                delivery={selectedDelivery}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }
}

// TODO: PropTypes em vez de TypeScript (dívida técnica)
App.propTypes = {
  // Props não documentadas
};

export default App;
