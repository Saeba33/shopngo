import { AppColors } from "@/constants/theme";
import React from "react";
import {
	KeyboardTypeOptions,
	TextInput as RNTextInput,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from "react-native";

interface TextInputProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	secureTextEntry?: boolean;
	keyboardType?: KeyboardTypeOptions;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	autoCorrect?: boolean;
	multiline?: boolean;
	numberOfLines?: number;
	style?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<TextStyle>;
	labelStyle?: StyleProp<TextStyle>;
}

const TextInput: React.FC<TextInputProps> = ({
	value,
	onChangeText,
	placeholder,
	label,
	error,
	secureTextEntry = false,
	keyboardType = "default",
	autoCapitalize = "sentences",
	autoCorrect = true,
	multiline = false,
	numberOfLines = 1,
	style,
	inputStyle,
	labelStyle,
}) => {
	return (
		<View style={[styles.container, style]}>
			{label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
			<RNTextInput
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				multiline={multiline}
				numberOfLines={numberOfLines}
				style={[
					styles.input,
					inputStyle,
					multiline && styles.multilineInput,
					error && styles.inputError,
				]}
			/>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

export default TextInput;

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
		width: "100%",
	},
	label: {
		marginBottom: 8,
		fontSize: 14,
		fontWeight: "500",
		color: AppColors.text.primary,
	},
	input: {
		backgroundColor: AppColors.background.secondary,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderWidth: 1.5,
		borderColor: AppColors.gray[300],
		color: AppColors.text.primary,
		fontSize: 15,
	},
	multilineInput: {
		minHeight: 100,
		textAlignVertical: "top",
	},
	inputError: {
		borderColor: AppColors.error,
	},
	errorText: {
		color: AppColors.error,
		fontSize: 12,
		marginTop: 4,
	},
});
