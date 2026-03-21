import React from 'react';
import PropTypes from 'prop-types';

// TODO: Usar biblioteca de mapa real (Google Maps, Leaflet, etc)
// TODO: Implementar markers e rotas
class MapView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      mapLoaded: false,
      markers: [],
      currentZoom: props.zoom || 12,
      currentCenter: props.center || { lat: -23.5505, lng: -46.6333 }
    };
  }

  componentDidMount() {
    // TODO: Carregar Google Maps API
    // TODO: Implementar geolocalização em tempo real
    this.setState({ mapLoaded: true });
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.delivery !== this.props.delivery) {
      this.updateMapMarkers();
    }
  }

  updateMapMarkers = () => {
    const { delivery } = this.props;
    if (delivery) {
      // TODO: Adicionar markers no mapa de verdade
      this.setState({
        markers: [
          { lat: delivery.origem_lat, lng: delivery.origem_lng, type: 'origin' },
          { lat: delivery.destino_lat, lng: delivery.destino_lng, type: 'destination' }
        ],
        currentCenter: {
          lat: delivery.origem_lat || this.props.center.lat,
          lng: delivery.origem_lng || this.props.center.lng
        }
      });
    }
  };

  // TODO: Deveria usar debounce para evitar re-renders excessivos
  handleZoomIn = () => {
    this.setState((prevState: any) => ({
      currentZoom: Math.min(prevState.currentZoom + 1, 20)
    }));
  };

  handleZoomOut = () => {
    this.setState((prevState: any) => ({
      currentZoom: Math.max(prevState.currentZoom - 1, 1)
    }));
  };

  handleCentralizar = () => {
    const { delivery } = this.props;
    if (delivery && delivery.origem_lat) {
      this.setState({
        currentCenter: {
          lat: delivery.origem_lat,
          lng: delivery.origem_lng
        },
        currentZoom: 14
      });
    } else {
      // Centralizar em São Paulo
      this.setState({
        currentCenter: { lat: -23.5505, lng: -46.6333 },
        currentZoom: 12
      });
    }
  };

  // TODO: Extrair para componente separado
  renderMarkers = () => {
    const { markers } = this.state;
    if (!markers || markers.length === 0) return null;

    return (
      <div className="map-markers">
        {markers.map((marker: any, index: number) => (
          <div key={index} className="map-marker">
            <span className={`marker-icon marker-${marker.type}`}>
              {marker.type === 'origin' ? '📍' : '🏁'}
            </span>
            <span className="marker-coords">
              {marker.lat?.toFixed(4)}, {marker.lng?.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { delivery } = this.props;
    const { mapLoaded, currentZoom, currentCenter } = this.state;

    // TODO: Calcular escala fake baseada no zoom
    const scaleKm = Math.max(0.1, (20 - currentZoom) * 2.5).toFixed(1);

    return (
      <div className="map-view">
        <div className="map-header">
          <h3>Mapa de Rastreamento</h3>
          {delivery && <span className="map-info">Entrega: {delivery.numero_pedido}</span>}
        </div>

        <div className="map-container">
          {!mapLoaded && <div className="map-loading">Carregando mapa...</div>}
          
          {/* TODO: Implementar mapa real com Google Maps API */}
          <div className="map-placeholder">
            {delivery ? (
              <div className="delivery-map-info">
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {delivery.numero_pedido}
                </p>
                <p>📍 Origem: {delivery.origem_endereco}</p>
                <p>🏁 Destino: {delivery.destino_endereco}</p>
                <p style={{ marginTop: '10px', color: '#666' }}>
                  Distância: {delivery.distancia_km} km | 
                  Tempo estimado: {delivery.tempo_estimado_minutos} min
                </p>
                {this.renderMarkers()}
              </div>
            ) : (
              <div>
                <p>Mapa de rastreamento</p>
                <p style={{ color: '#999' }}>Selecione uma entrega para ver no mapa</p>
              </div>
            )}
            <div className="map-status-bar">
              <span>Centro: {currentCenter.lat?.toFixed(4)}, {currentCenter.lng?.toFixed(4)}</span>
              <span>Zoom: {currentZoom}</span>
              <span>Escala: ~{scaleKm} km</span>
            </div>
          </div>
        </div>

        <div className="map-controls">
          <button onClick={this.handleZoomIn} title="Aumentar zoom">+</button>
          <button onClick={this.handleZoomOut} title="Diminuir zoom">-</button>
          <button onClick={this.handleCentralizar} title="Centralizar mapa">Centralizar</button>
        </div>
      </div>
    );
  }
}

(MapView as any).propTypes = {
  center: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  delivery: PropTypes.object
};

export default MapView;
