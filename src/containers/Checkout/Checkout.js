import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

  // componentWillMount() {
  //   const query = new URLSearchParams(this.props.location.search);
  //   const ingredients = {};
  //   let totalPrice = 0;
  //   for (let param of query.entries()) {
  //     if (param[0] === 'price') {
  //       totalPrice = +Number(param[1]).toFixed(2);
  //     } else {
  //       ingredients[param[0]] = Number(param[1]);
  //     }
  //   }
  //   this.setState({ ingredients, totalPrice });
  // }

  checkoutCancelHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinueHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    const redirect = <Redirect to="/" />;
    const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
    if (!this.props.ingredients) {
      return redirect;
    }

    return (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={this.props.ingredients}
          checkoutCancel={this.checkoutCancelHandler}
          checkoutContinue={this.checkoutContinueHandler}
        />
        <Route
          path={`${this.props.match.path}/contact-data`}
          component={ContactData} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
};


export default connect(mapStateToProps)(Checkout);
