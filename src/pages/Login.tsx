import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  KeyboardAvoidingView, 
  Text, 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import logo from '../assets/logo.png';

import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes';
import React from 'react';

// 🔹 Importando o schema do Zod
import { loginSchema, LoginFormData } from '../validations/loginSchema';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>
}

export function Login({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (user) navigation.navigate('List');
    });
  }, []);

  async function handleSubmit() {
    console.log("➡️ Botão clicado");

    // 🔹 Validação com Zod
    const validation = loginSchema.safeParse({ email, techs });

    if (!validation.success) {
      // Mostra o primeiro erro encontrado
      const firstError = validation.error.errors[0].message;
      Alert.alert("Erro de validação", firstError);
      return;
    }

    // Agora temos dados validados
    const formData: LoginFormData = validation.data;

    try {
      const response = await api.post('/session', { email: formData.email });
      console.log("✅ Resposta da API:", response.data);

      const { _id } = response.data;

      await AsyncStorage.setItem('user', _id);
      await AsyncStorage.setItem('techs', formData.techs);

      console.log("✅ Dados salvos no AsyncStorage");
      navigation.navigate('List');
    } catch (err) {
      console.log("❌ Erro no login:", err);
      Alert.alert("Erro", "Não foi possível fazer login. Tente novamente.");
    }
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <Image source={logo} />
      <View style={styles.form}>
        <Text style={styles.label}>SEU E-MAIL *</Text>
        <TextInput
          style={styles.input}
          placeholder='Seu e-mail'
          placeholderTextColor="#999"
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>TECNOLOGIAS *</Text>
        <TextInput
          style={styles.input}
          placeholder='Tecnologias de interesse'
          placeholderTextColor="#999"
          autoCapitalize='words'
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Encontrar spots</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 30,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  }, 
  button: {
    height: 42,
    backgroundColor: '#f05a5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
