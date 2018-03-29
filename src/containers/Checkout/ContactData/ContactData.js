import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import classes from './ContactData.css';
import * as actionCreators from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      postCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Post Code'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'express', displayValue: 'Express' },
            { value: 'standard', displayValue: 'Standard' }
          ]
        },
        value: 'express',
        validation: {},
        valid: true
      }
    },
    formIsValid: false
  };

  orderHandler = event => {
    event.preventDefault();
    // this.setState({ loading: true });
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      userId: this.props.userId,
      orderData: formData
    };

    this.props.onOrderBurger(this.props.token, order);
  };

  inputChangedHandler = (event, inputIdentifier) => {
    
    const updatedFormElement = updateObject(
      this.state.orderForm[inputIdentifier],
      {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.orderForm[inputIdentifier].validation
        ),
        touched: true
      }
    );

    // updatedFormElement.valid = this.checkValidity(
    //   updatedFormElement.value,
    //   updatedFormElement.validation
    // );
    // updatedFormElement.touched = true;

    const updatedOrderForm = updateObject(this.state.orderForm, {[inputIdentifier]: updatedFormElement})
    // updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form;
    if (this.props.loading) {
      form = <Spinner />;
    } else {
      form = (
        <form onSubmit={this.orderHandler}>
          {formElementsArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          ))}
          <Button btnType="Success" disabled={!this.state.formIsValid}>
            ORDER
          </Button>
        </form>
      );
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Details</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => ({
  onOrderBurger: (token, order) =>
    dispatch(actionCreators.purchaseBurger(token, order))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withErrorHandler(ContactData, axios)
);
