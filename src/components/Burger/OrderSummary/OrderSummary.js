import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {

  // This could be a functional component - turned into a class for debugging purposes

  render() {
    const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => (
      <li key={igKey}>
        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
        {this.props.ingredients[igKey]}
      </li>
    ));

    return (
      <Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>{ingredientSummary}</ul>
        <p>
          <strong>Total Price: {this.props.price}</strong>
        </p>
        <p>Continue to Checkout?</p>
        <Button btnType="Danger" clicked={this.props.cancel}>
          CANCEL
        </Button>
        <Button btnType="Success" clicked={this.props.continue}>
          CONTINUE
        </Button>
      </Aux>
    );
  }
}

export default OrderSummary;
