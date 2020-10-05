import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { HomeView, BrowseView, MapView, AboutView, ContactView } from "./views";
import { AnnotationsProvider } from "./contexts";
import { Layout, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

export const App = () => { 
  return (
    <AnnotationsProvider>
      <Router>
        <Layout className="site-layout">
          <Header className="site-header">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
              <Menu.Item key="home"><NavLink to="/">Home</NavLink></Menu.Item>
              <Menu.Item key="about"><NavLink to="/about">About</NavLink></Menu.Item>
              <Menu.Item key="browse"><NavLink to="/browse">Browse</NavLink></Menu.Item>
              <Menu.Item key="map"><NavLink to="/map">Map</NavLink></Menu.Item>
              <Menu.Item key="contact"><NavLink to="/contact">Contact</NavLink></Menu.Item>
              <SubMenu key="submenu" style={{float: "right"}} icon={<MenuOutlined />}>
              <Menu.Item>
                <a href="/accounts/update/2/">Profile</a>
                </Menu.Item> 
                <Menu.Item>
                <a href="/logout/">Log Out</a>
                </Menu.Item> 
              </SubMenu>
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
    </AnnotationsProvider>
  ) 
}