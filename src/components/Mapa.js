import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, Dimensions, ScrollView, ListView, TouchableHighlight, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Animated } from 'react-native-maps';
import { connect } from 'react-redux';
import { InputGroup, Input, Icon, List, ListItem, Left, Body } from 'native-base';
import MapViewDirections from 'react-native-maps-directions';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { 
        getLocalizacaoUsuario, 
        modificaOrigem, 
        modificaDestino, 
        resultadoSearchBox, 
        getEnderecoPredict, 
        getEnderecoSelecionado,
        calculaDistancia,
        getLocalizacaoCasa,
        atualizaRota,
        confirmaSolicitacao,
        cancelaSolicitacao,
        onDragEndLocalizacaoSelecionada } from '../Actions/MapsActions';

import {
      adicionaContato,
      selecionaTab,
      rondaFetch
} from '../Actions/AppActions'



const { height, width } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const latitudeDelta= 0.0222;
const longitudeDelta = ASPECT_RATIO * latitudeDelta;


 class Mapa extends Component {

  _criaMark = (latitude, longitude) => {
    this.props.coordMark = new AnimatedRegion ({
      latitude,
      longitude
    })
  }

  _chatVigia = () => {
    this.props.adicionaContato('felipe1@tsafe.com.br');
    this.props.selecionaTab(3);
  }

  _renderBotao = (coordAtual) => {
    return (
      <Text style={styles.espacoBtn}> </Text>
    )
    if(this.props.solicitado === false ) {
      return (
        <TouchableHighlight 
                    onPress={() => this.props.rondaFetch()}
                    style={styles.btnConfirmar} 
                  >
                      <Text style={styles.txtConfirmar} >CONFIRMAR RONDA</Text>
        </TouchableHighlight>
      )
    }
    else if(this.props.solicitado === true) {
      return (
        <Text style={styles.espacoBtn}> </Text>
      )
    }
  }

  _renderRotaVigia = (latitude, longitude) => {
    if(!(this.props.enderecoSolicitado === null) && this.props.solicitado === true) {
      return (
        <MapViewDirections
        origin={`${latitude}, ${longitude}`}
        destination={`${this.props.enderecoSolicitado.latitude}, ${this.props.enderecoSolicitado.longitude}`}
        apikey='AIzaSyCCvLwYKMDVy2u6CqJl9zAdGOYpsvuVngM'
        strokeWidth={3}
        strokeColor="#323232"
        // onReady={(result) => {
        //       atualizaRota()              
        //    }
        // }
        
        onReady={(result) => {
          this.setState({tempoVigia: result.duration})
        }}

      />
      )
    }
    return null
          
  }

  _renderMarkLocalizacaoSelecionada = () => {
    if(!(this.props.enderecoSolicitado === null)){
      
      return (
        <MapView.Marker.Animated
              title= 'Localização selecionada'
              ref={marker => {this.marker = marker}}
              description= 'Clique para falar com o vigia.'
              image={require('../Images/mark_solicitacao.png')}
              draggable
              coordinate={{
                latitude: this.props.enderecoSolicitado.latitude,
                longitude: this.props.enderecoSolicitado.longitude,
              }}
              showsCalloutOnLoad
              onDragEnd={(e) => {
                this.props.onDragEndLocalizacaoSelecionada(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
                this._criaMark(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
              }}        
              onPress={() => {console.log('abrir chat')}}
              onCalloutPress={() => this._chatVigia() }
        />
        
      )
    }
  } 


  state = {
    tempoVigia: '0',
    tempoMorador: '0',
    confirmaSolicitacao: false,
    coordMark: {
      latitude: 0,
      longitude: 0
    }


  }

  componentWillMount(){
    this.props.getLocalizacaoUsuario();
    this.props.getLocalizacaoCasa();
  }

  _renderCasa(coordVigiaLatitude, coordVigiaLongitude) {
    if(!(this.props.longitudeCasa === null)) {
    return (
      <View>
        <MapView.Marker
              title= 'Casa'
              ref="a"
              description= 'Minha casa'
              image={require('../Images/teste7.png')}
              draggable
              coordinate={{
                latitude: this.props.latitudeCasa,
                longitude: this.props.longitudeCasa,
              }}
              showsCalloutOnLoad
          />
        </View>
      )
    }
  }

 
   render() {
    let coordVigia = {
      latitude: -23.5271216, 
      longitude: -46.7261788
    }

    let coordAtual = {
      latitude: this.props.region_latitude,
      longitude: this.props.region_longitude
    }

    return(
      <View style={{paddingTop: this.props.statusBarHeight, flex:1}}> 

      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          showMyLocationButton={true}
          ref={map => this.mapView = map}
          initialRegion={{
            latitude:  this.props.region_latitude,
            longitude: this.props.region_longitude,
            latitudeDelta,
            longitudeDelta,
          }}          
          onMapReady={this._mapReady}           
          showsPointsOfInterest={false}
          style={styles.mapView}
        >
          {this._renderCasa(coordVigia.latitude, coordVigia.longitude) }          
          {this._renderRotaVigia(this.props.region_latitude, this.props.region_longitude)}
          {this._renderMarkLocalizacaoSelecionada()}

          
        </MapView>
            

             
              <View style={styles.confirmarContainer}>
                {this._renderBotao(coordAtual)}
                <View style={styles.tempoVigiaContainer}>
                  <Image source={require('../Images/vigia_icone.png')} style={{ height: 20, width: 20}} />
                  <Text style={{fontWeight: 'bold', fontSize:14, color:'#323232'}}>  {Math.round(this.state.tempoVigia)} min.</Text>
                </View>
              </View>

      </View>
      </View>

    );
    
  }
}


const styles = StyleSheet.create({
    mapView: {
      position: 'absolute',
      top: 0,
      left: 0, 
      bottom: 0, 
      right: 0,
    },
    container: {
      flex:1, 
      justifyContent: 'flex-end',
      alignItems: 'center',
      

    },
    placesContainer: {
        width: '100%',
        maxHeight: 200,
    },
    place: {
      width: width -40,
      maxHeight: 200, 
      backgroundColor: '#fff',
      marginHorizontal: 20, 
    },
    inputWrapper: {
        marginLeft: 15, 
        marginRight: 15,
        marginTop: 60,
        marginBottom: 0,
        backgroundColor: '#222',
        opacity: 0.9,
        borderRadius: 7,
    },
    secondInputWrapper: {
        marginLeft: 15, 
        marginRight: 10,
        marginTop: 0,
        backgroundColor: '#fff',
        opacity: 0.9,
        borderRadius: 7,
    },
    inputSearch: {
        fontSize: 14,
        color:'#fff'
    },
    label: { 
        fontSize: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 0,
        color: '#f9dc36',
        fontWeight: 'bold',
    },
    searchResultsWrapper: {
      bottom: 0,
      position: 'absolute',
      width: width,
      marginLeft:20,
      backgroundColor: '#fff',
      opacity: 0.9,
      borderRadius: 7,
      elevation: 5
    },
    primaryText: {
        fontWeight: 'bold',
        color: '#373737',
    },
    secondaryText: {
        fontStyle: 'italic',
        color: "#7D7D7D",
    },
    leftContainer: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        borderLeftColor: '#7D7D7D',
    },
    leftIcon: {
        
        color: '#f9dc36',
    },
    distance: {
        fontSize: 12
    },
    btnConfirmar: {
        backgroundColor: '#f9dc36',
        flex:6,
        height: 35,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        opacity:0.9,
        elevation: 4,
        marginBottom: 20,

    },
    espacoBtn: {
      flex:6
    },
    txtConfirmar: {
      color:'#323232',
      fontWeight: 'bold',
      fontSize: 14
    },
    iconSearch: {
      color: '#f9dc36',
    },
    confirmarContainer: {
      flexDirection: 'row',
      height:35,
      marginBottom:20
    },
    tempoMoradorContainer: {
      borderRadius:3, 
      width: 20,
      flex:2,
      backgroundColor: "#fff",
      marginHorizontal: 10,
      elevation:4,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    tempoVigiaContainer: {
      borderRadius:3, 
      width: 20,
      flex:2,
      marginHorizontal: 10,
      elevation:4,
      backgroundColor: "#fff",
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    }
}); 


const mapStateToProps = state => (
  {
    
      enderecoSolicitado: state.MapsReducer.enderecoSolicitado,
      region_latitude: state.MapsReducer.region_latitude,
      region_longitude: state.MapsReducer.region_longitude,
      origem: state.MapsReducer.origem,
      latitudeCasa: state.MapsReducer.latitudeCasa,
      longitudeCasa: state.MapsReducer.longitudeCasa,
      tempoRotaMorador: state.MapsReducer.tempoRotaMorador,
      tempoRotaVigia: state.MapsReducer.tempoRotaVigia,
      region: state.MapsReducer.region,
      solicitado: state.MapsReducer.solicitado,  
  }
)
export default connect(mapStateToProps, { 
                                          getLocalizacaoUsuario, 
                                          modificaDestino, 
                                          modificaOrigem, 
                                          resultadoSearchBox, 
                                          getEnderecoPredict, 
                                          getEnderecoSelecionado,
                                          calculaDistancia,
                                          getLocalizacaoCasa,
                                          atualizaRota,
                                          confirmaSolicitacao,
                                          cancelaSolicitacao,
                                          onDragEndLocalizacaoSelecionada,
                                          adicionaContato,
                                          selecionaTab,
                                          rondaFetch })(Mapa);