import { AppColors } from "@/constants/theme";
import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface RatingProps {
	rating: number;
	count?: number;
	size?: number;
	showCount?: boolean;
}

const Rating: React.FC<RatingProps> = ({
	rating,
	count,
	size = 16,
	showCount = true,
}) => {
	const roundedRating = Math.round(rating * 2) / 2;
	const renderStars = () => {
		const stars = [];

		for (let i = 0; i <= Math.floor(roundedRating); i++) {
			stars.push(
				<AntDesign
					name="star"
					key={`star-${i}`}
					size={size}
					color={AppColors.accent[500]}
					fill={AppColors.accent[500]}
				/>
			);
		}

		const emptyStars = 5 - Math.ceil(roundedRating);
		for (let i = 1; i <= emptyStars; i++) {
			stars.push(
				<Feather
					name="star"
                    key={i}
					size={size}
					color={AppColors.accent[500]}
					style={styles.halfStarForeground}
				/>
			);
		}

		return stars;
	};

	return (
		<View style={styles.container}>
			<View>{renderStars()}</View>
		</View>
	);
};

export default Rating;

const styles = StyleSheet.create({
	halfStarForeground: {
		position: "absolute",
	},
	halfStarOverlay: {
		position: "absolute",
		width: "50%",
		overflow: "hidden",
	},
	halfStarBackground: {
		// position: "absolute",
	},
	halfStarContainer: {
		position: "relative",
	},
	count: {
		marginLeft: 4,
		fontSize: 14,
		color: AppColors.text.secondary,
	},
	starsContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
});
