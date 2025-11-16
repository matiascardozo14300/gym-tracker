import { View, Image, TouchableOpacity } from 'react-native';
import {styles} from './styles';
import { User } from 'lucide-react-native';
import { RootStackParamList, RootTabParamList } from '../../App';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Inicio'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeHeader() {

	const tabNav = useNavigation<TabNav>();
	const stackNav = tabNav.getParent<StackNav>();

	const goToProfile = () => {
		stackNav?.navigate( 'Tabs', { screen: 'Ajustes' } );
	}

	return (
		<View style={ styles.header }>

			<View style={ styles.logoContainer }>
				<Image
					source={require('../../assets/logo-foreground.png')}
					style={styles.headerLogo}
				/>
				<Image
					source={require('../../assets/rackit-text.png')}
					style={styles.headerLogoText}
				/>
			</View>

			<TouchableOpacity style={ styles.profileButton } onPress={goToProfile}>
				<User size={28} color="#333" />
			</TouchableOpacity>

		</View>
	);
}