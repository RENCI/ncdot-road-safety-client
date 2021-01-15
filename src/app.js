import React from "react"
import { Layout, Menu } from "antd"
import { MenuOutlined } from "@ant-design/icons"
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom"
import { HomeView, BrowseAnnotationView, BrowseRouteView, MapView, AboutView, ContactView } from "./views"
import { AnnotationsProvider, RoutesProvider, AnnotationBrowserProvider } from "./contexts"
import { api } from "./api"
const { Header, Content, Footer } = Layout
const { SubMenu } = Menu

export const App = () => { 
  return (
    <RoutesProvider>
      <AnnotationsProvider>
        <AnnotationBrowserProvider>
          <RoutesProvider>
            <Router>
              <Layout className="site-layout">
                <Header className="site-header">
                  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["annotate"]}>
                    <Menu.Item key="annotate"><NavLink to="/">Annotate</NavLink></Menu.Item>
                    <Menu.Item key="routes"><NavLink to="/routes">Routes</NavLink></Menu.Item>
                    <SubMenu key="profile" style={{float: "right"}} icon={<MenuOutlined />}>
                      <Menu.Item>
                        <a href={ `api.updateAccount(document.getElementById('user_id').value)` }>Profile</a>	
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
                      <Route exact path="/"><BrowseAnnotationView /></Route>
                      <Route path="/routes/:routeID?/:imageIndex?"><BrowseRouteView /></Route>
                      {/*
                        for the above params to work here, the following needs to be in django urls.py: 
                        "re_path(r'routes(?:.*)/?', TemplateView.as_view(template_name='home.html'), name='home')"
                      */}
                    </Switch>
                  </div>
                </Content>
                <Footer className="site-footer">
                  &copy; { new Date().getFullYear() }
                </Footer>
              </Layout>
            </Router>
          </RoutesProvider>
        </AnnotationBrowserProvider>
      </AnnotationsProvider>
    </RoutesProvider>
  ) 
}
