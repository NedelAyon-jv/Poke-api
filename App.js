import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet, TextInput } from 'react-native';

const PokeList = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
                const data = await response.json();
                const pokemonWithImages = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const res = await fetch(pokemon.url);
                        const details = await res.json();
                        return { ...pokemon, image: details.sprites.front_default };

                    })
                );

                setPokemonList(pokemonWithImages);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los Pokémon:', error);
            
            }
        };

        fetchPokemon();
    }, []);

    const toggleSelection = (name) => {
        setSelectedPokemon((prevSelected) =>
            prevSelected.includes(name)
                ? prevSelected.filter((pokemon) => pokemon !== name)
                : [...prevSelected, name]

        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#FF4500" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Pokémon</Text>
            <TextInput
                placeholder="Buscar Pokémon"
                style={styles.searchInput}
            />
            <FlatList
                data={pokemonList}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.item, selectedPokemon.includes(item.name) && styles.selectedItem]}
                        onPress={() => toggleSelection(item.name)}
                    >
                        <Image source={{ uri: item.image }} style={styles.pokemonImage} />
                        <Text style={styles.pokemonName}>{item.name}</Text>
                        <Text style={styles.checkbox}>
                            {selectedPokemon.includes(item.name) ? '⭐' : '✩'}
                        </Text>
                    </TouchableOpacity>

                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1,
        padding: 20,
        backgroundColor: '#33ffc7',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#45c2d8',
        borderRadius: 8,
        elevation: 2,
    },
    selectedItem: {
        backgroundColor: '#00b9ff',
    },
    pokemonImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    pokemonName: {
        fontSize: 18,
        textTransform: 'capitalize',
        flex: 1,
    },
    checkbox: {
        fontSize: 20,
    },
    selectedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    selectedList: {
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default PokeList;