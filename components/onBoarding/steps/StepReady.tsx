import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  useWindowDimensions,
} from 'react-native';
import { styles } from '../styles';
import { StepProps } from '../Onboarding.types';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

const SLIDES = [
    {
        id: 'workout',
        title: 'Creá y editá tus rutinas',
        description: 'Armá tus entrenamientos a tu manera, organizá ejercicios y ajustá cada detalle.',
        image: require('../../../assets/onboarding/workout.jpg'),
    },
	{
        id: 'exercise',
        title: 'Registrá tu entrenamiento en tiempo real',
        description: 'Cargá tus pesos y repeticiones para tener un registro de tu progreso.',
        image: require('../../../assets/onboarding/exercise.jpg'),
    },
    {
        id: 'calendar',
        title: 'Seguí tu progreso en el calendario',
        description: 'Visualizá tus días entrenados y mantené tu constancia.',
        image: require('../../../assets/onboarding/calendar.jpg'),
    },
    {
        id: 'widgets',
        title: 'Completá tus objetivos',
        description: 'Aumentá tu motivación cumpliendo metas semanales y mensuales.',
        image: require('../../../assets/onboarding/widgets.jpg'),
    },
    {
        id: 'graph',
        title: 'Mirá tu progreso en detalle',
        description: 'Visualizá tus avances con gráficos e indicadores.',
        image: require('../../../assets/onboarding/graph.jpg'),
    },
];

export const StepReady = ({ data, updateData }: StepProps) => {

	const { width } = useWindowDimensions();
	const [page, setPage] = React.useState(0);

	const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
		const index = event.nativeEvent.position;
		setPage(index);
	};

	return (
		<View style={styles.stepContainer}>

			<View style={readyStyles.content}>
				<PagerView
					style={[readyStyles.pagerContainer, { width }]}
					initialPage={0}
					onPageSelected={handlePageSelected}

				>
					{SLIDES.map(slide => (
						<View key={slide.id} style={readyStyles.slide}>
							<View style={readyStyles.card}>
								<Image
									source={slide.image}
									style={readyStyles.image}
									resizeMode="contain"
								/>

								<View style={readyStyles.textContainer}>
									<Text style={readyStyles.title}>{slide.title}</Text>
									<Text style={readyStyles.description}>
										{slide.description}
									</Text>
								</View>
							</View>
						</View>
					))}
				</PagerView>

				<View style={readyStyles.pagination}>
					{SLIDES.map((_, index) => (
						<View
							key={index}
							style={[
								readyStyles.dot,
								index === page && readyStyles.dotActive,
							]}
						/>
					))}
				</View>
			</View>

		</View>
	);

}

const readyStyles = StyleSheet.create({
	content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pagerContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 360,
	height: 500,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 320,
    marginBottom: 24,
  },
  textContainer: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#4B5563',
    opacity: 0.4,
  },
  dotActive: {
    width: 20,
    opacity: 1,
    backgroundColor: '#007AFF',
  },
});
