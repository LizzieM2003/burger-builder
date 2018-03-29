import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    };

    componentWillMount() {
      this.reqInterceptor = axios.interceptors.request.use(req => {
        this.setState({ error: null });
        return req;
      });

      this.resInterceptor = axios.interceptors.response.use(
        res => res,
        error => {
          //console.log(error);
          if (error.response) {
            // firebase auth or database error
            //console.log(error.response);

            this.setState({ error: error.response.data.error });
            return Promise.reject(error);
          } else {
            this.setState({ error });
          }
        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      let errorMessage = null;
      if (this.state.error) {
        if (this.state.error.message) {
          errorMessage = this.state.error.message;
        } else {
          errorMessage = this.state.error;
        }
      }
      return (
        <Aux>
          <Modal
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}
          >
            {errorMessage}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
