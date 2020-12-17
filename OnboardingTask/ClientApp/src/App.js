import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { CustomerList } from './components/Customers';
import { ProductList } from './components/Products';
import { StoreList } from './components/Stores';
import { SalesList } from './components/Sales';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
            <Route path='/fetch-data' component={FetchData} />
            <Route path='/fetch-customers' component={CustomerList} />
            <Route path='/fetch-products' component={ProductList} />
            <Route path='/fetch-stores' component={StoreList} />
            <Route path='/fetch-sales' component={SalesList}/>
      </Layout>
    );
  }
}
