import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'expo-router'
import Wrapper from '@/components/Wrapper'
import { AppColors } from '@/constants/theme'

const ProfileScreen = () => {
	const {user, logout, checkSession} = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			checkSession();
		}
	}, [user]);

  return (
		<Wrapper>
			{user ? (
				<View>
					<Text>User avaible</Text>
				</View>
			) : (
				<View style={styles.container}>
					<Text>Welcome !</Text>
				</View>
			)}
		</Wrapper>
	);
}

export default ProfileScreen;

const styles = StyleSheet.create({
	profileEmail: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: AppColors.text.primary,
	},
	editProfileText: {
		fontFamily: "Inter-Medium",
		fontSize: 14,
		color: AppColors.primary[500],
	},
	menuContainer: {
		marginTop: 16,
		backgroundColor: AppColors.background.primary,
		borderRadius: 8,
		paddingVertical: 8,
		marginHorizontal: 16,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: AppColors.gray[200],
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	menuItemTitle: {
		fontFamily: "Inter-Medium",
		fontSize: 16,
		color: AppColors.text.primary,
		marginLeft: 12,
	},
	logoutContainer: {
		marginTop: 24,
		//paddingHorizontal: 16,
	},
	logoutButton: {
		backgroundColor: "transparent",
		borderColor: AppColors.error,
	},
	logoutButtonText: {
		color: AppColors.error,
	},
	message: {
		fontFamily: "Inter-Regular",
		fontSize: 16,
		color: AppColors.text.secondary,
		textAlign: "center",
		marginBottom: 24,
	},
	buttonContainer: {
		width: "100%",
		gap: 16,
	},
	loginButton: {
		backgroundColor: AppColors.primary[500],
	},
	buttonText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: AppColors.background.primary,
	},
	signupButton: {
		borderColor: AppColors.primary[500],
		backgroundColor: "transparent",
	},
	signupButtonText: {
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
		color: AppColors.primary[500],
	},
});