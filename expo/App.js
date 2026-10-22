/* =====================================================
   APP EXPO SNACK - CLIENTES (SOMENTE LEITURA)
   Lê a lista de clientes da API publicada no Render.
   O cadastro, a alteração e a exclusão são feitos pelo site.

   1. Abra https://snack.expo.dev
   2. Cole este código no App.js
   3. Troque SEU-PROJETO pela URL do seu serviço no Render
===================================================== */

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";

const API_URL = "https://SEU-PROJETO.onrender.com/api/clientes";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  /* LISTAR - GET /api/clientes */
  const carregarClientes = useCallback(async () => {
    try {
      setErro("");
      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error("Erro HTTP: " + resposta.status);
      }

      const dados = await resposta.json();
      console.log("Clientes:", dados);
      setClientes(dados);
    } catch (error) {
      console.log("Erro:", error);
      setErro(error.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  function recarregar() {
    setAtualizando(true);
    carregarClientes();
  }

  /* CARREGANDO */
  if (carregando) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#1f6feb" />
        <Text style={styles.mensagem}>Carregando clientes...</Text>
        <Text style={styles.detalhe}>
          No plano gratuito o Render pode levar até 1 minuto para "acordar".
        </Text>
      </View>
    );
  }

  /* ERRO */
  if (erro) {
    return (
      <View style={[styles.container, styles.centro]}>
        <Text style={styles.titulo}>Erro</Text>
        <Text style={styles.erro}>Não foi possível carregar os clientes.</Text>
        <Text style={styles.detalhe}>{erro}</Text>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            setCarregando(true);
            carregarClientes();
          }}
        >
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* LISTA */
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={clientes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        refreshing={atualizando}
        onRefresh={recarregar}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>Clientes</Text>
              <Text style={styles.subtitulo}>
                {clientes.length} cliente(s) cadastrado(s)
              </Text>
            </View>
            <TouchableOpacity style={styles.botao} onPress={recarregar}>
              <Text style={styles.botaoTexto}>
                {atualizando ? "..." : "Atualizar"}
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>
                {item.nome ? item.nome.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.id}>ID {item.id}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum cliente cadastrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
  centro: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  lista: {
    padding: 20,
    paddingBottom: 40,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
  },
  subtitulo: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  botao: {
    backgroundColor: "#1f6feb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e5ea",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dbe7fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f6feb",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  email: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },
  id: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  mensagem: {
    marginTop: 15,
    fontSize: 16,
  },
  erro: {
    fontSize: 17,
    color: "#d1242f",
    marginTop: 10,
    textAlign: "center",
  },
  detalhe: {
    marginTop: 10,
    color: "#666",
    textAlign: "center",
  },
  vazio: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },
});
