import { useNavigation } from '@react-navigation/native';
import { Image, TouchableOpacity } from 'react-native';

export default function HeaderHomeButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Home');
        } else {
          navigation.navigate('Home');
        }
      }}
      style={{ marginRight: 12 }}
    >
      <Image
        source={require('../assets/images/icon.png')}
        style={{ width: 28, height: 28, opacity: 0.9 }}
      />
    </TouchableOpacity>
  );
}


