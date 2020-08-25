import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  async function handleLikeRepository(id) {
    const update = async () => {
      try {
        const { data } = await api.post(`repositories/${id}/like`);
        setRepositories(repositories.map(project => (
          project.id === id ? data : project
        )));
      } catch (error) {
        alert(error);
      }
    };
    update();
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: repositories } = await api.get('repositories');
        setRepositories(repositories);
      } catch (error) {
        alert(error);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={({ id }) => id}
          renderItem={({ item: { id, title, techs, likes } }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{title}</Text>
              <View style={styles.techsContainer}>
                {(!!techs && techs.length) && techs.map(tech => {
                  if (!tech) return null;
                  return (<Text style={styles.tech}>{tech}</Text>);
                })}
              </View>
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${id}`}
                >
                  {`${likes} curtidas`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(id)}
                testID={`like-button-${id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
