import React from "react"
import { Layout, Menu } from "antd"
import { LogoutOutlined, ProfileOutlined, UserOutlined } from "@ant-design/icons"
import { BrowserRouter as Router, Switch, Route, NavLink, useLocation } from "react-router-dom"
import { BrowseAnnotationView, RouteView, RoutesListView, PredictionErrorsView } from "./views"
import { 
  AccountProvider, 
  useAccount, 
  RoutesProvider, 
  AnnotationsProvider, 
  AnnotationBrowserProvider,
  PredictionErrorsProvider
} from "./contexts"
import { api } from "./api"
const { Header, Content, Footer } = Layout
const { SubMenu } = Menu

const ContextProviders = ({ children }) => {
  return (
    <AccountProvider>
      <PredictionErrorsProvider>
        <RoutesProvider>
          <AnnotationsProvider>
            <AnnotationBrowserProvider>
              <Router>
                { children }
              </Router>
            </AnnotationBrowserProvider>
          </AnnotationsProvider>
        </RoutesProvider>
      </PredictionErrorsProvider>
    </AccountProvider>
  )
}

const MenuBar = ({ activePath }) => {
  const { account } = useAccount()
  const { pathname } = useLocation()

  return (
    <Header className="site-header">
      <Menu theme="dark" mode="horizontal" selectedKeys={ [pathname] }>
        <Menu.Item key="/"><NavLink to="/">Annotate</NavLink></Menu.Item>
        <Menu.Item key="/routes"><NavLink to="/routes">Routes</NavLink></Menu.Item>
        <Menu.Item key="/prediction-errors"><NavLink to="/prediction-errors">Prediction errors</NavLink></Menu.Item>
        <SubMenu key="profile" style={{float: "right"}} icon={<span>{ account.username }&nbsp;&nbsp;<UserOutlined /></span>}>
          <Menu.Item icon={<ProfileOutlined />}> 
            <a href={ api.updateAccount(document.getElementById('user_id').value) }>View Profile</a>  
          </Menu.Item>
          <Menu.Item icon={<LogoutOutlined />}>
            <a href={ api.logout }>Log Out</a>
          </Menu.Item> 
        </SubMenu>
      </Menu>
    </Header>
  )
}

export const App = () => { 
  return (
    <ContextProviders>
      <Layout className="site-layout">
        <MenuBar />
        <Content className="site-body">
          <div className="site-content">
            <Switch>
              <Route exact path="/"><BrowseAnnotationView /></Route>
              <Route exact path="/routes"><RoutesListView /></Route>
              <Route exact path="/routes/:routeID/:imageIndex?"><RouteView /></Route>
              <Route exact path="/prediction-errors"><PredictionErrorsView /></Route>
            </Switch>
          </div>
        </Content>
        <Footer className="site-footer">
          &copy; { new Date().getFullYear() }
        </Footer>
      </Layout>
    </ContextProviders>
  ) 
}
