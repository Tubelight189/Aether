import { useColorScheme as useRNColorScheme } from 'react-native';
export function useColorScheme() {
  const colorScheme = useRNColorScheme() ?? 'light';
  return { colorScheme, isDarkColorScheme: colorScheme === 'dark' };
}