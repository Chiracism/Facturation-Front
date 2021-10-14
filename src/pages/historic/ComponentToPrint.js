import React from 'react';
import './Historic.css';

class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date().toDateString()
    };
  }

  render() {
    const { rows } = this.props;
    const { date } = this.state;

    return (
      <div>
        <div className="print-source" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            className="print-source"
            src="/static/logo_lmc.JPG"
            alt="Logo"
            style={{ width: 150, height: 150 }}
          />
          <div
            className="print-source"
            style={{ textAlign: 'center', color: 'blue', flexGrow: 0.7 }}
          >
            <p style={{ fontWeight: 700, fontSize: '22px' }}>Republique Démocratique du Congo</p>
            <p style={{ fontWeight: 700, fontSize: '22px' }}>LIGNES MARITIMES CONGOLAISES, SA</p>
            <p style={{ fontWeight: 600, fontSize: '22px' }}>Armement National</p>
            <hr style={{ opacity: 1, color: 'blue', backgroundColor: 'blue', height: '3px' }} />
          </div>
        </div>
        <h3 className="print-source" style={{ textAlign: 'center' }}>
          HISTORIQUE DES EXPORTATIONS
        </h3>
        <div
          className="print-source"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
            marginBottom: '2rem',
            width: '100%'
          }}
        >
          <table className="print-source" style={{ width: '100%', marginBottom: '2rem' }}>
            <thead>
              <th>Série</th>
              <th>Client</th>
              <th>Consignée</th>
              <th>Description</th>
              <th>Quantité</th>
              <th>Unité Payante</th>
              <th>Prix</th>
              <th>Total</th>
              <th>Commission</th>
              <th>Extra Fac</th>
              <th>Solde</th>
              <th>Freight</th>
              <th>Utilisateur</th>
              <th>Date</th>
            </thead>
            <tbody style={{ width: '100%' }}>
              {rows.map((value, key) => {
                const {
                  serie,
                  client,
                  consignee,
                  description,
                  quantity,
                  unit,
                  price,
                  total,
                  commission,
                  extra,
                  solde,
                  freight,
                  user,
                  date
                } = value;
                return (
                  <tr key={key} style={{ textAlign: 'center' }}>
                    <td>{serie}</td>
                    <td>{client}</td>
                    <td>{consignee}</td>
                    <td>{description}</td>
                    <td>{quantity}</td>
                    <td>{unit}</td>
                    <td>{price}</td>
                    <td>{total}</td>
                    <td>{commission}</td>
                    <td>{extra}</td>
                    <td>{solde}</td>
                    <td>{freight}</td>
                    <td>{user}</td>
                    <td>{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ComponentToPrint;
