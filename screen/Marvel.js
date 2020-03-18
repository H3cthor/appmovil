import React, {Component} from 'react';
import {View, 
        Text, 
        ActivityIndicator, 
        Image,
        FlatList,
        TouchableHighlight} from 'react-native';

//import ListView from "deprecated-react-native-listview";
//import Crypto from 'crypto-js';

var Crypto = require('react-native-crypto-js');

const REQUEST_URL = 'http://gateway.marvel.com/v1/public/characters';

class Marvel extends Component{
    constructor(props){
        super(props);

        this.timestamp = 1;
        this.public_key = 'f185763f0356f995a19f7bda132474a4';
        this.private_key = '88d9b8076792780ebf8ca29e03d6509f1347b577';

        this.state = {
            /*dataSource : new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),*/
            loaded: true
        }
    } //end constructor

    async componentDidMount(){
        try{
            var hash = Crypto.MD5(this.timestamp + this.private_key + this.public_key);

            const response = await fetch(REQUEST_URL + '?ts=' + this.timestamp + '&apikey=' + this.public_key + '&hash=' + hash);
            const responseData = await response.json();

            this.setState({
                dataSource: responseData.data.results,  //this.state.dataSource.cloneWithRows(responseData.data.results),
                loaded: false
            }, function(){                
            });            
        }
        catch (error){
            console.log(error);
        }
    } // end componentDidMount

    renderLoadingView(){
        return(
            <View>
                <ActivityIndicator/>
                <Text>Cargando Comics ...</Text>
            </View>
        )
    }

    renderComic(comic){
        return(
            <TouchableHighlight>
                <Image source={{uri: comic.thumbnail.path+'.jpg'}}>
                </Image>
                    <View>
                        <Text>{comic.name}</Text>
                        <Text>{comic.comics.avaliable}</Text>
                    </View>
            </TouchableHighlight>
        )
    }

    render(){
        if(this.state.loaded){
          return this.renderLoadingView();
        } // end if

        return(
            <FlatList
                data = {this.state.dataSource}
                renderItem = {({item}) => 
                    //<Text>{item.name}, {item.comics.available}</Text>
                    //<TouchableHighlight>
                        //<Image
                        //    source={{uri: item.thumbnail.path+'.jpg'}}
                        ///>
                            <View>
                                <Image
                                    source={{uri: item.thumbnail.path+'.jpg'}}>
                                </Image>
                                <Text>{item.name}</Text>
                                <Text>{item.comics.available}</Text>
                            </View>
                        
                    //</TouchableHighlight>
                            }
                keyExtractor = {({id}, index) => id}
            />
            /*
            <ListView
                dataSource = {this.state.dataSource}
                renderRow =  {this.renderComic.bind(this)}
                style = {StyleSheet.listView} 
            />
            */
        );
    } // end render
} //end class

export default Marvel;