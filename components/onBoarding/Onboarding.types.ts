export type OnboardingData = {
    name: string;
    gender: 'Masculino' | 'Femenino' | 'Otro' | null;
    weight: string;
    age: string;
	height: string;
    experience: 'Sin experiencia' | 'Principiante' | 'Intermedio' | "Avanzado" | null;
    frequency: number | null;
    notificationsEnabled: boolean;
};

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
    name: '',
    gender: null,
    weight: '',
    age: '',
	height: '',
    experience: null,
    frequency: null,
    notificationsEnabled: false,
};

export type StepProps = {
    data: OnboardingData;
    updateData: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
};