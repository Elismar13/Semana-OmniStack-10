import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile( navigation ) {
    const githubUsername = navigation.getParam('github_username');
    
    return (
        <WebView style={ { fles: 1 }} source={ {uri: `https://github.com/${githubUsername}` } }/>
    );
}

export default Profile;