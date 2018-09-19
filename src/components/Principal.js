import Home from './Mapa.js';
import Rondas from './Rondas';
import Pagamento from './Pagamento';


import React, { Fragment, Component  } from 'react';
import { Container, Header, Left, Right, Body, Title, Button, Icon, View, Fab, List, ListItem, Thumbnail, Text, Badge, Content, Tab, Tabs, TabHeading, Card, CardItem } from 'native-base';
import { Image, StyleSheet } from 'react-native';
import PrincipalConversas from './PrincipalConversas.js';
import { connect } from 'react-redux';
import {
  selecionaTab
} from '../Actions/AppActions'
  

  





//const logo_url = 'https://i.imgur.com/Ak1i1Ze.png';
const logo_url ='https://i.imgur.com/Y63DKEA.png';

class App extends Component {
render(){
return (
  <Container>
    <View style={styles.container}>
    <Tabs tabBarUnderlineStyle={{backgroundColor:'#323232'}} locked={true} tabBarPosition='bottom' page={this.props.tab} onChangeTab={(i) => this.props.selecionaTab(i)}>
      <Tab heading={<TabHeading style={styles.tabHeading}><Icon style={styles.icon} type="FontAwesome" name="home" /></TabHeading>}>
        <Home />
      </Tab>
      <Tab heading={<TabHeading style={styles.tabHeading}><Icon style={styles.icon} type="MaterialIcons" name="navigation" /></TabHeading>}>
        <Rondas />
      </Tab>
      <Tab heading={<TabHeading style={styles.tabHeading}><Icon style={styles.icon} type="FontAwesome" name="credit-card" /></TabHeading>}>
        <Pagamento />
      </Tab>
      <Tab heading={<TabHeading style={styles.tabHeading}><Icon style={styles.icon} type="Octicons" name="credit-card" /></TabHeading>}>
        <PrincipalConversas />
      </Tab>
    </Tabs>
    </View>
  </Container>
)};
}

const mapStateToProps = state => (
  {
      tab: state.AppReducer.tab,
  }
)

export default connect(mapStateToProps, { selecionaTab })(App);

const styles = StyleSheet.create({
  tabHeading: {
    backgroundColor: "#fadf63",
  },
  header: { 
    backgroundColor: "#fadf63",
  },
  container: {
    flex: 1,
  }, 
  icon: {
      color:'#323232'
  },
  body: {
      paddingLeft: 50,
  }
});