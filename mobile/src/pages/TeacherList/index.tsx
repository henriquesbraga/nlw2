import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons'
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native';

function TeacherList (){

    const [favorites, setFavorites] = useState<number[]>([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then((response) => {
            if(response){
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) =>{
                    return teacher.id;
                })
                setFavorites(favoritedTeachersIds);
            }
        })
    }

    useFocusEffect(() => {
        loadFavorites();
    })

    const [teachers, setTeachers] = useState([]);

    const [isFiltersVisible, setIsiltersVisible] = useState(false);

    

    async function handleFiltersSubmit(){
        loadFavorites()

        const response = await api.get('classes', {
            params:{
                subject,
                week_day,
                time
            }
        });
        setTeachers(response.data);
        setIsiltersVisible(false);
    }

    function handleToggleFiltersVisible(){
        setIsiltersVisible(!isFiltersVisible);
    }

    return(
        <View style={styles.container}>
            <PageHeader 
            title="Proffys disponíveis" 
            headerRight={(
                <BorderlessButton onPress={handleToggleFiltersVisible}>
                    <Feather name="filter" size={20} color="#FFF" />
                </BorderlessButton>
            )}>
                { isFiltersVisible && (<View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Qual a matéria?"
                        placeholderTextColor="#C1BCC"
                        value={subject}
                        onChangeText={(text) => {setSubject(text)}}
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="Qual o dia?"
                                placeholderTextColor="#C1BCC"
                                value={week_day}
                                onChangeText={(text) => {setWeekDay(text)}}
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                style={styles.input}
                                placeholder="Qual horário?"
                                placeholderTextColor="#C1BCC"
                                value={time}
                                onChangeText={(text) => {setTime(text)}}
                                />
                            </View>
                        </View>
                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView style={styles.teacherList} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                
                {teachers.map((teacher: Teacher) =>{
                    return (
                    <TeacherItem 
                    key={teacher.id} 
                    teacher={teacher}
                    favorited={favorites.includes(teacher.id)}
                    />
                    );
                })}
                

            </ScrollView>
        </View>
    )
}

export default TeacherList;