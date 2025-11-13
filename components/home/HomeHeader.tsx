import { View, Image, Text } from 'react-native';
import {styles} from './styles';

export default function HomeHeader() {

	return (
		<View style={ styles.header }>
			<Image
                source={require('../../assets/logo-foreground.png')}
                style={styles.headerLogo}
            />
			<Text style={ styles.headerTitle }>Rackit</Text>
		</View>
	);
}