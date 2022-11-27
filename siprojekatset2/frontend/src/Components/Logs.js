import React, { Component } from "react";
import { getLogs } from "../Utility/Log";
export default class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [], loading: true };
  }

  componentDidMount() {
    this.ucitajLogove();
  }

  static renderTable(logovi) {
    return (
      <div className="container">
        <table className="table table-striped" aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Datum i vrijeme</th>
              <th>Nivo</th>
              <th>Poruka</th>
            </tr>
          </thead>
          <tbody>
            {logovi.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.level}</td>
                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    let contents = this.state.loading ? (
      <h3 className="text-center">Učitavanje logova, sačekajte...</h3>
    ) : (
      Logs.renderTable(this.state.logs)
    );

    return (
      <div>
        <h1 id="tabelLabel" className="text-center mb-3">
          Logovi
        </h1>
        {contents}
      </div>
    );
  }

  async ucitajLogove() {
    const data = await getLogs();
    this.setState({ logs: data, loading: false });
  }
}
