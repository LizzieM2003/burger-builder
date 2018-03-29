import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';
import * as actionCreators from '../../store/actions/index';

export class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  // addIngredientHandler = type => {
  //   const ingredients = { ...this.state.ingredients };
  //   ingredients[type]++;
  //   const priceToAdd = INGREDIENT_PRICES[type];
  //   this.setState((prevState, props) => ({
  //     ingredients,
  //     totalPrice: prevState.totalPrice + priceToAdd
  //   }));
  //   this.updatePurchaseState(ingredients);

  // below is Max's method
  // const oldCount = this.state.ingredients[type];
  // const updatedCount = oldCount + 1;
  // const updatedIngredients = {
  //     ...this.state.ingredients
  // };
  // updatedIngredients[type] = updatedCount;
  // const priceAddition = INGREDIENT_PRICES[type];
  // const oldPrice = this.state.totalPrice;
  // const newPrice = oldPrice + priceAddition;
  // this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
  //};

  // removeIngredientHandler = type => {
  //   const ingredients = { ...this.state.ingredients };
  //   if (ingredients[type] > 0) {
  //     ingredients[type]--;
  //     const priceToRemove = INGREDIENT_PRICES[type];
  //     this.setState((prevState, props) => ({
  //       ingredients,
  //       totalPrice: prevState.totalPrice - priceToRemove
  //     }));
  //     this.updatePurchaseState(ingredients);
  //   }
  // };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // alert('You clicked continue!');
    // this.setState({ loading: true });
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice,
    //   customer: {
    //     name: 'Lizzie Mendes',
    //     address: {
    //       street: 'Teststreet 1',
    //       postCode: 'HA1 1AA',
    //       country: 'United Kingdom'
    //     },
    //     email: 'test@test.com'
    //   },
    //   deliveryMethod: 'express'
    // };

    // axios
    //   .post('/orders.json', order)
    //   .then(response => {
    //     //console.log(response);
    //     this.setState({ loading: false, purchasing: false });
    //   })
    //   .catch(error => {
    //     //console.log(error);
    //     this.setState({ loading: false, purchasing: false });
    //   });

    // now use redux instead of query params to pass props
    // const queryParams = [];
    // for (let i in this.props.ingredients) {
    //   queryParams.push(
    //     `${encodeURIComponent(i)}=${encodeURIComponent(
    //       this.state.ingredients[i]
    //     )}`
    //   );
    // }
    // queryParams.push(`price=${this.props.totalPrice}`);
    // const queryString = queryParams.join('&');
    // this.props.history.push({
    //   pathname: '/checkout',
    //   search: `?${queryString}`
    // });
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  };

  updatePurchaseState(ingredients) {
    // const ingredients = { ...this.state.ingredients };
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((total, amt) => total + amt);
    //this.setState({ purchasable: sum > 0 });
    return sum > 0;
  }

  render() {
    const disableButtons = {
      ...this.props.ingredients
    };

    for (let key in disableButtons) {
      disableButtons[key] = disableButtons[key] <= 0;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          loading={this.state.loading}
          modalClosed={this.purchaseCancelHandler}
        >
          {this.state.loading ? (
            <Spinner />
          ) : this.props.ingredients ? (
            <OrderSummary
              ingredients={this.props.ingredients}
              continue={this.purchaseContinueHandler}
              cancel={this.purchaseCancelHandler}
              price={this.props.totalPrice.toFixed(2)}
            />
          ) : null}
        </Modal>

        {this.props.error ? (
          <p>Ingredients can't be loaded</p>
        ) : this.props.ingredients ? (
          <Aux>
            <Burger ingredients={this.props.ingredients} />
            <BuildControls
              ingredientAdded={this.props.onIngredientAdded}
              ingredientRemoved={this.props.onIngredientRemoved}
              disabled={disableButtons}
              price={this.props.totalPrice}
              disableOrderButton={
                !this.updatePurchaseState(this.props.ingredients)
              }
              ordered={this.purchaseHandler}
              isAuth={this.props.isAuthenticated}
            />{' '}
          </Aux>
        ) : (
          <Spinner />
        )}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingredientName =>
      dispatch(actionCreators.addIngredient(ingredientName)),
    onIngredientRemoved: ingredientName =>
      dispatch(actionCreators.removeIngredient(ingredientName)),
    onInitIngredients: () => dispatch(actionCreators.initIngredients()),
    onInitPurchase: () => dispatch(actionCreators.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withErrorHandler(BurgerBuilder, axios)
);
