import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom"
//import { HomeView, BrowseView, MapView, AboutView, ContactView } from './views'
import { Layout, Menu, Breadcrumb } from 'antd'
const { Header, Content, Footer } = Layout

export const App = () => {
    return <div>Hi!</div>;
/*    
  return (
    <Router>
      <Layout className="site-layout">
        <Header className="site-header">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="0"><NavLink to="/">Home</NavLink></Menu.Item>
            <Menu.Item key="1"><NavLink to="/about">About</NavLink></Menu.Item>
            <Menu.Item key="2"><NavLink to="/browse">Browse</NavLink></Menu.Item>
            <Menu.Item key="3"><NavLink to="/map">Map</NavLink></Menu.Item>
            <Menu.Item key="4"><NavLink to="/contact">Contact</NavLink></Menu.Item>
          </Menu>
        </Header>
        <Content className="site-body">
          <div className="site-content">
            <Switch>
              <Route exact path="/"><HomeView /></Route>
              <Route path="/about"><AboutView /></Route>
              <Route path="/browse"><BrowseView /></Route>
              <Route path="/map"><MapView /></Route>
              <Route path="/contact"><ContactView /></Route>
            </Switch>
          </div>
        </Content>
        <Footer className="site-footer">
          &copy; { new Date().getFullYear() }
        </Footer>
      </Layout>
    </Router>
  )
*/  
}