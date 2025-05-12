import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

type HeaderProps = {
	title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => (
	<View style={ styles.header }>
		<Text style={ styles.headerTitle }>{title}</Text>
	</View>
);

export default Header;