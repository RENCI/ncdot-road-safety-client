import React from "react"
import { Layout, Menu } from "antd"
import { MenuOutlined } from "@ant-design/icons"
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom"
import { HomeView, BrowseAnnotationView, BrowseRouteView, MapView, AboutView, ContactView } from "./views"
import { RoutesProvider, AnnotationsProvider, RouteBrowserProvider, AnnotationBrowserProvider } from "./contexts"
import { api } from "./api"
const { Header, Content, Footer } = Layout
const { SubMenu } = Menu

export const App = () => { 
  return (
    <RoutesProvider>
      <AnnotationsProvider>
        <RouteBrowserProvider>
          <AnnotationBrowserProvider>
            <Router>
              <Layout className="site-layout">
                <Header className="site-header">
                  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
                    <Menu.Item key="home"><NavLink to="/">Home</NavLink></Menu.Item>
                    <Menu.Item key="about"><NavLink to="/about">About</NavLink></Menu.Item>
                    <SubMenu key="browse" title="Browse">
                      <Menu.Item>
                        <NavLink to="/browse/annotation">Annotation</NavLink>
                      </Menu.Item> 
                      <Menu.Item>
                        <NavLink to="/browse/route">Route</NavLink>
                      </Menu.Item> 
                    </SubMenu>
                    <Menu.Item key="map"><NavLink to="/map">Map</NavLink></Menu.Item>
                    <Menu.Item key="contact"><NavLink to="/contact">Contact</NavLink></Menu.Item>
                    <SubMenu key="profile" style={{float: "right"}} icon={<MenuOutlined />}>
                      <Menu.Item>
                        <a href={ api.updateAccount }>Profile</a>
                      </Menu.Item> 
                      <Menu.Item>
                        <a href={ api.logout }>Log Out</a>
                      </Menu.Item> 
                    </SubMenu>
                  </Menu>
                </Header>
                <Content className="site-body">
                  <div className="site-content">
                    <Switch>
                      <Route exact path="/"><HomeView /></Route>
                      <Route path="/about"><AboutView /></Route>
                      <Route path="/browse/annotation"><BrowseAnnotationView /></Route>
                      <Route path="/browse/route"><BrowseRouteView /></Route>
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
          </AnnotationBrowserProvider>
        </RouteBrowserProvider>
      </AnnotationsProvider>
    </RoutesProvider>
  ) 
}