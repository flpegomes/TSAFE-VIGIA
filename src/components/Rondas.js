import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Image, StyleSheet, ListView } from 'react-native';
import { Container, Header, Left, Right, Body, Title, Button, Icon, View, Fab, List, ListItem, Thumbnail, Text, Badge, Content, Tab, Tabs, TabHeading, Card, CardItem } from 'native-base';
import { rondaFetch, selecionaTab } from '../Actions/AppActions'
import { enderecoSolicitado } from '../Actions/MapsActions';



class Rondas extends Component {
    componentWillMount() {
        this.props.rondaFetch();
        this.criaFonteDeDados(this.props.rondas);
    }

    componentWillReceiveProps(nextProps) {
        this.criaFonteDeDados(nextProps.rondas);
    }

    criaFonteDeDados(rondas) {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.dataSource = ds.cloneWithRows(rondas);
    }
    render() {
        return (
          
          <Fragment>
          <ListView
            enableEmptySections
            dataSource={this.dataSource}
            renderRow={data => ( 
                <ListItem avatar onPress={ () => { 
                    this.props.enderecoSolicitado(data.chegada_latitude, data.chegada_longitude);
                    this.props.selecionaTab(0);
                }} >
                    <Left>
                         <Icon name='flag' type="Entypo" /> 
                    </Left>
                    <Body>
                        <Text>{data.chegada_endereco}</Text>
                        <Text note><Image source={require('../Images/morador_icone.png')} style={{ height: 35, width: 35, marginRight: 20}}/>
                         Morador chegando em {Math.round(data.tempoMorador)} minutos</Text>
                    </Body>
                    <Right>
                        <Text note>11:44</Text>
                    </Right>
                </ListItem>
        )}
        />
        <View style={styles.perfilContainer}>
                <Text>Lista de rondas</Text>
                <Button onPress={() => console.log(this.props.rondas)} title="opa"/>
            </View>
        </Fragment>
        );
    }

}


const styles = StyleSheet.create({
    perfilContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

Rondas.navigationOptions = {
    tabBarIcon: <Icon name="user" size={18} color="#999" />
}



const mapStateToProps = state => {
    const rondas = _.map(state.ListaRondasReducer, (val, uid) => {
        return { ...val, uid }
        
    });
    return {
        rondas,
    }
  }
  export default connect(mapStateToProps, { rondaFetch, enderecoSolicitado, selecionaTab })(Rondas);
  