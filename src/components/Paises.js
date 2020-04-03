import React, { Component } from "react";
import axios from "axios";
import Global from "./../Global";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";

export default class Paises extends Component {
  constructor(props) {
    super(props);
    this.cargarPaises();
    this.state = {
      paises: [], //TODOS PAISES
      offset: 0, //INDICE A PARTIR DEL CUAL CARGAMOS LOS ELEMENTOS A MOSTRAR
      elements: [], //LOS PAISES QUE SE CARGAN EN LA PAGINA ACTUAL
      perPage: 4, //NUMERO DE ELEMENTOS POR PAGINA
      currentPage: 0 //PAGINA ACTUAL, DEFAULT 0
    };
  }

  cargarPaises = () => {
    var request = "/paises";
    var url = Global.urlpost + request;
    axios.get(url).then(res => {
      this.setState(
        {
          paises: res.data,
          pageCount: Math.ceil(this.state.paises.length / this.state.perPage) //TOTAL DE ELEMENTOS ENTRE ELEMENTOS POR PAGINA = NUMERO TOTAL DE PAGINAS
        },
        () => this.setElementsForCurrentPage()
      );
    });
  };

  setElementsForCurrentPage() {
    let elements = this.state.paises
      .slice(this.state.offset, this.state.offset + this.state.perPage)
      .map((pais, i) => {
        return (
          <tr key={i}>
            <td>{pais.idPais}</td>
            <td>{pais.iso}</td>
            <td>{pais.nombre}</td>
          </tr>
        );
      });
    this.setState({ elements: elements });
  }

  //OFFSET CALCULA LOS EMPLEADOS QUE SE HAN VISTO

  handlePageClick = paises => {
    const selectedPage = paises.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState({ currentPage: selectedPage, offset: offset }, () => {
      this.setElementsForCurrentPage();
    });
  };

  componentDidMount() {
    this.cargarPaises();
  }

  render() {
    let paginationElement;
    if (this.state.pageCount > 1) {
      paginationElement = (
        <ReactPaginate
          previousLabel={"← Anterior"}
          nextLabel={"Siguiente →"}
          breakLabel={<span className="gap">...</span>}
          pageCount={this.state.pageCount} //NUMERO TOTAL DE PÁGINAS
          onPageChange={this.handlePageClick} //FUNCION QUE SE LLAMA EN EL onChange DE LA PÁGINA
          forcePage={this.state.currentPage}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-link"}
          previousClassName={"page-link"}
          previousLinkClassName={"page-item"}
          nextClassName={"page-link"}
          nextLinkClassName={"page-item"}
          disabledClassName={"disabled"}
          activeClassName={"page-item active"}
          activeLinkClassName={"page-link"}
        />
      );
    }
    return (
      <div>
        {this.state.paises.length > 0 && (
          <div>
            <Table striped bordered hover variant="dark">
              <tr>
                <th>ID</th>
                <th>ISO</th>
                <th>NOMBRE</th>
              </tr>
              {this.state.elements}
            </Table>
            <div>{paginationElement}</div>
          </div>
        )}
      </div>
    );
  }
}
