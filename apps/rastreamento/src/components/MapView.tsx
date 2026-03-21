import React from 'react';
import PropTypes from 'prop-types';

// TODO: Usar biblioteca de mapa real (Google Maps, Leaflet, etc)
// TODO: Implementar markers e rotas
class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLoaded: false,
      markers: []
    };
  }

  componentDidMount() {
    // TODO: Carregar Google Maps API
    // TODO: Implementar geolocalização em tempo real
    this.setState({ mapLoaded: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.delivery !== this.props.delivery) {
      this.updateMapMarkers();
    }
  }

  updateMapMarkers = () => {
    const { delivery } = this.props;
    if (delivery) {
      // TODO: Adicionar markers no mapa
      this.setState({
        markers: [
          { lat: delivery.origin_lat, lng: delivery.origin_lng, type: 'origin' },
          { lat: delivery.destination_lat, lng: delivery.destination_lng, type: 'destination' }
        ]
      });
    }
  };

  render() {
    const { center, zoom, delivery } = this.props;
    const { mapLoaded } = this.state;

    return (
      <div className="map-view">
        <div className="map-header">
          <h3>Mapa de Rastreamento</h3>
          {delivery && <span className="map-info">{delivery.driver_name}</span>}
        </div>

        <div className="map-container">
          {!mapLoaded && <div className="map-loading">Carregando mapa...</div>}
          
          {/* TODO: Implementar mapa real com Google Maps API */}
          <div className="map-placeholder">
            <p>Mapa de rastreamento</p>
            <p>Centro: {center.lat}, {center.lng}</p>
            <p>Zoom: {zoom}</p>
            {delivery && (
              <div className="delivery-info">
                <p>Entrega: {delivery.id}</p>
                <p>Destino: {delivery.destination_address}</p>
              </div>
            )}
          </div>
        </div>

        <div className="map-controls">
          <button onClick={() => console.log('Zoom in')}>+</button>
          <button onClick={() => console.log('Zoom out')}>-</button>
          <button onClick={() => console.log('Center map')}>Centralizar</button>
        </div>
      </div>
    );
  }
}

MapView.propTypes = {
  center: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  delivery: PropTypes.object
};

export default MapView;
