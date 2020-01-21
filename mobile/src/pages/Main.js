import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import {  connect, disconnnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }) {
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState();

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if(granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }
        }

        loadInitialPosition();
    }, []);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]))
    }, [devs])

    function setupWebsocket() {
        disconnnect();

        const [ latitude, longitude ] = currentRegion;
        
        connect(
            latitude, 
            longitude, 
            techs
        );
    }

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude, 
                longitude,
                techs
            }
        });

        setDevs(response.data.devs);    //Setando os devs retornado da API
        setupWebsocket();
    }

    function handleRegionChanged(region) {

    }

    if(!currentRegion) {
        return null;
    }

    return (
        <>
            <MapView 
                onRegionChange={handleRegionChanged}
                initialRegion={currentRegion} 
                style={styles.map}>

                {devs.map(dev => (
                    <Marker 
                        key={dev._id}
                        coordinate={ {
                            latitude: dev.location.coordinates[1],
                            longitude: dev.location.coordinates[0],
                    } } >
                        <Image source={ {uri: dev.avatar.url} } />
                        
                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username:'Elismar13' })
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.bio}>{dev.bio}</Text>
                                <Text style={styles.techs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}

            </MapView>

            <View style={styles.searchForm}>
                <TextInput 
                    style={style.searchInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor='#999'
                    autoCapitalize='words'
                    autoCorrect={false} 
                    value ={techs}
                    onChangeText={setTechs}/>

                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color='#FFF' />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        heigth: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },

    callout: {
        width: 260,
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    devBio: {
        color: "#667",
        marginTop: 5,
    },

    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        rigth: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex:1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height:4
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8Ef4FF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 15,
    },
});

export default Main;