import React from 'react';
import PropTypes from 'prop-types';

class DeliveryList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      filteredDeliveries: props.deliveries,
      sortBy: 'status'
    };
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.deliveries !== this.props.deliveries) {
      this.updateFilteredList();
    }
  }

  updateFilteredList = () => {
    // TODO: Implementar filtros corretamente
    // TODO: Usar Redux selectors em vez de state local
    const { deliveries } = this.props;
    let filtered = [...deliveries];

    // TODO: Sorting deveria estar em Redux
    filtered.sort((a: any, b: any) => {
      if (this.state.sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    this.setState({ filteredDeliveries: filtered });
  };

  render() {
    const { filteredDeliveries } = this.state;
    const { selectedDelivery, onSelectDelivery } = this.props;

    return (
      <div className="delivery-list">
        <div className="list-header">
          <h3>Entregas</h3>
          <select 
            value={this.state.sortBy}
            onChange={(e) => this.setState({ sortBy: e.target.value }, this.updateFilteredList)}
          >
            <option value="status">Por Status</option>
            <option value="date">Por Data</option>
            <option value="distance">Por Distância</option>
          </select>
        </div>

        <div className="list-items">
          {filteredDeliveries.map((delivery: any) => (
            <div 
              key={delivery.id}
              className={`list-item ${selectedDelivery?.id === delivery.id ? 'selected' : ''}`}
              onClick={() => onSelectDelivery(delivery)}
            >
              <div className="item-header">
                <span className="item-id">#{delivery.id}</span>
                <span className={`item-status status-${delivery.status}`}>
                  {delivery.status}
                </span>
              </div>
              <div className="item-body">
                <p className="item-driver">{delivery.driver_name}</p>
                <p className="item-destination">{delivery.destination_address}</p>
                <p className="item-distance">{delivery.distance_km} km</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

(DeliveryList as any).propTypes = {
  deliveries: PropTypes.array.isRequired,
  selectedDelivery: PropTypes.object,
  onSelectDelivery: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func
};

export default DeliveryList;
