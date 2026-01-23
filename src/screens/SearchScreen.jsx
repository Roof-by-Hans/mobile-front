import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Search Screen Component
 * Allows users to search for content
 */
const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle search query
   * @param {string} query - Search query text
   */
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Integrate with backend search API
      // Expected request: { query }
      // Expected response: { results: [{ id, title, description }] }
      
      // Mock results for demonstration
      const mockResults = [
        { id: '1', title: 'Resultado 1', description: 'Descripción del resultado 1' },
        { id: '2', title: 'Resultado 2', description: 'Descripción del resultado 2' },
      ];
      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render search result item
   * @param {Object} item - Result item
   */
  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultTitle}>{item.title}</Text>
      <Text style={styles.resultDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No se encontraron resultados'
              : 'Ingresa un término de búsqueda'}
          </Text>
        </View>
      )}
    </View>
  );
};

SearchScreen.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  resultItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default SearchScreen;
